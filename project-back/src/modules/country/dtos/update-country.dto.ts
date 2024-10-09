import { ApiProperty } from '@nestjs/swagger';

export class UpdateCountryDto {
  @ApiProperty({
    example: 'Colombia',
  })
  name?: string;
}
