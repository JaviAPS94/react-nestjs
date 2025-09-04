import { ApiProperty } from '@nestjs/swagger';

export class FieldDto {
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: [{ voltaje: '10v' }],
  })
  base: Record<string, string>[];
}

export class SubTypeWithFieldsDto {
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: 'transformador clase A',
  })
  name: string;
  @ApiProperty({
    example: 'CVC',
  })
  code: string;
  @ApiProperty({
    type: () => FieldDto,
  })
  field: FieldDto;
}
