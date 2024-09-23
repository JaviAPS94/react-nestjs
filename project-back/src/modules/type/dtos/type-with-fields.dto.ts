export class FieldDto {
  id: number;
  base: Record<string, string>[];
}

export class TypeWithFieldsDto {
  id: number;
  name: string;
  field: FieldDto;
}
