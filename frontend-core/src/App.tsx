import styled from "@emotion/styled";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Login } from "./components/login/Login";

const AppContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
`;

function App() {
  return (
    <AppContainer className="app-container">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </AppContainer>
  );
}

export default App;
