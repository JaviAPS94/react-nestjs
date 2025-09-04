import { useContext } from "react";
import { NormContext } from "../context/NormProvider";

export const useNorm = () => {
  const context = useContext(NormContext);
  if (!context) {
    throw new Error("useNorm must be used within a NormProvider");
  }
  return context;
};
