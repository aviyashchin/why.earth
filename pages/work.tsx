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
  label: string;
  value: any;
};

export type Attribute = {
  id: number;
  label: string;
  value: any;
  selected: boolean;
  options: Array<Option>;
};

export default function Work() {
  const router = useRouter();
  const { isLoading, isSignedIn, signOut } = useAuthValues();
  const [problem, setProblem] = useState<string>("");
  const [step, setStep] = useState<PAGE_INDEX>(PAGE_INDEX.ENTER_PROBLEM);
  const [attributes, setAttributes] = useState<Array<Attribute>>([
    {
      id: 0,
      label: "Color",
      value: null,
      selected: false,
      options: [
        {
          id: 0,
          label: "Red",
          value: null,
        },
        {
          id: 1,
          label: "Blue",
          value: null,
        },
        {
          id: 2,
          label: "Green",
          value: null,
        },
        {
          id: 3,
          label: "Black",
          value: null,
        },
        {
          id: 4,
          label: "Pink",
          value: null,
        },
        {
          id: 5,
          label: "Cyan",
          value: null,
        },
        {
          id: 6,
          label: "Orange",
          value: null,
        },
      ],
    },
    {
      id: 1,
      label: "Width",
      value: null,
      selected: false,
      options: [
        {
          id: 0,
          label: "1m",
          value: null,
        },
        {
          id: 1,
          label: "1.2m",
          value: null,
        },
        {
          id: 2,
          label: "1.3m",
          value: null,
        },
        {
          id: 3,
          label: "1.4m",
          value: null,
        },
        {
          id: 4,
          label: "1.5m",
          value: null,
        },
        {
          id: 5,
          label: "1.6m",
          value: null,
        },
        {
          id: 6,
          label: "1.7m",
          value: null,
        },
      ],
    },
    {
      id: 2,
      label: "Height",
      value: null,
      selected: false,
      options: [
        {
          id: 0,
          label: "1m",
          value: null,
        },
        {
          id: 1,
          label: "1.2m",
          value: null,
        },
        {
          id: 2,
          label: "1.3m",
          value: null,
        },
        {
          id: 3,
          label: "1.4m",
          value: null,
        },
        {
          id: 4,
          label: "1.5m",
          value: null,
        },
        {
          id: 5,
          label: "1.6m",
          value: null,
        },
        {
          id: 6,
          label: "1.7m",
          value: null,
        },
      ],
    },
    {
      id: 3,
      label: "Shape",
      value: null,
      selected: false,
      options: [
        {
          id: 0,
          label: "Soft",
          value: null,
        },
        {
          id: 1,
          label: "Hard",
          value: null,
        },
      ],
    },
  ]);
  const [attribute, setAttribute] = useState<Attribute>();
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

  const onSelectAttribute = (id: number) => {
    setAttribute(attributes[id]);
    setSelectedOptionIds([]);
  };

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
  };

  const onAddAttribute = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    const attributesArr = [
      {
        id: 0,
        label: "New One",
        value: null,
        selected: false,
        options: [],
      },
      ...attributes.map((attr, index) => {
        return { ...attr, id: index + 1 };
      }),
    ];
    setAttributes(attributesArr);
  };

  const onAddOption = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    if (!attribute) return;

    const newOption = {
      id: 0,
      label: "New One",
      value: null,
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
        <div className="w-full h-full flex flex-col justify-center items-center z-10">
          {step == PAGE_INDEX.ENTER_PROBLEM && (
            <>
              <h1 className="w-80 text-white text-xl md:text-2xl text-center font-semibold mb-10">
                What is your biggest problem in life today?
              </h1>
              <div className="w-80 flex flex-col justify-start items-start space-y-2">
                <p className="text-white text-base">Problem</p>
                <textarea
                  className="w-full h-32 min-h-[128px] max-h-[128px] bg-gray-50 border border-gray-300 text-gray-900 text-base md:text-lg rounded-lg outline-none focus:outline-none p-2"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                ></textarea>
                <div className="w-full flex flex-row justify-between items-center space-x-2">
                  <button
                    className="flex-grow h-12 bg-green-600 hover:bg-green-800 rounded-lg transition-all duration-300 cursor-pointer"
                    onClick={goSelectAttribute}
                  >
                    <span className="w-full text-white text-base md:text-lg font-bold whitespace-nowrap">
                      Next
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
          {step == PAGE_INDEX.SELECT_ATTRIBUTE && (
            <>
              <h1 className="w-80 text-white text-xl md:text-2xl text-center font-semibold mb-10">
                Select some Attributes Important to {problem}
              </h1>
              <div className="w-80 flex flex-col justify-start items-start space-y-2">
                <div className="w-full h-[300px] min-h-[300px] max-h-[300px] grid grid-cols-2 gap-2 overflow-y-auto">
                  <AddSlot onClick={onAddAttribute} />
                  {attributes.map((attr, index) => {
                    return (
                      <AttributeSlot
                        key={index}
                        attribute={attr}
                        selectedId={attribute?.id}
                        onClick={onSelectAttribute}
                      />
                    );
                  })}
                </div>
                <div className="w-full flex flex-row justify-between items-center space-x-2">
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
              </div>
            </>
          )}
          {step == PAGE_INDEX.SELECT_OPTION && (
            <>
              <h1 className="w-80 text-white text-xl md:text-2xl text-center font-semibold mb-10">
                For Attribute {attribute?.label} Select three options to test
              </h1>
              <div className="w-80 flex flex-col justify-start items-start space-y-2">
                <div className="w-full h-[300px] min-h-[300px] max-h-[300px] grid grid-cols-2 gap-2 overflow-y-auto">
                  <AddSlot onClick={onAddOption} />
                  {attribute?.options.map((option, index) => {
                    return (
                      <OptionSlot
                        key={index}
                        option={option}
                        selectedIds={selectedOptionIds}
                        onClick={onSelectOption}
                      />
                    );
                  })}
                </div>
                <div className="w-full flex flex-row justify-between items-center space-x-2">
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
              </div>
            </>
          )}
        </div>
      </main>

      {isLoading && <div className="loading"></div>}
    </div>
  );
}
