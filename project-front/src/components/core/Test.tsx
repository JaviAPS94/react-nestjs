import React from "react";
import CheckboxListItem from "./CheckboxListItem";

interface CheckboxListProps<T> {
  items: T[];
  selectedItems: unknown[];
  toggleItem: (id: unknown) => void;
  labelFieldKey: keyof T;
  additionalFieldKey: keyof T;
  mutipleItems: boolean;
}

const CheckboxList = <T extends { id: unknown }>({
  items,
  selectedItems,
  toggleItem,
  labelFieldKey,
  additionalFieldKey,
  mutipleItems,
}: CheckboxListProps<T>): React.ReactElement => (
  <ul className="divide-y divide-gray-300 space-y-3 min-h-10">
    {" "}
    {items.map((item) => (
      <CheckboxListItem
        key={item.id as string}
        id={item.id}
        label={item[labelFieldKey] as string}
        additionalInfo={item[additionalFieldKey] as string}
        isChecked={selectedItems.includes(item.id)}
        onToggle={toggleItem}
        isDisabled={
          !mutipleItems &&
          selectedItems.length >= 1 &&
          !selectedItems.includes(item.id)
        }
      />
    ))}{" "}
  </ul>
);
export default CheckboxList;
