import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDesignFunctionDto {
  @ApiProperty({
    description: 'The name of the design function',
    example: 'Ohms Law',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The mathematical expression (will be encrypted)',
    example: 'V = I * R',
  })
  @IsNotEmpty()
  @IsString()
  expression: string;

  @ApiProperty({
    description: 'The variables used in the expression (will be encrypted)',
    example: 'i,r',
  })
  @IsNotEmpty()
  variables: string;

  @ApiProperty({
    description: 'The code of the function',
    example: 'CUBIC',
  })
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'The constants used in the expression',
    example: 'calculation',
  })
  constants: Record<string, number>;

  @ApiProperty({
    description: 'Optional description of the function',
    example:
      'Calculates the relationship between voltage, current, and resistance',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
