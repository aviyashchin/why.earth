import { useAuthValues } from "@/context/contextAuth";
import {
  TAG_ACCESS_TOKEN,
  TAG_EMAIL,
  TAG_REFRESH_TOKEN,
} from "@/libs/constants";
import { getErrorMessageForCode, validateEmail } from "@/libs/utils";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAuth } from "firebase/auth";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const provider = new GoogleAuthProvider();
const auth = getAuth();

export default function Signin() {
  const router = useRouter();
  const { isLoading, isSignedIn, createUser, signIn, resetPassword } =
    useAuthValues();

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

  const onGoogleSignin = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          result.user.getIdToken().then((accessToken) => {
            const refreshToken = result.user.refreshToken;
            const email = result.user.email;
            const uid = result.user.uid;

            if (accessToken && email && uid) {
              window.localStorage.setItem(TAG_ACCESS_TOKEN, accessToken);
              window.localStorage.setItem(TAG_REFRESH_TOKEN, refreshToken);

              createUser(accessToken, refreshToken, email);
            }
          });
        }
      })
      .catch((err) => {
        toast.error(getErrorMessageForCode(err.code));
      });
  };

  useEffect(() => {
    if (isSignedIn) {
      router.push("/work");
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (window) {
      const email = window.localStorage.getItem(TAG_EMAIL);
      if (email && validateEmail(email)) {
        setEmail(email);
      }
    }
  }, []);

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
            <div className="w-full md:w-80 flex flex-row justify-between items-center">
              <button
                className="flex-grow h-16 bg-green-600 hover:bg-green-800 rounded-lg transition-all duration-300 cursor-pointer"
                onClick={onSignin}
              >
                <span className="w-full text-white text-base md:text-lg font-bold whitespace-nowrap">
                  SIGN IN
                </span>
              </button>
              <button
                className="ml-2 w-1/5 h-16 text-white bg-green-600  hover:bg-green-800 rounded-lg flex flex-row justify-center items-center transition-all duration-300 cursor-pointer"
                onClick={onGoogleSignin}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-google"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                </svg>
              </button>
            </div>
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
              Don&apos;t have account?&nbsp;&nbsp;
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
