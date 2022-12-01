import AddSlot from "@/components/AddSlot";
import AttributeSlot from "@/components/AttributeSlot";
import { useAuthValues } from "@/context/contextAuth";
import { useProblemValue } from "@/context/contextProblem";
import useOpenAI from "@/hooks/useOpenAI";
import { Attribute } from "@/libs/constants";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export enum PAGE_INDEX {
  ENTER_PROBLEM,
  SELECT_ATTRIBUTE,
}

export default function Problem() {
  const router = useRouter();
  const { isLoading, isSignedIn } = useAuthValues();
  const {
    problem,
    updateProblem,
    attributes: storedAttributes,
    updateAttributes,
  } = useProblemValue();
  const { generateImage } = useOpenAI();

  const [step, setStep] = useState<PAGE_INDEX>(PAGE_INDEX.ENTER_PROBLEM);
  const [attributes, setAttributes] = useState<Array<Attribute>>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Array<Attribute>
  >([]);
  const [attribute, setAttribute] = useState<Attribute | null>();

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

    if (!selectedAttributes || selectedAttributes.length == 0) {
      toast.error("Please select one Attribute.");
      return;
    }

    updateAttributes(selectedAttributes);

    router.push(`/attribute/0`);
  };

  //############################################################################################
  //################################### Attribute ##############################################
  //############################################################################################
  const onSelectAttribute = (id: number) => {
    let newSelectedAttributes = selectedAttributes.slice();
    const index = newSelectedAttributes.findIndex((attribute) => {
      return attribute.id == id;
    });
    if (index == -1) {
      newSelectedAttributes.push(attributes[id]);
    } else {
      newSelectedAttributes = newSelectedAttributes.splice(index, 1);
    }

    setSelectedAttributes(newSelectedAttributes);
    setAttribute(attributes[id]);
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

    const newSelectedAttributes = selectedAttributes.map(
      (selectedAttribute) => {
        return attributesArr[selectedAttribute.id];
      }
    );
    setSelectedAttributes(newSelectedAttributes);
  };

  useEffect(() => {
    if (isSignedIn) {
      setAttribute(null);
      setAttributes(
        storedAttributes.map((attribute, index) => {
          return { ...attribute, id: index };
        })
      );
      setSelectedAttributes(
        storedAttributes.map((attribute, index) => {
          return { ...attribute, id: index };
        })
      );
    } else {
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
                minLength={1}
                maxLength={140}
                onChange={(e) => updateProblem(e.target.value)}
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
                <div className="w-full h-auto md:h-[400px] md:min-h-[400px] md:max-h-[400px] grid grid-cols-2 md:grid-cols-5 gap-2">
                  <AddSlot onClick={onAddAttribute} />
                  {attributes?.map((attr, index) => {
                    return (
                      <AttributeSlot
                        key={index}
                        attribute={attr}
                        selectedIds={selectedAttributes.map(
                          (attribute) => attribute.id
                        )}
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
        </div>
      </main>
      {isLoading && <div className="loading"></div>}
    </div>
  );
}
