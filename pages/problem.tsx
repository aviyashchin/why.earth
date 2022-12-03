import { useAuthValues } from "@/context/contextAuth";
import { useProblemValue } from "@/context/contextProblem";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Problem() {
  const router = useRouter();
  const { isLoading, isSignedIn } = useAuthValues();
  const { problem, updateProblem } = useProblemValue();

  const goSelectAttribute = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    router.push("/attribute");
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

      <main className="relative left-0 top-0 w-screen h-screen flex flex-col justify-start items-center md:items-start p-5 md:p-10">
        <div className="w-full h-5/6 flex flex-col justify-start md:justify-center items-center space-y-3 overflow-hidden z-10">
          <h1 className="w-full md:w-[768px] text-black text-xl md:text-2xl text-center mb-10">
            What is your biggest problem in life today?
          </h1>
          <p className="w-full md:w-[768px] text-black text-base text-left">
            Problem
          </p>
          <textarea
            className="w-full md:w-[768px] flex-grow md:flex-grow-0 h-auto md:h-[300px] md:min-h-[300px] md:max-h-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-base md:text-lg rounded-lg outline-none focus:outline-none p-2"
            value={problem}
            minLength={1}
            maxLength={140}
            onChange={(e) => updateProblem(e.target.value)}
          ></textarea>
          <div className="w-full md:w-[768px] flex flex-row justify-between items-center space-x-2">
            <button
              className="flex-grow h-12 bg-[#5AC0E5] hover:bg-[#47a5c7] rounded-lg transition-all outline-none focus:outline-none duration-300 cursor-pointer"
              onClick={goSelectAttribute}
            >
              <span className="w-full text-white text-base md:text-lg font-bold whitespace-nowrap">
                Next
              </span>
            </button>
          </div>
        </div>
      </main>
      {isLoading && <div className="loading"></div>}
    </div>
  );
}
