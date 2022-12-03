import { useAuthValues } from "@/context/contextAuth";
import useProblem from "@/hooks/useProblem";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Final() {
  const router = useRouter();
  const { isLoading, isSignedIn, signOut } = useAuthValues();
  const { attributes } = useProblem();

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
        <div className="w-full h-full flex flex-col justify-center items-center space-y-5 z-10">
          <h1 className="text-center text-black text-2xl">Works Fine!</h1>
          <p className="text-base text-black my-2 w-full md:w-96 h-40 overflow-y-auto">
            {JSON.stringify(attributes)}
          </p>
          <button
            className="w-80 h-16 bg-[#5AC0E5] hover:bg-[#47a5c7] rounded-lg outline-none focus:outline-none transition-all duration-300 cursor-pointer"
            onClick={onSignOut}
          >
            <span className="w-full text-white text-base md:text-lg font-bold whitespace-nowrap">
              SIGN OUT
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}
