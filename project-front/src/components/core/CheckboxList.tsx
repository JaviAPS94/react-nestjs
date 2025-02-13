import React from "react";
import CheckboxListItem from "./CheckboxListItem";

interface CheckboxListProps<T> {
  items: T[]; // Generic type for items
  selectedItems: number[];
  toggleItem: (id: number) => void;
  labelFieldKey: keyof T; // Key in `items` to use as the label
  additionalFieldKey: keyof T; // Key in `items` to use for additional info
}

const CheckboxList = <T extends { id: number }>({
  items,
  selectedItems,
  toggleItem,
  labelFieldKey,
  additionalFieldKey,
}: CheckboxListProps<T>): React.ReactElement => (
  <ul className="divide-y divide-gray-300 space-y-3 min-h-10">
    {items.map((item) => (
      <CheckboxListItem
        key={item.id}
        id={item.id}
        label={item[labelFieldKey] as string} // Dynamically access the label field
        additionalInfo={item[additionalFieldKey] as string} // Dynamically access additional info
        isChecked={selectedItems.includes(item.id)}
        onToggle={toggleItem}
        isDisabled={
          selectedItems.length >= 1 && !selectedItems.includes(item.id)
        }
      />
    ))}
  </ul>
);

export default CheckboxList;
