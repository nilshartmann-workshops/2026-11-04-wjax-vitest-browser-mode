import "../styles.css";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";

import { MailWidget } from "#/components/MailWidget.tsx";
import type { AppRouterContext } from "#/router.types.ts";

const showDevToolsPanel = false;

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="site-header">
        <MailWidget />
        <Nav />
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <DevToolsPanel />
    </div>
  );
}

function Nav() {
  return (
    <nav className="nav-bar">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="nav-logo-icon">🏠</span>
          <span className="nav-logo-text">hütly</span>
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            activeProps={{ className: "nav-link nav-link-active" }}
            inactiveProps={{ className: "nav-link nav-link-inactive" }}
          >
            Start
          </Link>
          <Link
            to="/posts"
            activeProps={{ className: "nav-link nav-link-active" }}
            inactiveProps={{ className: "nav-link nav-link-inactive" }}
          >
            Gesuche
          </Link>
          <Link to="/posts/new" className="nav-cta">
            + Gesuch erstellen
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-title">🏠 hütly</div>
      <p className="site-footer-tagline">
        Dein Tier. Dein Urlaub. Kein Stress.
      </p>
    </footer>
  );
}

function DevToolsPanel() {
  if (!showDevToolsPanel) {
    return null;
  }

  return <ReactQueryDevtools initialIsOpen={false} />;
}
