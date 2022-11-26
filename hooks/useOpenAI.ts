import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const useOpenAI = () => {
  const [isWorking, setIsWorking] = useState<boolean>(false);

  const generateImage = (prompt: string) => {
    return new Promise<string>((resolve, _) => {
      setIsWorking(true);
      openai
        .createImage({
          prompt: prompt,
          n: 1,
          size: "256x256",
        })
        .then((res) => {
          if (res && res.data.data[0].url) {
            resolve(res.data.data[0].url);
          } else {
            resolve("/dummy.png");
          }
          setIsWorking(false);
        })
        .catch((e) => {
          resolve("/dummy.png");
          setIsWorking(false);
        });
    });
  };

  return { isWorking, generateImage };
};

export default useOpenAI;
