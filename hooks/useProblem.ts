import { Attribute, TAG_ATTRIBUTES, TAG_PROBLEM } from "@/libs/constants";
import { useEffect, useState } from "react";

const useProblem = () => {
  const [problem, setProblem] = useState<string>("");
  const [attributes, setAttributes] = useState<Array<Attribute>>([]);

  useEffect(() => {
    if (window) {
      const problem = localStorage.getItem(TAG_PROBLEM);
      setProblem(problem ?? "");

      const attributes = JSON.parse(localStorage.getItem(TAG_ATTRIBUTES)!);
      setAttributes(attributes ?? []);
    }
  }, []);

  const updateProblem = (problem: string) => {
    setProblem(problem);

    localStorage.setItem(TAG_PROBLEM, problem);
  };

  const updateAttributes = (attributes: Array<Attribute>) => {
    setAttributes(attributes);

    localStorage.setItem(TAG_ATTRIBUTES, JSON.stringify(attributes));
  };

  return { problem, updateProblem, attributes, updateAttributes };
};

export default useProblem;
