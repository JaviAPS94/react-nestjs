export type Country = {
  id: number;
  name: string;
};

export type ElementField = {
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base: Record<string, Record<string, any>>;
};

export type BaseType = {
  id: number;
  name: string;
};

export type Type = BaseType & {
  field: ElementField;
};

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
  type: BaseType;
  norm: NormResponse;
};

export type GetElementsParams = {
  name?: string;
  country: number;
};
