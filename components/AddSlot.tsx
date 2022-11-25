type Props = {
  onClick: any;
};

const AddSlot = ({ onClick }: Props) => {
  return (
    <div className="w-full flex justify-center items-center">
      <div
        className={`w-36 h-36 border flex flex-col justify-center items-center space-y-2 overflow-hidden rounded-md text-white border-gray-500 cursor-pointer`}
        onClick={() => onClick()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          className="bi bi-plus-lg"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default AddSlot;
