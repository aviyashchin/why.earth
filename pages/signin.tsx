import { useAuthValues } from "@/context/contextAuth";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Signin() {
  const router = useRouter();
  const { isLoading, isSignedIn, signIn, resetPassword } = useAuthValues();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSignin = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    if (isLoading) return;

    if (!email || !password) {
      toast.error("Please enter values correctly!");
      return;
    }
    signIn(email, password);
  };

  const onResetPassword = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    if (isLoading) return;

    if (!email) {
      toast.error("Please enter email correctly!");
      return;
    }

    resetPassword(email);
  };

  useEffect(() => {
    if (isSignedIn) {
      router.push("/work");
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
            Sign In
          </h1>
          <div className="w-full flex flex-col justify-start items-center space-y-3">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  onSignin();
                }
              }}
              className="flex w-full md:w-80 flex-grow h-16 bg-gray-50 border border-gray-300 text-gray-900 text-base md:text-lg rounded-lg outline-none focus:outline-none p-5"
              placeholder="Enter your email"
            />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  onSignin();
                }
              }}
              className="flex w-full md:w-80 flex-grow h-16 bg-gray-50 border border-gray-300 text-gray-900 text-base md:text-lg rounded-lg outline-none focus:outline-none p-5"
              placeholder="Enter your password"
            />
            <button
              className="w-full md:w-80 h-16 bg-green-600 hover:bg-green-800 rounded-lg px-8 py-5 transition-all duration-300 cursor-pointer"
              onClick={onSignin}
            >
              <span className="w-full text-white text-base md:text-lg font-bold whitespace-nowrap">
                SIGN IN
              </span>
            </button>
            <p className="text-white text-base flex flex-row">
              Forgot password?&nbsp;&nbsp;
              <p
                className="text-green-600 hover:text-green-800 cursor-pointer"
                onClick={onResetPassword}
              >
                Reset password
              </p>
            </p>
            <p className="text-white text-base flex flex-row">
              Don't have account?&nbsp;&nbsp;
              <Link href="/signup">
                <p className="text-green-600 hover:text-green-800 cursor-pointer">
                  Sign Up
                </p>
              </Link>
            </p>
          </div>
        </div>
      </main>

      {isLoading && <div className="loading"></div>}
    </div>
  );
}
