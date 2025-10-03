import { useAuth } from "../../auth/useAuth";

export const Dashboard = (): React.ReactNode => {
  console.log("--------------------------------");
  console.log("DASHBOARD COMPONENT RENDERED");
  console.log("--------------------------------");
  const { user, logout } = useAuth();
  return (
    <div className="container">
      <div>
        <h1>Welcome! {user?.email}</h1>
        <button onClick={() => logout()} className="btn-submit">
          logout
        </button>
      </div>
    </div>
  );
};
