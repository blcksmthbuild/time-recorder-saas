import { useAuth } from "../../auth/useAuth";
import { AuthForm } from "./AuthForm";

export const Authentication = () => {
  const { registerMutation, loginMutation } = useAuth();
  const { mode, setMode } = useAuth();

  const handleRegistration = (
    email: string,
    password: string,
    role: "admin" | "user" = "user"
  ) => {
    if (mode === "register") {
      registerMutation.mutate({ email, password, role });
    }
  };

  const handleLogin = (email: string, password: string) => {
    if (mode === "login") {
      loginMutation.mutate({ email, password });
    }
  };

  const handleModeChange = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  const getErrorMessage = () => {
    if (registerMutation.isError) {
      return `Registration failed. Please check your credentials and try again. ${registerMutation.error}`;
    }

    if (loginMutation.isError) {
      return `Login failed. Please check your credentials and try again. ${loginMutation.error}`;
    }

    return null;
  };

  const submitHandler = (
    email: string,
    password: string,
    role?: "admin" | "user"
  ) => {
    if (mode === "login") {
      handleLogin(email, password);
    } else {
      handleRegistration(email, password, role);
    }
  };

  console.log("mode", mode);

  return (
    <AuthForm
      mode={mode}
      onSubmit={submitHandler}
      isLoading={loginMutation.isPending || registerMutation.isPending}
      error={getErrorMessage()}
      onModeChange={handleModeChange}
    />
  );
};
