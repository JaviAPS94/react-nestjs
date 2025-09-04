import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubDesignDto {
  @ApiProperty({
    example: 'SubDesign Name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'SubDesign Code',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: {
      key1: 'value1',
      key2: 'value2',
    },
    required: false,
  })
  @IsNotEmpty()
  @IsObject()
  data: Record<string, unknown>;
}

export class CreateDesignDto {
  @ApiProperty({
    example: 'Design Name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Design Code',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: [1, 2, 3],
    required: false,
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  elements: number[];

  @ApiProperty({
    type: [CreateSubDesignDto],
    required: false,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubDesignDto)
  subDesigns: CreateSubDesignDto[];

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  designSubtypeId: number;
}
