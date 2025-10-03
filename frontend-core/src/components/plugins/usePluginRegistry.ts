// src/hooks/usePluginRegistry.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../auth/useAuth";

const FASTIFY_API_URL = import.meta.env.VITE_FASTIFY_API_URL;

// Type of the data returned by the backend's GET /plugins
interface PluginRegistryMap {
  [key: string]: {
    // key is the plugin ID/path, e.g., 'timeLog'
    name: string;
    remoteUrl: string; // The URL where the actual JS bundle is hosted (though we will simplify this for now)
  };
}

export const usePluginRegistry = () => {
  const { user } = useAuth();

  return useQuery<PluginRegistryMap, Error>({
    queryKey: ["pluginRegistry"],
    queryFn: async () => {
      const response = await axios.get(`${FASTIFY_API_URL}/registry/plugins`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      return response.data;
    },
    enabled: !!user?.token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
