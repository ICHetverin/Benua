import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from "./providers/router";

import "./styles/global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider />
    </QueryClientProvider>
  );
}

export default App;
