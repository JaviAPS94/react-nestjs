import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

export class CreateNormDto {
  @ApiProperty({
    example: 'Norma 123CRT',
    required: true,
  })
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    example: '1.0.0',
    required: true,
  })
  @IsNotEmpty()
  version: string;
  @ApiProperty({
    example: 1,
    required: true,
    name: 'country',
  })
  @IsNotEmpty()
  country: number;
  @ApiProperty({
    type: () => ElementDto,
    isArray: true,
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ElementDto)
  elements: ElementDto[];
}

export class ElementDto {
  @ApiProperty({
    example: { key: 'value' },
    required: true,
  })
  @IsNotEmpty()
  values: Record<string, any>[];
  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  type: number;
}
