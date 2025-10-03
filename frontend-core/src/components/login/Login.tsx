import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import styled from "@emotion/styled";
import { useAuth } from "../../auth/useAuth";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const CenteredContainer = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
});

const FormPaper = styled(Paper)({
  width: "100%",
  maxWidth: 420,
  padding: 24,
  boxSizing: "border-box",
});

export const Login = () => {
  console.log("--------------------------------");
  console.log("LOGIN COMPONENT");
  console.log("--------------------------------");
  const { loginMutation } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { token } = useAuth();
  const navigate = useNavigate();

  const isLoading = loginMutation.isPending;

  const handleLogin = (email: string, password: string) => {
    console.log("--------------------------------");
    console.log("LOGIN", email, password);
    console.log("--------------------------------");
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
      }
    );
  };

  const getErrorMessage = () => {
    if (loginMutation.isError) {
      return `Login failed. Please check your credentials and try again. ${loginMutation.error}`;
    }

    return null;
  };

  console.log("--------------------------------");
  console.log("TOKEN", token);
  console.log("--------------------------------");
  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <CenteredContainer>
      <FormPaper elevation={3}>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(email, password);
          }}
          noValidate
        >
          <Typography variant="h5" component="h1" gutterBottom>
            Sign in
          </Typography>

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            fullWidth
            required
            autoComplete="email"
            autoFocus
            disabled={isLoading}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            fullWidth
            required
            autoComplete="current-password"
            disabled={isLoading}
          />

          {loginMutation.error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {getErrorMessage()}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </Box>
      </FormPaper>
    </CenteredContainer>
  );
};
