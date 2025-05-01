import { ApiProperty } from '@nestjs/swagger';

export class DesignSubTypeOutputDto {
  @ApiProperty({
    description: 'The unique identifier of the design subtype',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the design subtype',
    example: 'Overhead Distribution',
  })
  name: string;

  @ApiProperty({
    description: 'The ID of the parent design type',
    example: 1,
  })
  designTypeId: number;

  @ApiProperty({
    description: 'The name of the parent design type',
    example: 'Distribution',
  })
  designTypeName: string;
}
