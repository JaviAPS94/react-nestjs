import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FunctionParametersDto {
  [key: string]: number;
}

export class CalculateFunctionItemDto {
  @ApiProperty({
    description: 'The ID of the design function',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  designFunctionId: number;

  @ApiProperty({
    description: 'Parameters required for the function calculation',
    example: { x: 2, c: 5, d: 20 },
  })
  @IsNotEmpty()
  @IsObject()
  parameters: FunctionParametersDto;
}

export class CalculateFunctionDto {
  @ApiProperty({
    description: 'Array of functions to calculate',
    type: [CalculateFunctionItemDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CalculateFunctionItemDto)
  functions: CalculateFunctionItemDto[];
}
