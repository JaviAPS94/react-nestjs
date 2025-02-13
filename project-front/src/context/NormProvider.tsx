import { createContext, useState } from "react";

interface NormContextType {
  sharedState: string;
  setSharedState: (value: string) => void;
  showAddElement: boolean;
  toogleShowAddElement: () => void;
  showAddElementButton: boolean;
  toogleShowAddElementButton: () => void;
  editingElement: number | null;
  handleEditingElement: (index: number | null) => void;
  handleShowAddElement: (show: boolean) => void;
  handleShowAddElementButton: (show: boolean) => void;
  disableEdit: boolean;
  handleDisableEdit: (disable: boolean) => void;
}

export const NormContext = createContext<NormContextType | undefined>(
  undefined
);

export const NormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showAddElement, setShowAddElement] = useState<boolean>(false);
  const [showAddElementButton, setShowAddElementButton] = useState(true);
  const [editingElement, setEditingElement] = useState<number | null>(null);
  const [disableEdit, setDisableEdit] = useState<boolean>(false);
  const [sharedState, setSharedState] = useState("Hello");

  const toogleShowAddElement = () => {
    setShowAddElement(!showAddElement);
  };

  const toogleShowAddElementButton = () => {
    setShowAddElementButton(!showAddElementButton);
  };

  const handleEditingElement = (index: number | null) => {
    setEditingElement(index);
  };

  const handleShowAddElement = (show: boolean) => {
    setShowAddElement(show);
  };

  const handleShowAddElementButton = (show: boolean) => {
    setShowAddElementButton(show);
  };

  const handleDisableEdit = (disable: boolean) => {
    setDisableEdit(disable);
  };

  return (
    <NormContext.Provider
      value={{
        sharedState,
        setSharedState,
        showAddElement,
        toogleShowAddElement,
        showAddElementButton,
        toogleShowAddElementButton,
        editingElement,
        handleEditingElement,
        handleShowAddElement,
        handleShowAddElementButton,
        disableEdit,
        handleDisableEdit,
      }}
    >
      {children}
    </NormContext.Provider>
  );
};
