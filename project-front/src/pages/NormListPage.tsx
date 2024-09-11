import { useState } from "react";
import CardList from "../components/core/CardList";
import NormForm from "../components/norms/NormForm";
import { useNavigate } from "react-router-dom";

const NormListPage = () => {
  const navigate = useNavigate();

  const items = [
    {
      id: 1,
      title: "Card 1",
      description: "This is a description for card 1.",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      title: "Card 2",
      description: "This is a description for card 2.",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      title: "Card 3",
      description: "This is a description for card 3.",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      title: "Card 3",
      description: "This is a description for card 3.",
      imageUrl: "https://via.placeholder.com/150",
    },
    // Add more items as needed
  ];

  const handleAddNormClick = () => {
    navigate("/new-norm");
  };

  return (
    <>
      <div className="mt-10 flex flex-col justify-center items-center">
        <div className="flex justify-between min-w-[30rem]">
          <h1 className="text-3xl font-semibold text-center mb-4">
            Listado de normas
          </h1>
          <button
            className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md mb-4 ml-6"
            onClick={handleAddNormClick}
          >
            Agregar norma
          </button>
        </div>
        <CardList items={items} />
      </div>
    </>
  );
};

export default NormListPage;
