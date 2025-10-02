from typing import Optional, Dict, Any 
from pydantic import BaseModel, Field

# -------------------------------------------------------------------
# 1. TOOL DEFINITIONS (for the LLM)
# -------------------------------------------------------------------

class CreateProjectInput(BaseModel):
    """Input parameters for creating a new project."""
    name: str = Field(description="Project name, e.g., 'UX redesign'")
    client_id: str = Field(description="Project client ID, e.g., from Monday.com.")

class LogTimeInput(BaseModel):
    """Input parameters for logging time."""
    duration_hours: float = Field(description="Logged time in hours (e.g., 2.5).")
    task_name: str = Field(description="Short description of the task you worked on.")
    monday_client_id: str = Field(description="Client identifier to which the task belongs.")

# -------------------------------------------------------------------
# 2. TOOL IMPLEMENTATIONS
# ⚠️ Only Pydantic-style arguments are accepted (permissions handled in main.py)
# -------------------------------------------------------------------

def create_new_project(name: str, client_id: str) -> Dict[str, Any]:
    """
    Creates a new project. ONLY users with Admin role may invoke this.
    The Fastify call and permission checks happen in main.py.
    """
    # Return the arguments to be processed by main.py
    return {"name": name, "client_id": client_id, "status": "Tool function called successfully."}


def log_user_time(duration_hours: float, task_name: str, monday_client_id: str) -> Dict[str, Any]:
    """
    Records time logged by the user. Any authenticated user may invoke this.
    The Fastify call and checks happen in main.py.
    """
    return {"duration_hours": duration_hours, "task_name": task_name, "monday_client_id": monday_client_id, "status": "Tool function called successfully."}

def create_new_task(project_identifier: str, task_identifier: str, description: Optional[str] = None) -> Dict[str, Any]:
    """
    Creates a new task in the external system (e.g., Monday.com) under a specific project.
    Only users with 'admin' role are authorized to create tasks.
    
    Args:
        project_identifier: The name or unique ID of the existing project.
        task_identifier: The name of the new task (e.g., 'Internal Meeting', 'Code Review').
        description: Optional detailed description of the task.
    
    Returns:
        The result of the Fastify API call (success or error JSON).
    """
    pass 


def get_time_report(start_date: str, end_date: str, user_id: Optional[int] = None) -> Dict[str, Any]:
    """
    Generates a time log report for a specified date range.
    The start_date and end_date are mandatory (YYYY-MM-DD format).
    The user_id is optional; if omitted, the report returns data for the currently logged-in user.
    
    Args:
        start_date: The start date for the report (YYYY-MM-DD format).
        end_date: The end date for the report (YYYY-MM-DD format).
        user_id: Optional filter for a specific user's ID. Use with caution (Admin access recommended).
    
    Returns:
        The result of the Fastify API call (report data or error JSON).
    """
    pass

def list_monday_clients() -> Dict[str, Any]:
    """
    Retrieves a list of all clients/boards from the external Monday.com system. 
    This is necessary for the AI Agent to identify existing clients.
    
    Returns:
        The list of clients/boards.
    """
    pass

def get_top_project_summary(start_date: Optional[str] = None, end_date: Optional[str] = None) -> Dict[str, Any]:
    """
    Identifies the project with the highest number of logged hours within a specified date range 
    from the Time Logging module (Fastify DB). Requires 'admin' role.
    
    Args:
        start_date: Optional start date for the aggregation (YYYY-MM-DD format).
        end_date: Optional end date for the aggregation (YYYY-MM-DD format).
    
    Returns:
        The project identifier and the total hours logged for that project.
    """
    pass

# -------------------------------------------------------------------
# 3. ALL TOOLS LIST (for the primary API call)
# -------------------------------------------------------------------

ALL_TOOLS = [
    {
        "func": create_new_project,
        "input_model": CreateProjectInput,
        "name": "create_new_project",
        "description": "Creates a new project in the time logging module. ADMIN ONLY! (Input: name, client_id)",
    },
    {
        "func": log_user_time,
        "input_model": LogTimeInput,
        "name": "log_user_time",
        "description": "Logs a user's working time for a task. Any authenticated user may use it. (Input: duration_hours, task_name, monday_client_id)",
    },
    {
        "name": "create_new_task",
        "func": create_new_task,
        "description": "Used to create a new task within an existing project in the external system (e.g., Monday.com). Requires 'admin' role."
    },
    {
        "name": "get_time_report",
        "func": get_time_report,
        "description": "Used to generate a time log report based on a date range and optionally a specific user. This is key for answering summary questions."
    },
    {
        "name": "list_monday_clients",
        "func": list_monday_clients,
        "description": "Used to fetch the current list of clients (projects/boards) from Monday.com."
    },
    {
        "name": "get_top_project_summary",
        "func": get_top_project_summary,
        "description": "Used by the Admin to determine which single project has the most logged hours in a given period."
    },
]