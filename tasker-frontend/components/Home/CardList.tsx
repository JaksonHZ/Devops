import { useState, useRef } from 'react';
import { CirclePlus } from 'lucide-react';
import Item from './ItemList';
import { ListTodo, ItemTODO } from '@/types/ListTodo';
import { Trash2 } from 'lucide-react';
import ModalTask from './ModalTask';
import api from '@/lib/axios';
import { Draggable, Droppable } from 'react-beautiful-dnd';

interface CardListProps {
  list: ListTodo;
  handleDeleteList: (id: string) => void;
  fetchList: () => void;
}

export default function CardList({ list, handleDeleteList,fetchList }: CardListProps){
  const [showModalTask, setShowModalTask] = useState<boolean>(false);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(list.title);
  const inputRef = useRef<HTMLInputElement>(null);

  // funcao para editar o titulo da lista com double click
  const handleDoubleClick = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0); // foca no input
  };
  
  // funcao para salvar o titulo da lista
  const handleBlur = async () => {
    if (title.trim() === '') {
      setTitle(list.title);
    } else {
      await api.put(`/list/${list.id}`, { title }).then(() => fetchList());
    }
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return(
    <div className='flex flex-col py-3 px-5 border-2 border-solid border-[#A9A9A9] rounded-3xl items-center gap-y-7 bg-[#F8F8F8]'>

      <ModalTask 
        isOpen={showModalTask} 
        onClose={() => setShowModalTask(false)}
        list={list}
        fetchList={fetchList}
      />

      {
        isEditing 
        ? 
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        :
        <h1 onDoubleClick={() => handleDoubleClick()} className='text-xl font-semibold text-[#656262]'>{list.title}</h1>
      }


      <button 
        type='button'
        className="flex w-[260px] h-8 px-2 py-2 flex-row gap-2 items-center bg-[#F8F8F8] rounded-lg border-2 border-solid border-[#A9a9a9] hover:bg-white"
        onClick={() => setShowModalTask(true)}
      >
        <CirclePlus size={24} color="#656262" />
        <span className='text-xl text-[#656262]'>Create task</span>
      </button>
      
      { 
        <Droppable droppableId={`droppable${list.id}`}>
          {
            (provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {
                  list.ItemTODO.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {
                        (provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Item item={item} fetchList={fetchList} />
                          </div>
                        )
                      }
                    </Draggable>
                  ))
                }
                {provided.placeholder}
              </div>
            )
          }
        </Droppable>
    }


      <div className='flex flex-col gap-2'>
        <div className='w-[260px] h-[1px] bg-black'/>

        <button 
          className="flex w-[260px] h-8 px-2 py-2 flex-row gap-2 items-center bg-[#F8F8F8] rounded-lg border-2 border-solid border-[#A9a9a9] hover:bg-red-600
          text-xl text-[#656262] hover:text-white"
          onClick={() => handleDeleteList(list.id)}
          >
          <Trash2 size={24} color="#656262"/>
          Delete List
        </button>
      </div>

    </div>
  )
}