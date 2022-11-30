import AddSlot from "@/components/AddSlot";
import AttributeSlot from "@/components/AttributeSlot";
import OptionSlot from "@/components/OptionSlot";
import { useAuthValues } from "@/context/contextAuth";
import useOpenAI from "@/hooks/useOpenAI";
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
  image: Promise<string>;
  label: string;
  value: any;
  description: string;
};

export type Attribute = {
  id: number;
  label: string;
  image: Promise<string>;
  value: any;
  description: string;
  options: Array<Option>;
};

export default function Work() {
  const router = useRouter();
  const { isLoading, isSignedIn } = useAuthValues();
  const { generateImage } = useOpenAI();
  const [problem, setProblem] = useState<string>("");
  const [step, setStep] = useState<PAGE_INDEX>(PAGE_INDEX.ENTER_PROBLEM);
  const [attributes, setAttributes] = useState<Array<Attribute>>([]);
  const [attribute, setAttribute] = useState<Attribute | null>();
  const [option, setOption] = useState<Option | null>();
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<
    Array<number>
  >([]);
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
    let attributeIds = selectedAttributeIds.slice();
    if (attributeIds.includes(id)) {
      const index = attributeIds.indexOf(id);
      attributeIds = attributeIds.splice(index, 1);
    } else {
      if (attributeIds.length == 3) {
        attributeIds = [];
      }
      attributeIds.push(id);
    }
    setSelectedAttributeIds(attributeIds);

    setAttribute(attributes[id]);
    setSelectedOptionIds([]);
  };

  const onAddAttribute = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    setAttribute(null);

    const attributesArr = attributes.slice();
    attributesArr.push({
      id: attributesArr.length,
      label: "New Attribute",
      image: generateImage("New Attribute"),
      value: null,
      description: "",
      options: [],
    });
    setAttributes(attributesArr);
  };

  const onSaveAttribute = (label: string, description: string) => {
    if (!attribute) return;

    const attributesArr = attributes.slice();
    const attributeObj = Object.assign({}, attribute);

    attributeObj.label = label;
    attributeObj.image = generateImage(label);
    attributeObj.description = description;
    setAttribute(attributeObj);

    attributesArr[attributeObj.id] = attributeObj;
    setAttributes(attributesArr);
  };

  //############################################################################################
  //#################################### Option ################################################
  //############################################################################################
  const onSelectOption = (id: number) => {
    if (!attribute) return;

    let optionIds = selectedOptionIds.slice();
    if (optionIds.includes(id)) {
      const index = optionIds.indexOf(id);
      optionIds = optionIds.splice(index, 1);
    } else {
      if (optionIds.length == 3) {
        optionIds = [];
      }
      optionIds.push(id);
    }
    setSelectedOptionIds(optionIds);
    setOption(attribute.options[id]);
  };

  const onAddOption = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    if (!attribute) return;

    setOption(null);

    const attributeObj = Object.assign({}, attribute);
    const optionsArr = attributeObj.options.slice();
    optionsArr.push({
      id: optionsArr.length,
      label: "New Option",
      image: generateImage("New Option"),
      value: null,
      description: "",
    });
    attributeObj.options = optionsArr;
    setAttribute(attributeObj);

    const attributesArr = attributes.slice();
    attributesArr[attributeObj.id] = attributeObj;
    setAttributes(attributesArr);
  };

  const onSaveOption = (label: string, description: string) => {
    if (!attribute || !option) return;

    const attributeObj = Object.assign({}, attribute);
    const optionObj = Object.assign({}, option);
    optionObj.label = label;
    optionObj.image = generateImage(label);
    optionObj.description = description;
    setOption(optionObj);

    attributeObj.options[optionObj.id] = optionObj;
    setAttribute(attributeObj);

    const attributesArr = attributes.slice();
    attributesArr[attributeObj.id] = attributeObj;
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

      <main className="relative left-0 top-0 w-screen h-screen flex flex-col justify-start items-center md:items-start p-5 md:p-10">
        <div className="w-full h-5/6 flex flex-col justify-start md:justify-center items-center space-y-3 overflow-hidden z-10">
          {step == PAGE_INDEX.ENTER_PROBLEM && (
            <>
              <h1 className="w-full md:w-[768px] text-white text-xl md:text-2xl text-center mb-10">
                What is your biggest problem in life today?
              </h1>
              <p className="w-full md:w-[768px] text-white text-base text-left">
                Problem
              </p>
              <textarea
                className="w-full md:w-[768px] flex-grow md:flex-grow-0 h-auto md:h-[300px] md:min-h-[300px] md:max-h-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-base md:text-lg rounded-lg outline-none focus:outline-none p-2"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              ></textarea>
              <div className="w-full md:w-[768px] flex flex-row justify-between items-center space-x-2">
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
              <h1 className="w-full md:w-[768px] text-white text-xl md:text-2xl text-center">
                Select some Attributes Important to
              </h1>
              <h1 className="w-full md:w-[768px] text-white text-xl md:text-2xl font-bold text-center mb-10 overflow-hidden text-ellipsis">
                {problem}
              </h1>
              <div className="w-full md:w-[768px] flex-grow md:flex-grow-0 overflow-y-auto">
                <div className="w-full h-auto md:h-[500px] md:min-h-[500px] md:max-h-[500px] grid grid-cols-2 md:grid-cols-5 gap-2">
                  <AddSlot onClick={onAddAttribute} />
                  {attributes.map((attr, index) => {
                    return (
                      <AttributeSlot
                        key={index}
                        attribute={attr}
                        selectedIds={selectedAttributeIds}
                        onClick={onSelectAttribute}
                        onSave={onSaveAttribute}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="w-full md:w-[768px] flex flex-row justify-between items-center space-x-2">
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
              <h1 className="w-full md:w-[768px] text-white text-xl md:text-2xl text-center">
                For Attribute <b>{attribute?.label}</b> Select three options to
                test
              </h1>
              <div className="w-full md:w-[768px] flex-grow md:flex-grow-0 overflow-hidden overflow-y-auto">
                <div className="w-full h-auto md:h-[500px] md:min-h-[500px] md:max-h-[500px] grid grid-cols-2 md:grid-cols-5 gap-2">
                  <AddSlot onClick={onAddOption} />
                  {attribute?.options.map((opt, index) => {
                    return (
                      <OptionSlot
                        key={index}
                        option={opt}
                        selectedIds={selectedOptionIds}
                        onClick={onSelectOption}
                        onSave={onSaveOption}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="w-full md:w-[768px] flex flex-row justify-between items-center space-x-2">
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
