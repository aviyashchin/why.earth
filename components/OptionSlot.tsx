import { LONG_PRESS_DELAY } from "@/libs/constants";
import { Option } from "pages/work";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

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

  const onClicked = (id: number) => {
    onClick(id);
  };

  const onMouseDown = (id: number) => {
    start = Date.now();
  };

  const onMouseUp = (id: number) => {
    if (Date.now() - start > LONG_PRESS_DELAY) {
      setIsEditing(true);
    }
  };

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
    option.image.then((image) => {
      setImage(image);
    });
  }, [option.image]);

  return (
    <div ref={ref} className="w-full flex justify-center items-center">
      <div
        className={`w-36 h-36 border flex flex-col justify-start items-start overflow-hidden rounded-md ${
          selectedIds.includes(option.id)
            ? "border-green-500"
            : "border-gray-500"
        } cursor-pointer`}
        onClick={() => onClicked(option.id)}
        onMouseDown={() => onMouseDown(option.id)}
        onMouseUp={() => onMouseUp(option.id)}
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
          <p className="p-2 h-8 max-h-[32px] text-left text-sm text-white w-full max-w-[130px] flex justify-start items-center whitespace-nowrap overflow-hidden text-ellipsis">
            {option.label}
          </p>
        )}
      </div>
    </div>
  );
};

export default OptionSlot;
