import "./index.css";
import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

declare global {
  interface Window {
    __AKUKATIGA_BOOT__?: {
      mounted: boolean;
      errors: string[];
      markMounted: () => void;
      reportError: (msg: string) => void;
    };
  }
}

class AppErrorBoundary extends Component<{ children: React.ReactNode }, { error: string | null }> {
  state = { error: null as string | null };

  static getDerivedStateFromError(err: Error) {
    return { error: err?.message || "Terjadi kesalahan saat memuat AkuKatiga Studio." };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="app-fatal">
        <div className="app-fatal-card">
          <strong>AkuKatiga Studio gagal dimuat</strong>
          <p>{this.state.error}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Muat ulang
          </button>
        </div>
      </div>
    );
  }
}

const rootEl = document.getElementById("root");
if (rootEl) {
  try {
    createRoot(rootEl).render(
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>,
    );
    window.__AKUKATIGA_BOOT__?.markMounted();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    window.__AKUKATIGA_BOOT__?.reportError(msg);
  }
}
