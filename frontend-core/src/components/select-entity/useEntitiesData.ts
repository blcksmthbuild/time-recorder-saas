import axios from "axios";
import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

export interface Entity {
  id: string;
  name: string;
  users: [];
}

const FASTIFY_API_URL = import.meta.env.VITE_FASTIFY_API_URL;

type EntitiesResponse = { entities: Entity[]; message: string };
type CreateEntityDto = { name: string };

const fetchEntities = async (token: string): Promise<Entity[]> => {
  const { data } = await axios.get<EntitiesResponse>(
    `${FASTIFY_API_URL}/auth/entities`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data.entities;
};

const addEntity = async (
  token: string,
  dto: CreateEntityDto
): Promise<Entity> => {
  const { data } = await axios.post<{ entity: Entity; message: string }>(
    `${FASTIFY_API_URL}/auth/entities`,
    dto,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data.entity;
};

export const useEntitiesData = (
  token: string | null,
  options?: UseQueryOptions<Entity[], Error>
) => {
  return useQuery({
    queryKey: ["entities", !!token],
    enabled: !!token,
    queryFn: () => fetchEntities(token as string),
    ...options,
  });
};

export const useAddEntity = (
  token: string | null,
  options?: UseMutationOptions<Entity, Error, CreateEntityDto>
) => {
  return useMutation({
    mutationFn: (dto: CreateEntityDto) => addEntity(token as string, dto),
    ...options,
  });
};
