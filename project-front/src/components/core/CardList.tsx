import React from "react";
import Card from "./Card";

interface CardListProps {
  items: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
  }[];
}

const CardList: React.FC<CardListProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <Card
          key={item.id}
          title={item.title}
          description={item.description}
          imageUrl={item.imageUrl}
        />
      ))}
    </div>
  );
};

export default CardList;
