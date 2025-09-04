import type React from "react";

import { useEffect, useState } from "react";
import type { ElementResponse } from "../../commons/types";
import CountryFlag from "../core/CountryFlag";
import Checkbox from "../core/Checkbox";
import classNames from "classnames";
import { LockIcon } from "lucide-react";

interface ElementCardProps {
  element: ElementResponse;
  onCheckChange?: (element: ElementResponse, isChecked: boolean) => void;
  isChecked?: boolean;
  isBlocked?: boolean;
  blockedReason?: string;
}

const ElementCard: React.FC<ElementCardProps> = ({
  element,
  onCheckChange,
  isChecked = false,
  isBlocked = false,
  blockedReason,
}) => {
  const [checked, setChecked] = useState(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handleCheckChange = (checked: boolean) => {
    if (isBlocked) return;

    setChecked(checked);
    onCheckChange?.(element, checked);
  };

  return (
    <div
      key={element.id}
      className={classNames(
        "border rounded-lg p-4 w-full text-sm flex gap-3 transition-all duration-200",
        {
          "bg-emerald-50 border-emerald-300": checked && !isBlocked,
          "border-gray-300 hover:bg-gray-50": !checked && !isBlocked,
          "bg-gray-100 border-gray-300 opacity-75": isBlocked,
          "cursor-pointer": !isBlocked,
          "cursor-not-allowed": isBlocked,
        }
      )}
      onClick={() => !isBlocked && handleCheckChange(!checked)}
    >
      <div className="flex items-start pt-1">
        <Checkbox
          checked={checked}
          onCheckedChange={handleCheckChange}
          id={`element-${element.id}`}
          aria-label={`Select ${element.sapReference}`}
          disabled={isBlocked}
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-bold">{element.sapReference}</h3>
          {isBlocked && (
            <div className="text-gray-500 flex items-center gap-1">
              <LockIcon size={16} />
              <span className="text-xs">Bloqueado</span>
            </div>
          )}
        </div>
        <p>
          <b>Referencia SAP:</b> {element.sapReference}
        </p>
        <p>
          <b>Nombre Norma:</b> {element.norm.name}
        </p>
        <div className="flex items-center">
          <b>País:</b>{" "}
          <CountryFlag
            isoCode={element.norm.country.isoCode}
            className="w-8 h-5 object-cover ml-2"
          />
        </div>
        <p>
          <b>Subtipo:</b> {element.subType.name}
        </p>
        {isBlocked && blockedReason && (
          <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
            {blockedReason}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElementCard;
