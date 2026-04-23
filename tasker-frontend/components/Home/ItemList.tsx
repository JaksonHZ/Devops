import { ItemTODO } from "@/types/ListTodo";
import { useState } from "react";
import api from "@/lib/axios";
import ModalTaskUpdate from "./ModalTaskUpdate";
import { Pencil } from 'lucide-react';

interface ItemProps {
  item: ItemTODO;
  fetchList: () => void;
}

export default function Item({ item, fetchList }: ItemProps){
  const [done, setDone] = useState<boolean>(item.done);
  const [modalTask, setModalTask] = useState<boolean>(false);


  //atualizar o status da tarefa
  const handleCheck = async () => {
    try {
      await api.put(`/item/${item.id}`, { done: !item.done })
      .then(() => {
        setDone(!done);
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex w-[260px] flex-row py-2 px-5 border-2 border-solid border-[#A9A9A9] rounded-3xl bg-[#F8F8F8] justify-between mt-3">
      <div className="flex flex-col w-[80%]">
        <div className="flex flex-row gap-x-1  items-center">
          <div className="w-[20px] h-1 rounded-xl" style={{backgroundColor: `${item.Category?.color}`}}/>
          <p className="text-sm text-[#656262] font-medium">{item.Category?.name}</p>
        </div>
        <p className="text-lg">{item.title}</p>
        <span className="text-justify">{item.description}</span>
      </div>

      <div className="flex flex-row items-center justify-center gap-2">
        <input type="checkbox" checked={done} onChange={handleCheck} className="w-6 h-6 border-[#FF7550] self-center"/>
        <Pencil size={16} onClick={() => setModalTask(true)} className="cursor-pointer"/>
        {
          modalTask && (
            <ModalTaskUpdate 
              isOpen={modalTask} 
              onClose={() => setModalTask(false)}
              itemTODO={item}
              fetchList={fetchList}
            />
          )
        }
      </div>
    </div>
  );
}