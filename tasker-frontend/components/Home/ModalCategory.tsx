
import React, { useState } from "react";
import api from "@/lib/axios";

interface ModalCategoryProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCategory: React.FC<ModalCategoryProps> = ({ isOpen, onClose }) => {

  const [color, setColor] = useState<string>("#000000");
  const [name, setName] = useState<string>("");

  //salvar uma nova categoria
  const handleSaveCategory = () => {
    try {
      api.post("/category", { name, color })
      .then(() => {
        onClose();
        setColor("#000000");
        setName("");
      });
    } catch(error) {
      console.log(error);
    }
  }

  //descartar a categoria
  const handleDiscard = () => {
    onClose();
    setColor("#000000");
    setName("");
  }

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-opacity-65 flex items-center justify-center" style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
      <div className="shadow p-5 flex flex-col rounded-2xl bg-white border-2 border-solid border-[#FF7550] relative gap-y-4">

      <p className="text-xl">Nova Categoria</p>

      <div className="flex flex-row gap-2 items-center">
        <input 
          type="color" 
          className="w-6 h-6 rounded-full"
          onChange={(e) => setColor(e.target.value)}
          value={color}
        />
        <input 
          type="text" 
          placeholder="Name" 
          className="p-2 rounded-xl border-solid border-2 border-[#A9A9A9]" 
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>

      <div className="flex flex-row justify-center gap-9">
        <button className="border-[#A9A9A9]  px-2 border-2 text-[#656262] rounded-lg"type="button"
          onClick={handleDiscard}
        >
          Discard
        </button>
        <button 
          className="bg-[#A9A9A9] px-2 text-white rounded-lg" type="button"
          onClick={handleSaveCategory}
          disabled={!name}
          style={{cursor: !name ? "not-allowed" : "pointer"}}
        >
          Save
        </button>
      </div>

      </div>
    </div>
  );
};

export default ModalCategory;
