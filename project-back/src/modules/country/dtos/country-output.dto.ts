import { ApiProperty } from '@nestjs/swagger';

export class CountryOutputDto {
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: 'Colombia',
  })
  name: string;
}
