import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty({
    example: 'Colombia',
    required: true,
  })
  name: string;
}
