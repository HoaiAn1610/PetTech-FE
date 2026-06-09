import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import { router } from "./routes";
import { AuthProvider } from "@/context/AuthContext";
import { TenantProvider } from "@/context/TenantContext";
import "@/styles/fonts.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
      onError: (error: any) => {
        const msg = error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi';
        toast.error(msg);
      },
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TenantProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" theme="light" richColors closeButton />
        </TenantProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

