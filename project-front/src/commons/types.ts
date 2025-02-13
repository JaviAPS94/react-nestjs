export type Country = {
  id: number;
  name: string;
  isoCode: string;
};

export type GetAccesoryByNameParams = {
  name: string;
  inventaryType: string;
};

export type Accessory = {
  id: number;
  reference: string;
  description: string;
  unitMeasurement?: string;
  semiFinished?: SemiFinishedType;
};

export type SemiFinishedType = {
  id: number;
  name: string;
  code: string;
};

export type ElementField = {
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base: Record<string, Record<string, any>>;
};

export type BaseType = {
  id: number;
  name: string;
  code: string | undefined;
};

export type Type = BaseType & {
  field: ElementField;
};

export type SubType = BaseType & {
  field: ElementField;
};

export type Specification = BaseType;

export type Norm = {
  name: string;
  version: string;
  country: number;
  elements: NormElement[];
};

export type NormElement = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>;
  type: number;
};

export type NormResponse = {
  id: number;
  name: string;
  version: string;
  country: Country;
};

export type ElementResponse = {
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>[];
  subType: BaseType;
  norm: NormResponse;
};

export type GetElementsParams = {
  name?: string;
  country: number;
};

export type SpecialItem = {
  id: number;
  letter: string;
  description: string;
};

export type NumberValidations = {
  positives?: boolean;
  negatives?: boolean;
  integer?: boolean;
  decimalsNumber?: number;
  range?: {
    min: number;
    max: number;
  };
  group?: number[];
};

export type StringValidations = {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  group?: string[];
};
