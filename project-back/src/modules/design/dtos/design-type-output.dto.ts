import { ApiProperty } from '@nestjs/swagger';

export class DesignTypeOutputDto {
  @ApiProperty({
    description: 'The unique identifier of the design type',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the design type',
    example: 'Distribution',
  })
  name: string;
}
