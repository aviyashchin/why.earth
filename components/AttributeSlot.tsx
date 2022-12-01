import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDoubleTap } from "use-double-tap";
import useDetectDevice from "@/hooks/useDetectDevice";
import { Attribute } from "@/libs/constants";
import useOpenAI from "@/hooks/useOpenAI";

type Props = {
  attribute: Attribute;
  selectedIds: Array<number>;
  onClick: any;
  onSave: any;
};

const AttributeSlot = ({ attribute, selectedIds, onClick, onSave }: Props) => {
  const ref = useRef(null);
  const refInput = useRef(null);
  const { isMobile } = useDetectDevice();
  const { generateImage } = useOpenAI();
  const [image, setImage] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
  const [label, setLabel] = useState<string>(attribute.label);

  const bind = useDoubleTap((event) => {
    setIsEditing(true);
  });

  const onFinish = () => {
    if (!label) {
      toast.error("Please enter valid label.");
      return;
    }
    if (label.length > 140) {
      toast.error("Label max length is 140.");
      return;
    }

    onSave(label, "");
    setIsEditing(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      // @ts-ignore
      if (ref.current && !ref.current.contains(event.target)) {
        setIsEditing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  useEffect(() => {
    if (isEditing) {
      // @ts-ignore
      refInput.current.focus();
    }
  }, [refInput, isEditing]);

  useEffect(() => {
    setImage("");
    try {
      attribute.image.then((image) => {
        setImage(image);
      });
    } catch (e) {
      generateImage(attribute.label).then((image) => {
        setImage(image);
      });
    }
  }, [attribute.image]);

  return (
    <div ref={ref} className="w-full flex justify-center items-center">
      <div
        className={`w-36 h-36 border flex flex-col justify-start items-start overflow-hidden rounded-md select-none relative ${
          selectedIds.includes(attribute.id)
            ? "border-green-500"
            : "border-gray-500"
        } cursor-pointer`}
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
        onMouseDown={() => onClick(attribute.id)}
        {...bind}
      >
        {image ? (
          <img
            className="w-full h-32 object-cover overflow-hidden"
            src={image}
          />
        ) : (
          <div className="w-full h-32 flex justify-center items-center">
            <div className="animate-spin rounded-full w-10 h-10 border-t-2 border-gray-500"></div>
          </div>
        )}
        {!isEditing && !isMobile && isMouseOver && (
          <div
            className="absolute -right-10 -top-10 w-20 h-20 bg-[#00000088] backdrop-blur-sm rounded-full overflow-hidden text-white cursor-pointer hover:bg-green-500 transition-all duration-300"
            onClick={() => setIsEditing(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              className="bi bi-pencil-fill absolute bottom-4 left-4"
              viewBox="0 0 16 16"
            >
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
            </svg>
          </div>
        )}

        {isEditing ? (
          <textarea
            ref={refInput}
            className="p-2 h-8 min-h-[32px] max-h-[64px] text-left text-sm bg-slate-400 text-black w-full overflow-hidden text-ellipsis outline-none focus:outline-none"
            value={label}
            minLength={1}
            maxLength={140}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                e.preventDefault();
                onFinish();
              }
            }}
          />
        ) : (
          <p className="p-2 h-8 max-h-[32px] text-left text-sm text-black w-full max-w-[130px] flex justify-start items-center whitespace-nowrap overflow-hidden text-ellipsis select-none">
            {attribute.label}
          </p>
        )}
      </div>
    </div>
  );
};

export default AttributeSlot;
