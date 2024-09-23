export type Country = {
  id: number;
  name: string;
};

export type ElementField = {
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base: Record<string, Record<string, any>>;
};

export type Type = {
  id: number;
  name: string;
  field: ElementField;
};
