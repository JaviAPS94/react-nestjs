import { ApiProperty } from '@nestjs/swagger';

export class OutputAccesoryDto {
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: '06010504',
  })
  reference: string;
  @ApiProperty({
    example: 'INDICADOR NIVEL ACEITE CON CONTACTOS',
  })
  description: string;

  static fromEntity(entity: any): OutputAccesoryDto {
    const dto = new OutputAccesoryDto();
    dto.id = entity.item_id;
    dto.reference = entity.referencia;
    dto.description = entity.descripcion;
    return dto;
  }
}
