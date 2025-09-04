import { ApiProperty } from '@nestjs/swagger';
import { NormDto } from 'src/modules/norm/dtos/norm.dto';

export class TypeDto {
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: 'transformador',
  })
  name: string;
}

export class SubTypeDto {
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: 'tipo 1',
  })
  name: string;
  @ApiProperty({
    example: 'CVT',
  })
  code?: string;
  @ApiProperty({
    type: () => TypeDto,
  })
  type?: TypeDto;
}

export class ElementResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: { voltaje: '10v' },
  })
  values: Record<string, any>;
  @ApiProperty({
    type: () => SubTypeDto,
  })
  subType: SubTypeDto;
  @ApiProperty({
    type: () => NormDto,
  })
  norm: NormDto;
  @ApiProperty({
    example: 'CVT',
  })
  sapReference?: string;
}
