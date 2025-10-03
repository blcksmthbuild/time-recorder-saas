import React, { Suspense, useMemo } from "react";

const PLUGIN_MODULES: Record<string, string> = {
  timeLog: "timelog_plugin_app/TimeLogApp",
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
  const modulePath = PLUGIN_MODULES[pluginKey];

  const RemoteComponent = useMemo(() => {
    return React.lazy(() => import(/* @vite-ignore */ modulePath));
  }, [modulePath]);

  console.log("--------------------------------");
  console.log("MODULE PATH", modulePath);
  console.log("--------------------------------");

  if (!modulePath) {
    return (
      <div>Hiba: A '{pluginKey}' plug-in nem található a helyi térképen!</div>
    );
  }

  return (
    <Suspense fallback={<div>Remote Plugin betöltése...</div>}>
      <RemoteComponent />
    </Suspense>
  );
};

export default RemotePluginWrapper;
