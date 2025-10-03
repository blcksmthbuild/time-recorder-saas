import React, { Suspense } from "react";

type RemoteComponent = React.LazyExoticComponent<React.ComponentType<unknown>>;

const REMOTE_COMPONENTS: Record<string, RemoteComponent> = {
  timelog: React.lazy(() => import("timelog_plugin_app/TimeLogApp")),
};

interface RemotePluginWrapperProps {
  pluginKey: string; // Pl: 'timeLog'
}

const RemotePluginWrapper: React.FC<RemotePluginWrapperProps> = ({
  pluginKey,
}) => {
  console.log("--------------------------------");
  console.log("PLUGIN KEY", pluginKey);
  console.log("--------------------------------");
  const normalizedKey = pluginKey.toLowerCase();
  const RemoteComponent = REMOTE_COMPONENTS[normalizedKey];

  if (!RemoteComponent) {
    return (
      <div>Error: The '{pluginKey}' plugin is not found on the local map!</div>
    );
  }

  return (
    <Suspense fallback={<div>Remote Plugin loading...</div>}>
      <RemoteComponent />
    </Suspense>
  );
};

export default RemotePluginWrapper;
