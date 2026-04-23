import React from 'react';

interface CardCreateListProps {
  setInputListTitle: React.Dispatch<React.SetStateAction<string>>;
  inputListTitle: string;
  handleHideCardCreateList: () => void;
  handleSaveClick: () => void; // Adiciona a propriedade handleSaveClick
}

export default function CardCreateList(props: CardCreateListProps) {
  const { setInputListTitle, inputListTitle, handleHideCardCreateList, handleSaveClick } = props;

  const handleDiscardClick = () => {
    setInputListTitle('');
    handleHideCardCreateList();
  };

  return (
    <div className="w-[289px] h-[152px] bg-[F8F8F8] border-solid border-[#A9A9A9] border-2 rounded-3xl p-5 flex flex-col gap-1">
      <p className="text-lg">List title</p>
      <input
        className="w-[238px] h-[35px] border-solid border-2 border-[#A9A9A9] px-5 rounded-xl"
        value={inputListTitle}
        onChange={(e) => setInputListTitle(e.target.value)}
      />
      <div className="w-[50%] flex flex-row gap-2 mt-1">
        <button
          className="bg-[#A9A9A9] px-2 text-white rounded-lg"
          type="button"
          onClick={handleSaveClick}
          disabled={!inputListTitle}
          style={{cursor: !inputListTitle ? 'not-allowed' : 'pointer'}}
        >
          Save
        </button>
        <button
          className="border-[#A9A9A9]  px-2 border-2 text-[#656262] rounded-lg"
          type="button"
          onClick={handleDiscardClick}
        >
          Discard
        </button>
      </div>
    </div>
  );
}
