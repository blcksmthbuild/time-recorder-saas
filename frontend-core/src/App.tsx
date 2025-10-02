import styled from "@emotion/styled";
import { Authentication } from "./components/auth/Authentication";
import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import { Dashboard } from "./components/dashboard/Dashboard";

const AppContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
`;

function App() {
  return (
    <AppContainer className="app-container">
      <ReactRouterRoutes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Authentication />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </ReactRouterRoutes>
    </AppContainer>
  );
}

export default App;
