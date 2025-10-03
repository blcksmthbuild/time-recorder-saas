import React, { Suspense } from "react";
import type { UserData } from "../../auth/AuthContext";

type RemoteComponent = React.LazyExoticComponent<
  React.ComponentType<{ user: UserData }>
>;

const REMOTE_COMPONENTS: Record<string, RemoteComponent> = {
  timelog: React.lazy(() => import("timelog_plugin_app/TimeLogApp")),
  aiagent: React.lazy(() => import("ai_agent_plugin_app/AIAgentApp")),
};

interface RemotePluginWrapperProps {
  pluginKey: string; // Pl: 'timeLog'
  user: UserData | null;
}

const RemotePluginWrapper: React.FC<RemotePluginWrapperProps> = ({
  pluginKey,
  user,
}) => {
  console.log("--------------------------------");
  console.log("PLUGIN KEY", pluginKey);
  console.log("--------------------------------");
  const normalizedKey = pluginKey.toLowerCase();
  const RemoteComponent = REMOTE_COMPONENTS[normalizedKey];

  console.log("--------------------------------");
  console.log("normalizedKey", normalizedKey);
  console.log("--------------------------------");

  if (!RemoteComponent) {
    return (
      <div>Error: The '{pluginKey}' plugin is not found on the local map!</div>
    );
  }

  return (
    <Suspense fallback={<div>Remote Plugin loading...</div>}>
      <RemoteComponent user={user as UserData} />
    </Suspense>
  );
};

export default RemotePluginWrapper;
