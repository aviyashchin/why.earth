import { LONG_PRESS_DELAY } from "@/libs/constants";
import { Option } from "pages/work";

type Props = {
  option: Option;
  selectedIds: Array<number>;
  onClick: any;
  onDoubleClick: any;
};

const OptionSlot = ({ option, selectedIds, onClick, onDoubleClick }: Props) => {
  let start = 0;

  const onClicked = (e: any, id: number) => {
    if (e.detail == 1) {
      onClick(id);
    } else if (e.detail == 2) {
      onDoubleClick(id);
    }
  };

  function onMouseDown() {
    start = Date.now();
  }

  function onMouseUp(id: number) {
    if (Date.now() - start > LONG_PRESS_DELAY) {
      onDoubleClick(id);
    }
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div
        className={`w-36 h-36 border flex flex-col justify-start items-start space-y-2 overflow-hidden rounded-md ${
          selectedIds.includes(option.id) ? "border-white" : "border-gray-500"
        } cursor-pointer`}
        onClick={(e) => onClicked(e, option.id)}
        onTouchStart={() => onMouseDown()}
        onTouchEnd={() => onMouseUp(option.id)}
      >
        <img
          className="w-full h-32 object-cover overflow-hidden"
          src="/dummy2.png"
        />
        <p className="p-2 text-left text-sm text-white w-full overflow-hidden text-ellipsis">
          {option.label}
        </p>
      </div>
    </div>
  );
};

export default OptionSlot;
