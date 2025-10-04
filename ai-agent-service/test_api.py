import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
import json

load_dotenv()

client = genai.Client() 
GEMINI_MODEL = "gemini-2.5-flash-lite"

try:
    print("Testing Google API...")
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=["Hello, how are you?"],
        config=types.GenerateContentConfig(
            system_instruction="You are a helpful assistant."
        )
    )
    print(f"Response: {response.text}")
    print("API test successful!")
except Exception as e:
    print(f"API test failed: {str(e)}")
    print(f"Error type: {type(e)}")
