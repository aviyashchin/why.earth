import { Option } from "pages/work";

type Props = {
  option: Option;
  selectedIds: Array<number>;
  onClick: any;
};

const OptionSlot = ({ option, selectedIds, onClick }: Props) => {
  return (
    <div
      className={`w-36 h-36 border flex flex-col justify-start items-start space-y-2 overflow-hidden rounded-md ${
        selectedIds.includes(option.id) ? "border-white" : "border-gray-500"
      } cursor-pointer`}
      onClick={() => onClick(option.id)}
    >
      <img
        className="w-full h-32 object-cover overflow-hidden"
        src="/dummy2.png"
      />
      <p className="p-2 text-left text-sm text-white">{option.label}</p>
    </div>
  );
};

export default OptionSlot;
