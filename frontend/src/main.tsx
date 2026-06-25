import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";

import { getRouter } from "#/router.tsx";

const router = getRouter();
const queryClient = router.options.context.queryClient;

const rootElement = document.getElementById("root")!;

createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
);
