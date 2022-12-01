import "react-toastify/dist/ReactToastify.min.css";
import "../styles/globals.css";

import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/contextAuth";
import type { AppProps } from "next/app";
import { ProblemProvider } from "@/context/contextProblem";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ProblemProvider>
        <ToastContainer
          theme="colored"
          position="top-right"
          bodyClassName="toastBody"
        />
        <Component {...pageProps} />
      </ProblemProvider>
    </AuthProvider>
  );
}
