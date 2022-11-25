import AddSlot from "@/components/AddSlot";
import AttributeSlot from "@/components/AttributeSlot";
import OptionSlot from "@/components/OptionSlot";
import { useAuthValues } from "@/context/contextAuth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export enum PAGE_INDEX {
  ENTER_PROBLEM,
  SELECT_ATTRIBUTE,
  SELECT_OPTION,
}

export type Option = {
  id: number;
  image: string;
  label: string;
  value: any;
  description: string;
};

export type Attribute = {
  id: number;
  label: string;
  image: string;
  value: any;
  description: string;
  options: Array<Option>;
};

export default function Work() {
  const router = useRouter();
  const { isLoading, isSignedIn } = useAuthValues();
  const [problem, setProblem] = useState<string>("");
  const [step, setStep] = useState<PAGE_INDEX>(PAGE_INDEX.ENTER_PROBLEM);
  const [attributes, setAttributes] = useState<Array<Attribute>>([]);
  const [attribute, setAttribute] = useState<Attribute | null>();
  const [option, setOption] = useState<Option | null>();
  const [selectedOptionIds, setSelectedOptionIds] = useState<Array<number>>([]);

  const goEnterProblem = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    setStep(PAGE_INDEX.ENTER_PROBLEM);
  };

  const goSelectAttribute = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    setStep(PAGE_INDEX.SELECT_ATTRIBUTE);
  };

  const goSelectOption = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    if (!attribute) {
      toast.error("Please select one Attribute.");
      return;
    }

    setStep(PAGE_INDEX.SELECT_OPTION);
  };

  const goFinalPage = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    router.push("/final");
  };

  //############################################################################################
  //################################### Attribute ##############################################
  //############################################################################################
  const onSelectAttribute = (id: number) => {
    setAttribute(attributes[id]);
    setSelectedOptionIds([]);
  };

  const onAddAttribute = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    setAttribute(null);

    const attributesArr = [
      {
        id: 0,
        label: "New Attribute",
        image: "/dummy1.png",
        value: null,
        description: "",
        options: [],
      },
      ...attributes.map((attr, index) => {
        return { ...attr, id: index + 1 };
      }),
    ];
    setAttributes(attributesArr);
  };

  const onSaveAttribute = (label: string, description: string) => {
    if (attribute) {
      const attributesArr = attributes.slice();
      attributesArr[attribute.id].label = label;
      attributesArr[attribute.id].description = description;
      setAttributes(attributesArr);
    }
  };

  //############################################################################################
  //#################################### Option ################################################
  //############################################################################################
  const onSelectOption = (id: number) => {
    let optionIds = selectedOptionIds.slice();
    if (optionIds.includes(id)) {
      const index = optionIds.indexOf(id);
      optionIds = optionIds.splice(index, 1);
    } else {
      if (selectedOptionIds.length == 3) {
        toast.error("You can not select more than 3 options.");
        return;
      }
      optionIds.push(id);
    }
    setSelectedOptionIds(optionIds);
    setOption(attribute?.options[id]);
  };

  const onAddOption = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    if (!attribute) return;

    setOption(null);

    const newOption = {
      id: 0,
      label: "New Option",
      image: "/dummy2.png",
      value: null,
      description: "",
    };
    const newAttribute = {
      ...attribute,
      options: [
        newOption,
        ...attribute.options.map((option, index) => {
          return { ...option, id: index + 1 };
        }),
      ],
    };
    setAttribute(newAttribute);
    const attributesArr = attributes.slice();
    attributesArr[attribute.id] = newAttribute;
    setAttributes(attributesArr);
  };

  const onSaveOption = (label: string, description: string) => {
    if (!attribute) return;

    if (option) {
      const updateAttribute = Object.assign({}, attribute);
      updateAttribute.options[option.id].label = label;
      updateAttribute.options[option.id].description = description;
      setAttribute(updateAttribute);
      const attributesArr = attributes.slice();
      attributesArr[attribute.id] = updateAttribute;
      setAttributes(attributesArr);
    }
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

      <main className="relative left-0 top-0 w-screen h-screen flex flex-col justify-center items-center md:items-start p-5 md:p-10 overflow-y-auto">
        <div className="w-full h-full flex flex-col justify-start md:justify-center items-center space-y-3 z-10">
          {step == PAGE_INDEX.ENTER_PROBLEM && (
            <>
              <h1 className="w-full md:w-96 text-white text-xl md:text-2xl text-center font-semibold mb-10">
                What is your biggest problem in life today?
              </h1>
              <p className="w-full md:w-96 text-white text-base text-left">
                Problem
              </p>
              <textarea
                className="w-full md:w-96 flex-grow md:flex-grow-0 h-auto md:h-[300px] md:min-h-[300px] md:max-h-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-base md:text-lg rounded-lg outline-none focus:outline-none p-2"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              ></textarea>
              <div className="w-full md:w-96 flex flex-row justify-between items-center space-x-2">
                <button
                  className="flex-grow h-12 bg-green-600 hover:bg-green-800 rounded-lg transition-all duration-300 cursor-pointer"
                  onClick={goSelectAttribute}
                >
                  <span className="w-full text-white text-base md:text-lg font-bold whitespace-nowrap">
                    Next
                  </span>
                </button>
              </div>
            </>
          )}
          {step == PAGE_INDEX.SELECT_ATTRIBUTE && (
            <>
              <h1 className="w-full md:w-96 text-white text-xl md:text-2xl text-center">
                Select some Attributes Important to
              </h1>
              <h1 className="w-full md:w-96 text-white text-xl md:text-2xl font-bold text-center mb-10 overflow-hidden text-ellipsis">
                {problem}
              </h1>
              <div className="w-full md:w-96 flex-grow md:flex-grow-0 overflow-y-auto">
                <div className="w-full h-auto md:h-[300px] md:min-h-[300px] md:max-h-[300px] grid grid-cols-2 gap-2">
                  <AddSlot onClick={onAddAttribute} />
                  {attributes.map((attr, index) => {
                    return (
                      <AttributeSlot
                        key={index}
                        attribute={attr}
                        selectedId={attribute?.id}
                        onClick={onSelectAttribute}
                        onSave={onSaveAttribute}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="w-full md:w-96 flex flex-row justify-between items-center space-x-2">
                <button
                  className="flex-grow h-12 bg-green-600 hover:bg-green-800 rounded-lg transition-all duration-300 cursor-pointer"
                  onClick={goEnterProblem}
                >
                  <span className="w-full text-white text-base md:text-lg font-bold whitespace-nowrap">
                    Back
                  </span>
                </button>
                <button
                  className="flex-grow h-12 bg-green-600 hover:bg-green-800 rounded-lg transition-all duration-300 cursor-pointer"
                  onClick={goSelectOption}
                >
                  <span className="w-full text-white text-base md:text-lg font-bold whitespace-nowrap">
                    Next
                  </span>
                </button>
              </div>
            </>
          )}
          {step == PAGE_INDEX.SELECT_OPTION && (
            <>
              <h1 className="w-full md:w-96 text-white text-xl md:text-2xl text-center font-semibold mb-10">
                For Attribute <b>{attribute?.label}</b> Select three options to
                test
              </h1>
              <div className="w-full md:w-96 flex-grow md:flex-grow-0 overflow-hidden overflow-y-auto">
                <div className="w-full h-auto md:h-[300px] md:min-h-[300px] md:max-h-[300px] grid grid-cols-2 gap-2">
                  <AddSlot onClick={onAddOption} />
                  {attribute?.options.map((option, index) => {
                    return (
                      <OptionSlot
                        key={index}
                        option={option}
                        selectedIds={selectedOptionIds}
                        onClick={onSelectOption}
                        onSave={onSaveOption}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="w-full md:w-96 flex flex-row justify-between items-center space-x-2">
                <button
                  className="flex-grow h-12 bg-green-600 hover:bg-green-800 rounded-lg transition-all duration-300 cursor-pointer"
                  onClick={goSelectAttribute}
                >
                  <span className="w-full text-white text-base md:text-lg font-bold whitespace-nowrap">
                    Back
                  </span>
                </button>
                <button
                  className="flex-grow h-12 bg-green-600 hover:bg-green-800 rounded-lg transition-all duration-300 cursor-pointer"
                  onClick={goFinalPage}
                >
                  <span className="w-full text-white text-base md:text-lg font-bold whitespace-nowrap">
                    Next
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      {isLoading && <div className="loading"></div>}
    </div>
  );
}
