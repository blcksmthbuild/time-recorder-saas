import styled from "@emotion/styled";

export interface EntityCardProps {
  id: string;
  name: string;
  onClick?: (id: string) => void;
}

const Card = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: 16,
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "#fff",
  cursor: "pointer",
  transition: "box-shadow 160ms ease, transform 160ms ease",
  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
  userSelect: "none",
  ["&:hover"]: {
    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
    transform: "translateY(-1px)",
  },
});

const Title = styled.div({
  fontSize: 16,
  fontWeight: 600,
  lineHeight: 1.3,
});

const Subtitle = styled.div({
  fontSize: 12,
  opacity: 0.6,
});

export const EntityCard = ({ id, name, onClick }: EntityCardProps) => {
  return (
    <Card
      onClick={() => onClick?.(id)}
      role="button"
      aria-label={`Select ${name}`}
    >
      <Title>{name}</Title>
      <Subtitle>ID: {id}</Subtitle>
    </Card>
  );
};
