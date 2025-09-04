import React from "react";
import Card from "./Card";
import { NormCompleteData } from "../../commons/types";
import { useNavigate } from "react-router-dom";

interface CardListProps {
  items: NormCompleteData[] | undefined;
}

const CardList: React.FC<CardListProps> = ({ items }) => {
  const navigate = useNavigate();

  const handleButtonClick = (id: number) => {
    navigate(`/norms/edit/${id}`);
  };

  return (
    <div className="flex flex-wrap justify-center gap-6 px-20 w-full">
      {items?.map((item) => (
        <div
          key={item.id}
          className="w-full sm:w-full md:w-[calc(100%/3-1.5rem)] lg:w-[calc(100%/5-1.5rem)]"
        >
          <Card
            id={item.id}
            title={item.name}
            description={`${item.version} - ${item.country.name}`}
            countryCode={item.country.isoCode}
            handleButtonClick={handleButtonClick}
          />
        </div>
      ))}
    </div>
  );
};

export default CardList;
