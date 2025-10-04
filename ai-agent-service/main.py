import uvicorn
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field   
from app.fastify_api_client import FastifyApiClient 
from app.monday_client import MondayClient 
from app.tools import ALL_TOOLS 
from google import genai
from google.genai import types
import json

load_dotenv()

app = FastAPI(
    title="AI Agent Microservice",
    description="Tool-Calling AI Agent for Time Logging and Reporting.",
    version="1.0.0"
)

client = genai.Client() 
GEMINI_MODEL = "gemini-2.5-flash-lite"





# -------------------------------------------------------------------
# Request Body Model for the /chat route
# -------------------------------------------------------------------
class ChatRequest(BaseModel):
    prompt: str = Field(description="User request text sent to the AI Agent.")
    user_role: str = Field(description="Logged-in user's role ('admin' or 'user').")
    user_email: str = Field(description="User's email address used to log in to the Fastify backend.")


@app.post("/chat")
async def chat_with_agent(request: ChatRequest):
    """
    Processes the user request, performs the necessary tool calls, and returns a response.
    """
    try:
        fastify_client = FastifyApiClient(request.user_role)
        monday_client = MondayClient()
        tools_for_llm = [t["func"] for t in ALL_TOOLS]
        system_message = (
            f"You are an AI assistant in the company's time tracking system. "
            f"Current role: {request.user_role}. "
            f"Strictly follow the permission constraints specified in each Tool's description when making decisions. "
            f"Only invoke a Tool if the user request and the current role allow it."
        )

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=[request.prompt],
            config=types.GenerateContentConfig(
                tools=tools_for_llm,
                system_instruction=system_message,
                tool_config=types.ToolConfig(
                    function_calling_config=types.FunctionCallingConfig(
                        mode="ANY"  
                    )
                )
            )
        )

        if response.function_calls:
            function_call = response.function_calls[0]
            tool_name = function_call.name
            tool_args = dict(function_call.args)
            
            tool_definition = next(
                (t for t in ALL_TOOLS if t["name"] == tool_name), None
            )

            if tool_definition:
                
                tool_output = {}
                
                # -----------------------------------------------------------
                # MONDAY.COM TOOL-OK (Admin funkciók)
                # -----------------------------------------------------------
                if tool_name == 'create_new_project':
                    if request.user_role != 'admin':
                        tool_output = {"error": "PERMISSION_DENIED", "message": "Only Admins can create a new project."}
                    else:
                        tool_output = monday_client.create_project(**tool_args)
                
                elif tool_name == 'create_new_task':
                    if request.user_role != 'admin':
                        tool_output = {"error": "PERMISSION_DENIED", "message": "Only Admins can create a new task."}
                    else:
                        tool_output = monday_client.create_task(**tool_args)

                elif tool_name == 'list_monday_clients':
                    tool_output = monday_client.list_clients()

                # -----------------------------------------------------------
                # FASTIFY TOOL-OK (Normal User funkciók)
                # -----------------------------------------------------------
                elif tool_name == 'log_user_time':
                    tool_output = fastify_client.log_time(**tool_args)

                elif tool_name == 'get_time_report':
                    tool_output = fastify_client.get_report(**tool_args)

                elif tool_name == 'get_top_project_summary':
                    tool_output = fastify_client.get_top_project(**tool_args)

                tool_response_part = types.Part.from_function_response(
                    name=tool_name, 
                    response={"result": tool_output}
                )

                conversation_history = [
                    request.prompt,
                    types.Content(
                        role="model",
                        parts=[types.Part.from_function_call(name=function_call.name, args=dict(function_call.args))]
                    ),
                    types.Content(role="tool", parts=[tool_response_part])
                ]

                second_response = client.models.generate_content(
                    model=GEMINI_MODEL,
                    contents=conversation_history,
                    config=types.GenerateContentConfig(
                        tools=tools_for_llm,
                        system_instruction=system_message
                    )
                )

                return {
                    "response": second_response.text,
                    "tool_used": tool_name,
                    "tool_output": tool_output
                }

        return {
            "response": response.text,
            "tool_used": None,
            "tool_output": None
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 4000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)