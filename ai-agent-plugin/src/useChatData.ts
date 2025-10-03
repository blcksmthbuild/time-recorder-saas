import axios from "axios";

const FASTIFY_API_URL = import.meta.env.VITE_FASTIFY_API_URL || "";

interface ChatRequestData {
  prompt: string;
  role: "admin" | "user";
  email: string;
  token: string;
}

interface ChatResponseData {
  response: string;
  tool_used: string | null;
  tool_output: unknown;
}

export const fetchChatData = async (
  data: ChatRequestData
): Promise<ChatResponseData> => {
  if (!data.token) {
    throw new Error("Token is missing for chat request.");
  }

  console.log("--------------------------------");
  console.log("FASTIFY_API_URL", FASTIFY_API_URL);
  console.log("--------------------------------");

  const response = await axios.post<ChatResponseData>(
    `${FASTIFY_API_URL}/ai/chat`,
    {
      prompt: data.prompt,
      role: data.role,
      email: data.email,
    },
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );

  return response.data;
};
