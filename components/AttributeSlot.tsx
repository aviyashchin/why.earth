import { LONG_PRESS_DELAY } from "@/libs/constants";
import { Attribute } from "pages/work";

type Props = {
  attribute: Attribute;
  selectedId: number | undefined;
  onClick: any;
  onDoubleClick: any;
};

const AttributeSlot = ({
  attribute,
  selectedId,
  onClick,
  onDoubleClick,
}: Props) => {
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
          selectedId == attribute.id ? "border-white" : "border-gray-500"
        } cursor-pointer`}
        onClick={(e) => onClicked(e, attribute.id)}
        onTouchStart={() => onMouseDown()}
        onTouchEnd={() => onMouseUp(attribute.id)}
      >
        <img
          className="w-full h-32 object-cover overflow-hidden"
          src="/dummy1.png"
        />
        <p className="p-2 text-left text-sm text-white w-full overflow-hidden text-ellipsis">
          {attribute.label}
        </p>
      </div>
    </div>
  );
};

export default AttributeSlot;
