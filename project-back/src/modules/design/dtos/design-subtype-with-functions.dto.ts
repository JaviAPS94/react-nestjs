import { ApiProperty } from '@nestjs/swagger';
import { DesignFunctionOutputDto } from './design-function-output.dto';

export class DesignSubTypeWithFunctionsDto {
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

  @ApiProperty({
    description: 'Associated design functions',
    type: [DesignFunctionOutputDto],
  })
  designFunctions: DesignFunctionOutputDto[];
}
