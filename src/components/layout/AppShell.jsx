
/**
 * AppShell — No left sidebar
 * Full-width application layout
 */

import Topbar from "./Topbar";

export default function AppShell({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "var(--paper-50)",
      }}
    >
      <Topbar sidebarWidth={0} />

      <main
        id="main-content"
        style={{
          width: "100%",
          marginLeft: 0,
          paddingTop: "56px",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
