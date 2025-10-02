import os
import requests
from typing import Dict, Any, Optional

BASE_URL = os.getenv("FASTIFY_API_URL")

class FastifyApiClient:
    """Client for the Fastify Time Log API."""

    def __init__(self, user_role: str):

        self.user_role = user_role
        # This is a simplified login mechanism, assuming the AI Agent logs in as a
        # fixed, pre-registered AI User / Admin user. In a real SaaS, the JWT
        # would likely come from elsewhere (e.g., frontend).
        
        # Because the task focuses on permission checks, we use the role to log in.
        # (Requires an AI user and AI admin user in the DB.)
        
        if user_role == 'admin':
            email = "ai-admin@platform.com"
            password = os.getenv("AI_ADMIN_PASSWORD", "defaultpass") 
        else: 
            email = "ai-user@platform.com"
            password = os.getenv("AI_USER_PASSWORD", "defaultpass") 

        login_url = f"{BASE_URL}/auth/login"
        
        try:
            response = requests.post(login_url, json={"email": email, "password": password})
            response.raise_for_status()

            response_data = response.json()
            user_data = response_data.get('user')

            if not user_data or not user_data.get('token'):
                raise Exception("Login failed: User object or token is missing from the Fastify response.")

            self.token = user_data.get('token')

            if not self.token:
                 raise Exception("Login failed: No token received.")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to log in to Fastify backend ({login_url}): {e}")

    def _make_request(self, method: str, path: str, json_data: Optional[Dict[str, Any]] = None) -> Any:
        """Shared method for all API requests."""
        if not self.token:
            raise Exception("API client not authenticated. Token is missing.")

        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        url = f"{BASE_URL}/{path}"

        try:
            response = requests.request(method, url, headers=headers, json=json_data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            try:
                error_data = response.json()
                error_message = error_data.get('message') or error_data.get('error') or str(e)
            except Exception:
                error_message = f"Fastify server error: {response.status_code}."

            return {
                "error": "API_ERROR",
                "status_code": response.status_code,
                "message": error_message
            }
        except requests.exceptions.RequestException as e:
            return {
                "error": "NETWORK_ERROR",
                "message": f"Network error when trying to reach Fastify server: {str(e)}."
            }

    # ----------------------------------------------------------------
    # TOOL CALLS (TOOL IMPLEMENTATION)
    # ----------------------------------------------------------------
    def log_time(self, duration_hours: float, task_name: str, monday_client_id: str) -> Dict[str, Any]:
        """Log time for the user (Normal User Tool)."""
        
        return self._make_request(
            "POST", 
            "timelog/log-time", 
            json_data={
                "durationHours": duration_hours,
                "taskName": task_name,
                "mondayClientId": monday_client_id
            }
        )

    def get_report(self, start_date: str, end_date: str, user_id: Optional[int] = None) -> Dict[str, Any]:
        """Generates a time log report (Query Tool)."""
        
        # A Fastify valószínűleg query paramétereket vár a GET kéréshez
        params = {
            "from": start_date,
            "to": end_date,
        }
        if user_id:
            params["userId"] = str(user_id) # A Fastify URL query paraméterként stringet vár
            
        # A _make_request metódus már kezeli a query_params-t!
        return self._make_request(
            "GET", 
            "timelog/report", 
            json_data=params
        )

    def get_top_project(self, start_date: Optional[str] = None, end_date: Optional[str] = None) -> Dict[str, Any]:
        """Get the project with the highest logged hours (Admin Tool)."""
        
        if self.user_role != 'admin':
            return {"error": "PERMISSION_DENIED", "message": "Only Admins can use the top project report."}
            
        params = {}
        if start_date:
            params["from"] = start_date
        if end_date:
            params["to"] = end_date
            
        return self._make_request(
            "GET", 
            "timelog/reports/top-project", 
            json_data=params
        )