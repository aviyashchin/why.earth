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
          size: "512x512",
        })
        .then((res) => {
          if (res && res.data.data[0].url) {
            resolve(res.data.data[0].url);
          } else {
            resolve("/dummy1.png");
          }
          setIsWorking(false);
        })
        .catch((e) => {
          console.log(e);
          resolve("/dummy2.png");
          setIsWorking(false);
        });
    });
  };

  return { isWorking, generateImage };
};

export default useOpenAI;
