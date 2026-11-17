/// <reference types="vite/client" />

declare module '@shopify/react-native-skia/lib/module/web/LoadSkiaWeb' {
  export function LoadSkia(opts?: Record<string, unknown>): Promise<void>;
}
