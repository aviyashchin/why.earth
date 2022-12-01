import useProblem from "@/hooks/useProblem";
import { Attribute } from "@/libs/constants";
import PropTypes from "prop-types";
import { createContext, useContext } from "react";

export const ProblemContext = createContext({
  problem: "",
  updateProblem: (problem: string) => {},
  attributes: Array<Attribute>(),
  updateAttributes: (attributes: Array<Attribute>) => {},
});

export const ProblemProvider = ({ children }: { children: any }) => {
  const { problem, updateProblem, attributes, updateAttributes } = useProblem();

  return (
    <ProblemContext.Provider
      value={{
        problem,
        updateProblem,
        attributes,
        updateAttributes,
      }}
    >
      {children}
    </ProblemContext.Provider>
  );
};

export const useProblemValue = () => useContext(ProblemContext);

ProblemProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
