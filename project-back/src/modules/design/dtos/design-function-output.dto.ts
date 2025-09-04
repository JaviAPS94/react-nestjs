import { ApiProperty } from '@nestjs/swagger';

export class DesignFunctionOutputDto {
  @ApiProperty({
    description: 'The unique identifier of the design function',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the design function',
    example: 'Ohms Law',
  })
  name: string;

  @ApiProperty({
    description: 'The code of the design function',
    example: 'CUBIC',
  })
  code: string;

  @ApiProperty({
    description: 'The mathematical expression (decrypted)',
    example: 'V = I * R',
  })
  expression: string;

  @ApiProperty({
    description: 'The variables used in the expression (decrypted)',
    example: 'I,R',
  })
  variables: string;

  @ApiProperty({
    description: 'The constants used in the expression',
    example: '{"calculation": 1}',
  })
  constants: Record<string, number>;

  @ApiProperty({
    description: 'Optional description of the function',
    example:
      'Calculates the relationship between voltage, current, and resistance',
    required: false,
  })
  description?: string;
}
