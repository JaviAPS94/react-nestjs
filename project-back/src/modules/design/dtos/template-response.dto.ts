export class TemplateResponseDto {
  id: number;
  name: string;
  description?: string;
  code: string;
  cellsStyles?: Map<unknown, unknown>;
  cells: Map<unknown, unknown>;
}
