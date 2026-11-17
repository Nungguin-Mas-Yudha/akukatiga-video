import { Config } from "@remotion/cli/config";
import { enableSkia } from "@remotion/skia/enable";

// Skia's web build imports react-native; the browser bundle gets react-native-web instead (same as engine/full-visual/render.mjs)
Config.overrideWebpackConfig((c) => {
  const sk = enableSkia(c);
  return { ...sk, resolve: { ...sk.resolve, alias: { ...sk.resolve.alias, "react-native$": "react-native-web" } } };
});
