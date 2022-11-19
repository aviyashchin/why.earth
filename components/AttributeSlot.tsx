import { Attribute } from "pages/work";

type Props = {
  attribute: Attribute;
  selectedId: number | undefined;
  onClick: any;
};

const AttributeSlot = ({ attribute, selectedId, onClick }: Props) => {
  return (
    <div
      className={`w-36 h-36 border flex flex-col justify-start items-start space-y-2 overflow-hidden rounded-md ${
        selectedId == attribute.id ? "border-white" : "border-gray-500"
      } cursor-pointer`}
      onClick={() => onClick(attribute.id)}
    >
      <img
        className="w-full h-32 object-cover overflow-hidden"
        src="/dummy1.png"
      />
      <p className="p-2 text-left text-sm text-white">{attribute.label}</p>
    </div>
  );
};

export default AttributeSlot;
