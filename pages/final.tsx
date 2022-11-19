import Globe from "@/components/Globe";
import { useAuthValues } from "@/context/contextAuth";
import { TAG_EMAIL } from "@/libs/constants";
import { validateEmail } from "@/libs/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Final() {
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
        <div className="w-full h-full flex flex-col justify-center items-center space-y-5 z-10">
          <h1 className="text-center text-white text-2xl">Works Fine!</h1>
          <button
            className="w-80 h-16 bg-green-600 hover:bg-green-800 rounded-lg transition-all duration-300 cursor-pointer"
            onClick={signOut}
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
