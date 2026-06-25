import { createRouter as createTanStackRouter } from "@tanstack/react-router";

import { createQueryClient } from "#/create-query-client.tsx";
import type { AppRouterContext } from "#/router.types.ts";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = createQueryClient();
  const context: AppRouterContext = {
    queryClient,
  };

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: false,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
