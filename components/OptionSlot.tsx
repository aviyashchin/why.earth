import { LONG_PRESS_DELAY } from "@/libs/constants";
import { Option } from "pages/work";
import { useEffect, useRef, useState } from "react";

type Props = {
  option: Option;
  selectedIds: Array<number>;
  onClick: any;
  onSave: any;
};

const OptionSlot = ({ option, selectedIds, onClick, onSave }: Props) => {
  const ref = useRef(null);
  const refInput = useRef(null);
  let start = 0;
  const [image, setImage] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [label, setLabel] = useState<string>(option.label);

  const onClicked = (e: any, id: number) => {
    if (e.detail == 1) {
      onClick(id);
    } else if (e.detail == 2) {
      onClick(id);
      setIsEditing(true);
    }
  };

  function onMouseDown(id: number) {
    start = Date.now();
  }

  function onMouseUp(id: number) {
    if (Date.now() - start > LONG_PRESS_DELAY) {
      setIsEditing(true);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: any) {
      // @ts-ignore
      if (ref.current && !ref.current.contains(event.target)) {
        setIsEditing(false);
      }
    }
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
    option.image.then((image) => {
      setImage(image);
    });
  }, [option.image]);

  return (
    <div ref={ref} className="w-full flex justify-center items-center">
      <div
        className={`w-36 h-36 border flex flex-col justify-start items-start overflow-hidden rounded-md ${
          selectedIds.includes(option.id) ? "border-white" : "border-gray-500"
        } cursor-pointer`}
        onClick={(e) => onClicked(e, option.id)}
        onTouchStart={() => onMouseDown(option.id)}
        onTouchEnd={() => onMouseUp(option.id)}
      >
        {image ? (
          <img
            className="w-full h-32 object-cover overflow-hidden"
            src={image}
          />
        ) : (
          <div className="w-full h-32 flex justify-center items-center">
            <div className="animate-spin rounded-full w-10 h-10 border-t-2 border-white"></div>
          </div>
        )}

        {isEditing ? (
          <input
            ref={refInput}
            className="p-2 h-8 text-left text-sm bg-slate-400 text-black w-full overflow-hidden text-ellipsis outline-none focus:outline-none"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                onSave(label, "");
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <p className="p-2 h-8 text-left text-sm text-white w-full flex justify-start items-center overflow-hidden text-ellipsis">
            {option.label}
          </p>
        )}
      </div>
    </div>
  );
};

export default OptionSlot;
