import { createPortal } from "react-dom";
import { type ReactNode } from "react";

type DropdownPortalProps = {
  children: ReactNode;
};

const DropdownPortal = ({ children }: DropdownPortalProps) => {
  return createPortal(
    <div className="absolute w-full max-h-60 overflow-y-auto border rounded-md shadow-lg z-[60] bg-white">
      {children}
    </div>,
    document.body
  );
};

export default DropdownPortal;
