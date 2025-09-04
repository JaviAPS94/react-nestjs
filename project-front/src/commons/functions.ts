import { NormElement } from "../pages/NormPage";
import { NumberValidations, StringValidations } from "./types";

const toCamelCase = (str: string): string => {
  return str
    .split(/[\s_-]+/)
    .map((word: string, index: number) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
};

const validateNumberField = (
  fieldName: string,
  fieldValue: number,
  validations: NumberValidations
): string[] => {
  const errors: string[] = [];

  if (validations.positives && fieldValue <= 0) {
    errors.push(`${fieldName} debe ser un valor positivo.`);
  }
  if (validations.negatives && fieldValue >= 0) {
    errors.push(`${fieldName} debe ser un valor negativo.`);
  }
  if (validations.integer !== undefined) {
    const hasDecimals = fieldValue % 1 !== 0;
    if (validations.integer && hasDecimals) {
      errors.push(`${fieldName} debe ser un entero.`);
    }
  }
  if (validations.decimalsNumber !== undefined && !Number.isNaN(fieldValue)) {
    const decimalPlaces =
      fieldValue % 1 === 0 ? 0 : fieldValue.toString().split(".")[1].length;
    if (decimalPlaces > validations.decimalsNumber) {
      errors.push(
        `${fieldName} no debe tener más de ${validations.decimalsNumber} decimales.`
      );
    }
  }
  if (validations.range) {
    const { min, max } = validations.range;
    if (fieldValue < min || fieldValue > max) {
      errors.push(`${fieldName} debe estar entre ${min} y ${max}.`);
    }
  }
  if (validations.group && !validations.group.includes(fieldValue)) {
    errors.push(
      `${fieldName} debe ser uno de los siguientes valores ${validations.group}.`
    );
  }

  return errors;
};

const validateStringField = (
  fieldName: string,
  fieldValue: string,
  validations: StringValidations
): string[] => {
  const errors: string[] = [];

  if (validations.minLength && fieldValue.length < validations.minLength) {
    errors.push(
      `${fieldName} debe tener al menos ${validations.minLength} caracteres.`
    );
  }
  if (validations.maxLength && fieldValue.length > validations.maxLength) {
    errors.push(
      `${fieldName} no debe tener más de ${validations.maxLength} caracteres.`
    );
  }
  if (validations.pattern && !validations.pattern.test(fieldValue)) {
    errors.push(`${fieldName} no esta dentro de los valores permitidos.`);
  }
  if (validations.group && !validations.group.includes(fieldValue)) {
    errors.push(
      `${fieldName} debe ser uno de los siguientes valores ${validations.group}.`
    );
  }

  return errors;
};

const urlToFile = async (url: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const mimeType =
    response.headers.get("Content-Type") || "application/octet-stream"; // Default to binary if unknown
  const fileName = url.split("/").pop() || "downloadedFile";

  return new File([blob], fileName, { type: mimeType });
};

export { toCamelCase, validateNumberField, validateStringField, urlToFile };
