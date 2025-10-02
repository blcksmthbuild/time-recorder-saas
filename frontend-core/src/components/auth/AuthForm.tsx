import { useState } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

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

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (email: string, password: string, role?: "admin" | "user") => void;
  isLoading: boolean;
  error: string | null;
  onModeChange: () => void;
}

export const AuthForm = ({
  mode,
  onSubmit,
  isLoading,
  error,
  onModeChange,
}: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(email, password, role);
  };

  const isLogin = mode === "login";
  const title = isLogin ? "Sign in" : "Create account";
  const submitText = isLogin ? "Sign in" : "Create account";
  const switchText = isLogin
    ? "Don't have an account? Sign up"
    : "Already have an account? Sign in";

  return (
    <CenteredContainer>
      <FormPaper elevation={3}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Typography variant="h5" component="h1" gutterBottom>
            {title}
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
            autoComplete={isLogin ? "current-password" : "new-password"}
            disabled={isLoading}
          />

          {!isLogin && (
            <FormControl fullWidth margin="normal" disabled={isLoading}>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value as "admin" | "user")}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          )}

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
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
                {isLogin ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              submitText
            )}
          </Button>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Link
              component="button"
              type="button"
              onClick={onModeChange}
              sx={{ cursor: "pointer" }}
            >
              {switchText}
            </Link>
          </Box>
        </Box>
      </FormPaper>
    </CenteredContainer>
  );
};
