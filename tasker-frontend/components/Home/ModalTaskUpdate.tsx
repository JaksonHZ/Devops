
import React, { useEffect, useState } from "react";
import { X } from 'lucide-react';
import api from "@/lib/axios";
import { ItemTODO, ListTodo } from "@/types/ListTodo";
import { Category } from "@/types/ListTodo";
interface ModalTaskProps {
  isOpen: boolean;
  onClose: () => void;
  fetchList: () => void;
  itemTODO: ItemTODO;
}

const ModalTaskUpdate: React.FC<ModalTaskProps> = ({ isOpen, itemTODO, onClose, fetchList }) => {

  const [categorys, setCategorys] = useState<Category[]>();
  const [item, setItem] = useState<ItemTODO>(itemTODO);

  const handleOnClose = () => {
    onClose();
    setItem({
      id: "",
      title: "",
      description: "",
      done: false,
      order: 0,
      listTODOId: "",
      categoryId: "none",
      Category: {
        id: "",
        name: "",
        color: "",
      }
    });
  }

  const handleDeleteItem = async () => {
    try {
      await api.delete(`/item/${item.id}`).then(() => {
        handleOnClose();
        fetchList();
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdateItem = async () => {

    const bodyItem = {
      title: item.title,
      description: item.description,
      listTODOId: item.listTODOId,
      ...(item.categoryId !== null && { categoryId: item.categoryId })
    }

    try {
      await api.put(`/item/${item.id}`, bodyItem).then(() => {
        handleOnClose();
        fetchList();
      });
    } catch (error) {
      console.log(error);
    }
  }

  //pegar todas as categorias do usuário
  useEffect(() => {
    const fetchCategorys = async () => {
      try {
        const response = await api.get("/category");
        console.log(response.data);
        setCategorys(response.data.category);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategorys();
  }, [])

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center" style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
      <div className="shadow p-8 flex flex-col rounded-2xl bg-white border-2 border-solid border-[#FF7550] relative">

        <X size={28} onClick={handleOnClose} className="absolute right-2 cursor-pointer top-2"/>

        <p className="text-xl text-[#656262]">Titulo</p>
        <input 
          type="text" 
          className="w-[400px] h-8 px-5 bg-[#FEF7F5] rounded-xl border-2 border-solid border-[#A9A9A9]"
          value={item.title}
          onChange={(e) => setItem({...item, title: e.target.value})}
        />

        <p className="text-xl text-[#656262] mt-2">Descrição</p>
        <input 
          type="text" 
          className="w-[400px] h-[71px] px-5 bg-[#FEF7F5] rounded-xl border-2 border-solid border-[#A9A9A9]"
          value={item.description || ""}
          onChange={(e) => setItem({...item, description: e.target.value})}
        />

        <div className="flex flex-row text-xl text-[#656262] gap-x-7 mt-6 items-center">
          <p>Categoria</p>
          <select
            className="p-[10px] border-2 border-solid border-[#A9A9A9] rounded-xl"
            value={item.categoryId || "none"}
            onChange={(e) => setItem({...item, categoryId: e.target.value})}
          >
            <option value="none">Nenhuma</option>
            {
              categorys?.map((category, i) => (
                <option key={i} value={category.id}>{category.name}</option>
              ))
            }
          </select>
        </div>

        <div className="flex flex-row justify-center gap-9 mt-7">
          <button className="border-[#E57373]  px-2 border-2 text-[#E57373] hover:bg-[#E57373] hover:text-white rounded-lg"type="button"
            onClick={handleDeleteItem}>
            Delete
          </button>
          <button 
            className="bg-[#A9A9A9] px-2 text-white rounded-lg" type="button"
            onClick={() => handleUpdateItem()}
            disabled={!item.title}
            style={{cursor: !item.title ? "not-allowed" : "pointer"}}
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default ModalTaskUpdate;
