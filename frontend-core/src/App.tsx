import { Suspense } from "react";
import styled from "@emotion/styled";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Login } from "./components/login/Login";
import { DashboardContainer } from "./components/dashboard-container/DashboardContainer";
import { SelectEntity } from "./components/select-entity/SelectEntity";
import { usePluginRegistry } from "./components/plugins/usePluginRegistry";
import RemotePluginWrapper from "./components/plugins/RemotePluginWrapper";
import { useAuth } from "./auth/useAuth";

const AppContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
`;

const AppRoutes = () => {
  const registryQuery = usePluginRegistry();
  const registryMap = registryQuery.data || {};
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/select-entity" element={<SelectEntity />} />
        <Route
          path="/"
          element={
            <DashboardContainer>
              <Outlet />
            </DashboardContainer>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          {Object.keys(registryMap)?.length > 0 &&
            Object.keys(registryMap).map((key) => (
              <Route
                key={key}
                path={`plugin/${key}`}
                element={
                  <Suspense
                    fallback={<div>{registryMap[key].name} Loading...</div>}
                  >
                    <RemotePluginWrapper pluginKey={key} user={user} />
                  </Suspense>
                }
              />
            ))}

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AppContainer className="app-container">
      <AppRoutes />
    </AppContainer>
  );
}

export default App;
