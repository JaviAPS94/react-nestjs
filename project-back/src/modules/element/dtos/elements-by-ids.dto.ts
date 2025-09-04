import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ElementsByIdsDto {
  @ApiProperty({
    description: 'Array of element IDs to fetch',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  ids: number[];
}
