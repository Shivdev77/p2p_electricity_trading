import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { ReactElement, ReactNode, useEffect } from "react";
import { NextPage } from "next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useStore from "@/store/store";
import { useRouter } from "next/router";
import { Notifications } from "@mantine/notifications";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();
const nonProtectedRoutes = ["/", "/create-account"];

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const user = useStore((state) => state.user);
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    if (user && nonProtectedRoutes.includes(router.pathname)) {
      router.push("/dashboard");
    } else if (!user && !nonProtectedRoutes.includes(router.pathname)) {
      router.push("/");
    }
  }, [user, router, router.pathname]);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "light",
      }}
    >
      <Notifications />
      <QueryClientProvider client={queryClient}>
        {getLayout(<Component {...pageProps} />)}
      </QueryClientProvider>
    </MantineProvider>
  );
}
