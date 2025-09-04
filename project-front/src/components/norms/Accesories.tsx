import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useGetAccesoriesByNameMutation } from "../../store";
import { Accessory, GetAccesoryByNameParams } from "../../commons/types";
import Button from "../core/Button";
import SkeletonText from "../core/skeletons/Skeleton";
import { INVENTARY_TYPE_DEFAULT } from "../../commons/constants";
import CheckboxList from "../core/CheckboxList";

export interface SubItem {
  id: number;
  name: string;
  code: string;
}

interface AccesoriesProps {
  accessoriesData: Accessory[];
  setAccessoriesData: React.Dispatch<React.SetStateAction<Accessory[]>>;
  selectedSubItems: number[];
  setSelectedSubItems: React.Dispatch<React.SetStateAction<number[]>>;
}

const Accesories = ({
  accessoriesData,
  setAccessoriesData,
  selectedSubItems,
  setSelectedSubItems,
}: AccesoriesProps) => {
  const [getAccesoriesByName, getAccesoriesByNameResult] =
    useGetAccesoriesByNameMutation();
  const [accessorySearch, setAccessorySearch] = useState("");
  const [accessorySearchInputError, setAccessorySearchInputError] =
    useState("");

  useEffect(() => {
    if (getAccesoriesByNameResult.isSuccess) {
      setAccessoriesData(getAccesoriesByNameResult.data);
      setAccessorySearch("");
    }

    // if (getAccesoriesByNameResult.isError) {
    //   setShowErrorAlert(true);
    //   setTimeout(() => setShowErrorAlert(false), 3000);
    // }
  }, [getAccesoriesByNameResult]);

  const toggleSubItem = (id: unknown) => {
    const subItemId = id as number;
    setSelectedSubItems((prev) =>
      prev.includes(subItemId)
        ? prev.filter((subId) => subId !== subItemId)
        : [...prev, subItemId]
    );
  };

  const handleAccesoriesSearch = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!accessorySearch.trim()) {
      setAccessorySearchInputError(
        "Por favor ingrese algún texto para poder buscar."
      );
      return;
    }

    setAccessorySearchInputError("");
    const getAccesoriesByNameParams: GetAccesoryByNameParams = {
      name: accessorySearch,
      inventaryType: INVENTARY_TYPE_DEFAULT,
    };
    getAccesoriesByName(getAccesoriesByNameParams);
  };

  return (
    <div className="w-full">
      <div className="p-4 space-y-4">
        <form 
          className="w-full flex items-center justify-between" 
          onSubmit={handleAccesoriesSearch}
        >
          <div className="relative w-full pr-5">
            <input
              type="text"
              placeholder="Buscar por accesorio"
              value={accessorySearch}
              onChange={(e) => {
                e.stopPropagation(); // Stop event from bubbling up
                setAccessorySearch(e.target.value);
                setAccessorySearchInputError(""); // Clear error while typing
              }}
              onClick={(e) => e.stopPropagation()} // Stop click event from bubbling up
              onKeyDown={(e) => e.stopPropagation()} // Stop key events from bubbling up
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                accessorySearchInputError
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            <BiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            {accessorySearchInputError && (
              <p className="mt-1 text-sm text-red-500 absolute left-0 top-full">
                {accessorySearchInputError}
              </p>
            )}
          </div>
          <div>
            <Button
              primary
              type="submit"
              loading={getAccesoriesByNameResult.isLoading}
              onClick={(e) => {
                e.stopPropagation(); // Stop event from bubbling up
                handleAccesoriesSearch(e);
              }}
              icon={<BiSearch />}
            >
              Buscar
            </Button>
          </div>
        </form>
      </div>
      {getAccesoriesByNameResult.isLoading ? (
        <SkeletonText lines={6} className="mb-4" />
      ) : (
        <CheckboxList
          items={accessoriesData}
          selectedItems={selectedSubItems}
          toggleItem={toggleSubItem}
          labelFieldKey="description"
          additionalFieldKey="reference"
          multipleItems={false}
        />
      )}
    </div>
  );
};

export default Accesories;
