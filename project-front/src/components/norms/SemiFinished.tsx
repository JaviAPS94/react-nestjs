import { useState } from "react";
import { useGetSemiFinishedQuery } from "../../store";
import CheckboxList from "../core/CheckboxList";
import SkeletonText from "../core/skeletons/Skeleton";
import { SemiFinishedType } from "../../commons/types";

interface SemiFinishedProps {
  setSelectedSemiFinished: React.Dispatch<
    React.SetStateAction<SemiFinishedType | undefined>
  >;
}

const SemiFinished = ({ setSelectedSemiFinished }: SemiFinishedProps) => {
  const [selectedSubItems, setSelectedSubItems] = useState<number[]>([]);

  const {
    data: semiFinished,
    error: errorSemiFinished,
    isLoading: isLoadingSemiFinished,
  } = useGetSemiFinishedQuery(null);

  const toggleSubItem = (id: number) => {
    setSelectedSubItems((prev) =>
      prev.includes(id) ? prev.filter((subId) => subId !== id) : [...prev, id]
    );
    setSelectedSemiFinished(findSemiFinished(id));
  };

  const findSemiFinished = (id: number) => {
    return semiFinished?.find((item) => item.id === id);
  };

  return (
    <div>
      {isLoadingSemiFinished ? (
        <SkeletonText lines={6} className="mb-4" />
      ) : (
        <CheckboxList
          items={semiFinished ?? []}
          selectedItems={selectedSubItems}
          toggleItem={toggleSubItem}
          labelFieldKey="name"
          additionalFieldKey="code"
        />
      )}
    </div>
  );
};

export default SemiFinished;
