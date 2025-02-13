import { ApiProperty } from '@nestjs/swagger';

export class NormSpecificationOutputDto {
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: 'Naturgy',
  })
  name: string;
  @ApiProperty({
    example: 'NATURGY',
  })
  code: string;
}
