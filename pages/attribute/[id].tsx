import { useEffect, useState } from "react";
import Head from "next/head";
import { useAuthValues } from "@/context/contextAuth";
import { useRouter } from "next/router";
import useOpenAI from "@/hooks/useOpenAI";
import { Attribute, Option } from "@/libs/constants";
import { useProblemValue } from "@/context/contextProblem";
import AddSlot from "@/components/AddSlot";
import OptionSlot from "@/components/OptionSlot";
import { toast } from "react-toastify";

export default function AttributePage() {
  const router = useRouter();
  const { id } = router.query;
  const [currentAttributeIndex, setCurrentAttributeIndex] = useState<number>(0);
  const { isLoading, isSignedIn } = useAuthValues();
  const { attributes, updateAttributes } = useProblemValue();
  const { generateImage } = useOpenAI();
  const [attribute, setAttribute] = useState<Attribute | null>(null);
  const [options, setOptions] = useState<Array<Option>>([]);
  const [option, setOption] = useState<Option | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Array<Option>>([]);

  const goBack = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    const attributesArr = attributes.slice();
    attributesArr[currentAttributeIndex].options = options.slice();
    updateAttributes(attributesArr);

    if (currentAttributeIndex == 0) {
      router.push("/attribute");
      return;
    }

    router.push(`/attribute/${currentAttributeIndex - 1}`);
  };

  const goNext = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    if (!selectedOptions || selectedOptions.length == 0) {
      toast.error("Please select at least one option.");
      return;
    }

    const attributesArr = attributes.slice();
    attributesArr[currentAttributeIndex].options = selectedOptions.slice();
    updateAttributes(attributesArr);

    if (currentAttributeIndex < attributes.length - 1) {
      router.push(`/attribute/${currentAttributeIndex + 1}`);
      return;
    }

    router.push("/final");
  };

  //############################################################################################
  //#################################### Option ################################################
  //############################################################################################
  const onSelectOption = (id: number) => {
    if (!attribute) return;

    let newSelectedOptions = selectedOptions.slice();
    const index = newSelectedOptions.findIndex((option) => {
      return option.id == id;
    });
    if (index == -1) {
      newSelectedOptions.push(options[id]);
    } else {
      newSelectedOptions.splice(index, 1);
    }

    setSelectedOptions(newSelectedOptions);
    setOption(options[id]);
  };

  const onAddOption = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    if (!attribute) return;

    setOption(null);

    const attributeObj = Object.assign({}, attribute);
    const optionsArr = options.slice();
    optionsArr.push({
      id: optionsArr.length,
      label: "New Option",
      image: generateImage("New Option"),
      value: null,
      description: "",
    });
    attributeObj.options = optionsArr.slice();
    setAttribute(attributeObj);
    setOptions(optionsArr);
  };

  const onSaveOption = (label: string, description: string) => {
    if (!attribute || !option) return;

    const attributeObj = Object.assign({}, attribute);
    const optionsArr = options.slice();
    const optionObj = Object.assign({}, option);
    optionObj.label = label;
    optionObj.image = generateImage(label);
    optionObj.description = description;
    setOption(optionObj);

    optionsArr[optionObj.id] = optionObj;
    attributeObj.options = optionsArr.slice();
    setAttribute(attributeObj);
    setOptions(optionsArr);

    const newSelectedOptions = selectedOptions.map((selectedOption) => {
      return optionsArr[selectedOption.id];
    });
    setSelectedOptions(newSelectedOptions);
  };

  useEffect(() => {
    if (isSignedIn) {
      if (id) {
        try {
          const index = parseInt(id.toString());
          setAttribute({
            ...attributes[index],
            options: attributes[index].options.map((option, index) => {
              return { ...option, id: index };
            }),
          });
          setOptions(
            attributes[index].options.map((option, index) => {
              return { ...option, id: index };
            })
          );
          setCurrentAttributeIndex(index);
          setOption(null);
          setSelectedOptions(
            attributes[index].options.map((option, index) => {
              return { ...option, id: index };
            })
          );
        } catch (e) {
          router.push("/");
        }
      }
    }
  }, [isSignedIn, id]);

  return (
    <div className="relative">
      <Head>
        <title>Why Earth</title>
        <meta name="description" content="Why Earth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative left-0 top-0 w-screen h-screen flex flex-col justify-start items-center md:items-start p-5 md:p-10">
        <div className="w-full h-full flex flex-col justify-start md:justify-center items-center space-y-3 overflow-hidden z-10">
          <h1 className="w-full md:w-[768px] text-gray-500 text-xl md:text-2xl text-center">
            For Attribute&nbsp;&nbsp;
            <b className="text-black">{attribute?.label}</b>&nbsp;&nbsp;Select
            three options to test
          </h1>
          <div className="w-full md:w-[768px] pr-1 flex-grow overflow-y-auto space-y-1 custom-scrollbar">
            <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2">
              <AddSlot onClick={onAddOption} />
              {options.map((opt, index) => {
                return (
                  <OptionSlot
                    key={index}
                    index={index}
                    option={opt}
                    selectedIds={selectedOptions.map((option) => option.id)}
                    onClick={onSelectOption}
                    onSave={onSaveOption}
                  />
                );
              })}
            </div>
          </div>
          <div className="w-full md:w-[768px] flex flex-row justify-between items-center space-x-2">
            <button
              className="flex-grow h-12 bg-[#5AC0E5] hover:bg-[#47a5c7] rounded-lg outline-none focus:outline-none transition-all duration-300 cursor-pointer"
              onClick={goBack}
            >
              <span className="w-full text-white text-base md:text-lg font-bold whitespace-nowrap">
                Back
              </span>
            </button>
            <button
              className="flex-grow h-12 bg-[#5AC0E5] hover:bg-[#47a5c7] rounded-lg outline-none focus:outline-none transition-all duration-300 cursor-pointer"
              onClick={goNext}
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
