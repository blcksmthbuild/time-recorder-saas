import os
import requests
from typing import Dict, Any, Optional

MONDAY_API_URL = "https://api.monday.com/v2"
API_KEY = os.getenv("MONDAY_API_KEY")

class MondayClient:
    """
    Client for the Monday.com GraphQL API.
    Used by the AI Agent for creating projects and tasks (Admin Tools).
    """

    def __init__(self):
        if not API_KEY:
            print("WARNING: MONDAY_API_KEY environment variable not set. Running in simulation mode.")

        if not API_KEY:
            raise EnvironmentError(
                "MONDAY_API_KEY environment variable not set. Cannot run in live mode."
            )
        
        self.headers = {
            "Authorization": API_KEY,
            "Content-Type": "application/json"
        }
        self.board_id = os.getenv("MONDAY_PROJECT_BOARD_ID", "12345")

        if not self.board_id:
            print("WARNING: MONDAY_PROJECT_BOARD_ID is not set. Project creation tools may fail.")
        
    def _execute_query(self, query: str, variables: Dict[str, Any] = None) -> Dict[str, Any]:
        payload = {'query': query, 'variables': variables}
        
        try:
            response = requests.post(
                MONDAY_API_URL, 
                json=payload, 
                headers=self.headers
            )
            response.raise_for_status()
            response_json = response.json()
            
            if 'errors' in response_json:
                error_msg = response_json['errors'][0].get('message', 'Unknown Monday.com error')
                return {"error": "MONDAY_GRAPHQL_ERROR", "message": error_msg}
            
            return response_json
            
        except requests.exceptions.RequestException as e:
            return {"error": "MONDAY_API_NETWORK_ERROR", "message": str(e)}

    # ----------------------------------------------------------------
    # AI AGENT TOOL IMPLEMENTATION
    # ----------------------------------------------------------------
    def create_project(self, name: str, client_id: str) -> Dict[str, Any]:


        # NOTE: A client_id-t a Monday-on egy oszlopba kellene írni. 
        # A legegyszerűbb, ha egy szöveges oszlopot ("text_column") feltételezünk.
        # Itt csak az Item-et hozzuk létre a fő boardon (Ami a projektet reprezentálja).
        

        if not self.board_id:
            return {"error": "CONFIGURATION_ERROR", "message": "MONDAY_PROJECT_BOARD_ID is missing for project creation."}

        query = f"""mutation {{ 
            create_item (
                board_id: {self.board_id}, 
                item_name: "{name}"
            ) {{
                id
                name
            }}
        }}"""
        
        result = self._execute_query(query)
        if result.get('error'):
            return result
            
        return {
            "success": True, 
            "message": f"Project '{name}' successfully created on Monday.com (ID: {result['data']['create_item']['id']}).",
            "data": result['data']['create_item']
        }

    def _get_project_item_id(self, project_name: str) -> Optional[int]:
        """Finds the Project Item ID by name on the main Board."""
        
        # 💡 Important: This query will fetch every Item from the board, 
        # which can cause performance issues with large boards. 
        # Monday API does not support direct "search by Item Name" functionality for Items.
        
        query = f"""query {{
          boards(ids: [{self.board_id}]) {{
            items_page(query_params: {{rules: [{{column_id: "name", compare_value: ["{project_name}"], operator: equals}}]}}) {{
              items {{
                id
              }}
            }}
          }}
        }}"""
        
        result = self._execute_query(query)
        
        if result.get('error'):
            print(f"DEBUG: Error finding project: {result['message']}")
            return None
            
        items_page = result.get('data', {}).get('boards', [{}])[0].get('items_page', {})
        items = items_page.get('items', [])
        
        if items:
            return int(items[0]['id'])
        
        return None

    def create_task(self, project_name: str, new_task_name: str, description: str = "") -> Dict[str, Any]:
        """Admin Tool: Create a new Task/Sub-item on Monday.com."""
        
        if not self.board_id:
            return {"error": "CONFIGURATION_ERROR", "message": "MONDAY_PROJECT_BOARD_ID is missing for task creation."}

        # 1. Find the parent Item (Project) ID
        parent_item_id = self._get_project_item_id(project_name)
        
        if not parent_item_id:
            return {
                "error": "PROJECT_NOT_FOUND",
                "message": f"The '{project_name}' project not found on Monday.com."
            }

        # 2. GraphQL Mutation to create a Sub-item (Task)
        # Note: the description will go into a Sub-item column on Monday.com,
        # amit most a bonyolultság miatt kihagyunk, csak a nevet adjuk meg.
        query = f"""mutation {{ 
            create_subitem (
                parent_item_id: {parent_item_id}, 
                item_name: "{new_task_name}"
            ) {{
                id
                name
            }}
        }}"""
        
        result = self._execute_query(query)
        if result.get('error'):
            return result
            
        # Return the successfully created sub-item data
        return {
            "success": True, 
            "message": f"Task '{new_task_name}' successfully created to the '{project_name}' project.",
            "data": result['data']['create_subitem']
        }

    def list_clients(self) -> Dict[str, Any]:
            """Retrieves the list of boards/clients from Monday.com."""
            
            query = """query {
            boards (limit: 50) {
                id
                name
                type 
            }
            }"""
            
            result = self._execute_query(query)
            
            if result.get('error'):
                return result

            boards = result.get('data', {}).get('boards', [])
            
            client_list = []
            for board in boards:
                client_list.append({"id": board['id'], "name": board['name']})

            return {
                "success": True, 
                "message": f"{len(client_list)} clients (boards) retrieved from Monday.com.",
                "data": client_list
            }