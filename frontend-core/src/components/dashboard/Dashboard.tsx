import { useAuth } from "../../auth/useAuth";

export const Dashboard = (): React.ReactNode => {
  console.log("--------------------------------");
  console.log("DASHBOARD COMPONENT RENDERED");
  console.log("--------------------------------");
  const auth = useAuth();
  return (
    <div className="container">
      <div>
        <h1>Welcome! {auth.user?.email}</h1>
        <button onClick={() => auth.logout()} className="btn-submit">
          logout
        </button>
      </div>
    </div>
  );
};
