import { ApiProperty } from '@nestjs/swagger';

export class FunctionCalculationResultDto {
  @ApiProperty({
    description: 'The ID of the design function',
    example: 1,
  })
  designFunctionId: number;

  @ApiProperty({
    description: 'The result of the function calculation',
    example: 6.046599384260201,
  })
  result: number;
}

export class CalculateFunctionResponseDto {
  @ApiProperty({
    description: 'Array of calculation results',
    type: [FunctionCalculationResultDto],
  })
  results: FunctionCalculationResultDto[];
}
