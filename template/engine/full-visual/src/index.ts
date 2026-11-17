// the compiled module, not src/web: src pulls react-native types into tsc
import { LoadSkia } from "@shopify/react-native-skia/lib/module/web/LoadSkiaWeb";
import { registerRoot } from "remotion";

// Skia's CanvasKit must load before any scene with a <SkiaCanvas> is imported (remotion.dev/docs/skia/)
(async () => {
  await LoadSkia();
  const { Root } = await import("./Root");
  registerRoot(Root);
})();
