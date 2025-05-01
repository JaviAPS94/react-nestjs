import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class CreateNormDto {
  @ApiProperty({
    example: 1234,
    required: false,
  })
  @IsOptional()
  id: number;
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
    example: 1,
    required: false,
  })
  @IsOptional()
  id?: number | undefined;
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
  subType: number;
  @ApiProperty({
    example: 1,
    required: true,
  })
  specialItem: number;
  @ApiProperty({
    example: '3-1000-13200-220-PR-Dyn5-ANSI-EC-P1',
    required: true,
  })
  sapReference: string;
}
