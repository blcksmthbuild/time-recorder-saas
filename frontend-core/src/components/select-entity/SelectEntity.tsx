import styled from "@emotion/styled";
import { useAuth } from "../../auth/useAuth";
import { useEntitiesData, type Entity } from "./useEntitiesData";
import { EntityCard } from "./EntityCard";
import { useNavigate } from "react-router-dom";
import type { UserData } from "../../auth/AuthContext";

export const SelectEntity = () => {
  const { user, logout, setAuthData } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, error } = useEntitiesData(
    user?.token as string | null,
    {
      enabled: !!user?.token,
      queryKey: ["entities", user?.token],
    },
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log("--------------------------------");
  console.log("ENTITIES", data);
  console.log("USER", user);
  console.log("--------------------------------");

  const entities = data as unknown as Entity[] | undefined;

  const handleSelect = (id: number) => {
    setAuthData({
      ...(user as UserData),
      selectedEntityId: id,
    });
    navigate("/dashboard");
  };

  return (
    <Page>
      <Heading>Select Entity</Heading>
      <Grid>
        {entities?.map((entity) => (
          <EntityCard
            key={entity.id}
            id={entity.id}
            name={entity.name}
            onClick={() => handleSelect(Number(entity.id))}
          />
        ))}
      </Grid>
      <div>
        <button onClick={() => logout()} className="btn-submit">
          logout
        </button>
      </div>
    </Page>
  );
};

const Grid = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: 16,
});

const Page = styled.div({
  maxWidth: 1100,
  margin: "0 auto",
  padding: 16,
});

const Heading = styled.h1({
  margin: "16px 0 24px",
  fontSize: 22,
});
