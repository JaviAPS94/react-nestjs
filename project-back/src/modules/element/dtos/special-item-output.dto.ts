import { ApiProperty } from '@nestjs/swagger';

export class SpecialItemOutputDto {
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: 'A',
  })
  letter: string;
  @ApiProperty({
    example: 'Accesorios',
  })
  description: string;
}
