import { useAuthValues } from "@/context/contextAuth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Work() {
  const router = useRouter();
  const { isLoading, isSignedIn, signOut } = useAuthValues();

  const onSignOut = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    if (isLoading) return;

    signOut();
  };

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/signin");
    }
  }, [isSignedIn]);

  return (
    <div className="relative">
      <Head>
        <title>Why Earth</title>
        <meta name="description" content="Why Earth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative left-0 top-0 w-screen h-screen flex flex-col justify-center items-center md:items-start p-5 md:p-10">
        <div className="w-full h-full flex flex-col justify-center items-center z-10">
          <h1 className="text-white text-3xl md:text-6xl text-center font-semibold mb-10">
            Work
          </h1>
          <button
            className="w-full md:w-80 h-16 bg-green-600 hover:bg-green-800 rounded-lg px-8 py-5 transition-all duration-300 cursor-pointer"
            onClick={onSignOut}
          >
            <span className="w-full text-white text-base md:text-lg font-bold whitespace-nowrap">
              SIGN OUT
            </span>
          </button>
        </div>
      </main>

      {isLoading && <div className="loading"></div>}
    </div>
  );
}
