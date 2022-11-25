import { Attribute } from "pages/work";
import { useRef, useState } from "react";

type Props = {
  attribute: Attribute | null | undefined;
  setIsOpen: any;
  onSave: any;
};

const AttributeModal = ({ attribute, setIsOpen, onSave }: Props) => {
  const inputFile = useRef(null);
  const [previewImage, setPreviewImage] = useState<any>(
    attribute ? attribute.image : "dummy1.png"
  );
  const [file, setFile] = useState<any>(null);
  const [label, setLabel] = useState<string>(attribute ? attribute.label : "");
  const [description, setDescription] = useState<string>(
    attribute ? attribute.description : ""
  );

  const onImageSelected = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const preview = reader.result;
      setPreviewImage(preview);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed left-0 top-0 w-screen h-screen backdrop-blur-lg flex flex-col justify-center items-center z-50">
      <div className="w-full md:w-96 h-full md:h-auto flex flex-col justify-start items-center bg-[#11253e] rounded-md m-5 p-5 overflow-hidden space-y-3">
        <p className="w-full text-center text-lg text-white">
          {attribute ? "Edit Attribute" : "New Attribute"}
        </p>
        <img className="w-1/2 object-cover rounded-md" src={previewImage} />
        <input
          ref={inputFile}
          className="hidden"
          type="file"
          accept="image/*"
          onChange={(e) => onImageSelected(e)}
        />
        <button
          className="w-full h-12 bg-green-600 hover:bg-green-800 rounded-lg transition-all duration-300 cursor-pointer"
          onClick={() => {
            // @ts-ignore
            inputFile.current.click();
          }}
        >
          <span className="w-full text-white text-base md:text-lg font-bold whitespace-nowrap">
            Select Image
          </span>
        </button>
        <input
          className="flex w-full h-16 bg-gray-50 border border-gray-300 text-gray-900 text-base md:text-lg rounded-lg outline-none focus:outline-none p-5"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label"
        />
        <textarea
          className="w-full flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-base md:text-lg rounded-lg outline-none focus:outline-none p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        ></textarea>
        <div className="w-full flex flex-row justify-between items-center space-x-2">
          <button
            className="flex-grow h-12 bg-green-600 hover:bg-green-800 rounded-lg transition-all duration-300 cursor-pointer"
            onClick={() => onSave(file, label, description, attribute == null)}
          >
            <span className="w-full text-white text-base md:text-lg font-bold whitespace-nowrap">
              Save
            </span>
          </button>
          <button
            className="flex-grow h-12 bg-red-600 hover:bg-red-800 rounded-lg transition-all duration-300 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <span className="w-full text-white text-base md:text-lg font-bold whitespace-nowrap">
              Cancel
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttributeModal;
