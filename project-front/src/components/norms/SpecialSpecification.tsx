import { useGetSpecialItemsQuery } from "../../store/apis/elementApi";
import Select, { Option } from "../core/Select";
import { SpecialItem } from "../../commons/types";
import { useEffect } from "react";

interface SpecialSpecificationProps {
  setSelectedSpecification: React.Dispatch<
    React.SetStateAction<SpecialItem | undefined>
  >;
  selectedSpecification: SpecialItem | undefined;
  errors?: Record<string, string>;
  updateCustomFieldValue: (
    key: string,
    newValue: string | File | object
  ) => void;
  initialSelectedSpecification?: string | undefined;
}

const SpecialSpecification = ({
  setSelectedSpecification,
  selectedSpecification,
  errors,
  updateCustomFieldValue,
  initialSelectedSpecification,
}: SpecialSpecificationProps) => {
  const {
    data: specialItems,
    error: errorSpecialItems,
    isLoading: isLoadingSpecialItems,
  } = useGetSpecialItemsQuery(null);

  useEffect(() => {
    if (initialSelectedSpecification) {
      const specialItem = specialItems?.find(
        (specialItem) => specialItem.letter === initialSelectedSpecification
      );
      setSelectedSpecification(specialItem);
    }
  }, [initialSelectedSpecification, specialItems, setSelectedSpecification]);

  if (isLoadingSpecialItems) {
    return <div>Loading special items...</div>;
  }

  const handleSpecificationChange = (specialItem: SpecialItem | undefined) => {
    setSelectedSpecification(specialItem);
    updateCustomFieldValue("specification", specialItem?.letter || "");
  };

  return (
    <div>
      <Select
        options={specialItems?.map(
          (specialItem) =>
            ({
              label: specialItem.description,
              value: specialItem,
            } as Option<SpecialItem>)
        )}
        selectedValue={selectedSpecification}
        onChange={handleSpecificationChange}
        isLoading={false}
        placeholder="Selecciona un item"
        error={errors}
        errorKey="specialItem"
      />
    </div>
  );
};

export default SpecialSpecification;
