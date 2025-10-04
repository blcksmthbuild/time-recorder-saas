import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { fetchChatData } from "./useChatData";

const ChatContainer = styled(Container)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  boxSizing: "border-box",
}));

const MessagesWindow = styled(Paper)({
  flexGrow: 1,
  overflowY: "auto",
  padding: "16px",
  marginBottom: "16px",
  backgroundColor: "#f5f5f5",
});

const MessageBubble = styled("div")<{ role: "user" | "admin" | "agent" }>(
  ({ role, theme }) => ({
    padding: "10px 15px",
    borderRadius: "15px",
    maxWidth: "80%",
    wordBreak: "break-word",
    alignSelf: role === "user" ? "flex-end" : "flex-start",
    backgroundColor: role === "user" ? theme.palette.primary.main : "#ffffff",
    color: role === "user" ? "white" : theme.palette.text.primary,
    boxShadow: theme.shadows[1],
  })
);

interface UserData {
  id: number;
  email: string;
  role: "user" | "admin";
  token: string;
}

interface AIAgentAppProps {
  user?: UserData;
}

interface ChatMessage {
  role: "user" | "admin" | "agent";
  content: string;
  toolUsed?: string;
  toolOutput?: unknown;
}

function AIAgentApp({ user }: AIAgentAppProps) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return <ChatContainer>User not found</ChatContainer>;
  }

  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentPrompt = prompt.trim();
    if (!currentPrompt || isLoading) return;

    console.log("--------------------------------");
    console.log("currentPrompt", currentPrompt);
    console.log("--------------------------------");

    const userMessage: ChatMessage = { role: "user", content: currentPrompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);

    try {
      const responseData = await fetchChatData({
        prompt: currentPrompt,
        role: user?.role,
        email: user?.email,
        token: user?.token,
      });

      console.log("--------------------------------");
      console.log("responseData", responseData);
      console.log("--------------------------------");

      const agentResponse: ChatMessage = {
        role: "agent",
        content: responseData.response || "No text response received.",
        toolUsed: responseData.tool_used || undefined,
        toolOutput: responseData.tool_output,
      };

      console.log("--------------------------------");
      console.log("agentResponse", agentResponse);
      console.log("--------------------------------");

      setMessages((prev) => [...prev, agentResponse]);
    } catch (error) {
      console.error("Chat API Error:", error);
      const errorMessage: ChatMessage = {
        role: "agent",
        content: "Sorry, I ran into an error trying to process your request.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer maxWidth="md">
      <Typography variant="h5" gutterBottom>
        AI Agent ({user?.role})
      </Typography>

      <MessagesWindow elevation={3}>
        <List style={{ display: "flex", flexDirection: "column" }}>
          {messages.length === 0 ? (
            <Typography
              color="textSecondary"
              align="center"
              style={{ marginTop: "10px" }}
            >
              How can I help you with your time logs or projects?
            </Typography>
          ) : (
            messages.map((msg, index) => (
              <ListItem
                key={index}
                style={{
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  padding: "8px 0",
                }}
              >
                <MessageBubble role={msg.role}>
                  <Typography
                    variant="body2"
                    style={{ fontWeight: msg.role === "user" ? 500 : 400 }}
                  >
                    {msg.content}
                  </Typography>
                  {msg.toolUsed && user?.role === "admin" && (
                    <Box
                      sx={{
                        mt: 1,
                        p: 1,
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "5px",
                        fontSize: "0.75rem",
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>Tool Used:</span>{" "}
                      {msg.toolUsed}
                    </Box>
                  )}
                </MessageBubble>
              </ListItem>
            ))
          )}
          {isLoading && (
            <ListItem
              style={{ justifyContent: "flex-start", padding: "8px 0" }}
            >
              <CircularProgress size={20} style={{ marginRight: "10px" }} />
              <Typography color="textSecondary">
                Agent is thinking...
              </Typography>
            </ListItem>
          )}
        </List>
      </MessagesWindow>

      <Box component="form" onSubmit={handleSendPrompt} display="flex">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
          size="small"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!prompt.trim() || isLoading}
          style={{ marginLeft: "10px", minWidth: "100px" }}
          endIcon={
            isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SendIcon />
            )
          }
        >
          {isLoading ? "Sending" : "Send"}
        </Button>
      </Box>
    </ChatContainer>
  );
}

export default AIAgentApp;
