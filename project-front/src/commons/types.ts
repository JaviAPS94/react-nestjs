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
  values: Record<string, unknown>[];
  subType: BaseType;
  norm: NormResponse;
  sapReference?: string;
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

export type SubTypeComplete = BaseType & {
  type: BaseType;
};

export type CompleteElementData = {
  id: number;
  values: Record<string, unknown>[];
  sapReference: string;
  subType: SubTypeComplete;
};

export type NormCompleteData = {
  id: number;
  name: string;
  version: string;
  country: Country;
  normFile: string | null;
  elements: CompleteElementData[];
  normSpecification: Specification | null;
};

export type BasePaginated = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type NormPaginated = BasePaginated & {
  data: NormCompleteData[];
};

export type ElementsPaginated = BasePaginated & {
  data: ElementResponse[];
};

export type BasePaginatedParams = {
  page: number;
  limit: number;
};

export type NormPaginatedParams = BasePaginatedParams & {
  name?: string;
  country?: number;
};

export type ElementsPaginatedParams = BasePaginatedParams & {
  name?: string;
  country?: number;
  subType?: string;
  sapReference?: string;
};

export type ElementsByIdsParams = {
  ids: number[];
};

export type CountryFlagsData = {
  flags: Record<string, string>;
};

export type DesignType = {
  id: number;
  name: string;
};

export type DesignSubtype = {
  id: number;
  name: string;
  designTypeId: number;
  designTypeName: string;
  designFunctions?: DesignFunction[];
};

export type CellStyle = {
  columnWidths: { [key: number]: number };
  rowHeights: { [key: number]: number };
};

interface Cell {
  value: string;
  formula: string;
  computed: number | string;
}

export type CellGrid = { [key: string]: Cell };

export type Template = {
  id: number;
  name: string;
  code: string;
  description: string;
  cellsStyles: CellStyle;
  cells: CellGrid;
};

export type DesignFunction = {
  id: number;
  name: string;
  code: string;
  variables: string;
  expression: string;
  description: string;
};

export type EvaluationData = {
  designFunctionId: number;
  parameters: Record<string, unknown>;
};

export type DesignFunctionEvaluation = {
  functions: EvaluationData[];
};

export type ResultData = {
  designFunctionId: number;
  result: number;
};

export type DesignFunctionEvaluationResponse = {
  results: ResultData[];
};

export type SubDesignData = {
  name: string;
  code: string;
  data: Record<string, unknown>;
};

export type DesignWithSubDesigns = {
  name: string;
  code: string;
  elements: number[];
  subDesigns: SubDesignData[];
  designSubtypeId: number;
};
