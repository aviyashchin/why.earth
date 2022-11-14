import "react-toastify/dist/ReactToastify.min.css";
import "../styles/globals.css";

import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/contextAuth";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ToastContainer
        theme="colored"
        position="top-right"
        bodyClassName="toastBody"
      />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
