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
    type: () => TypeDto,
  })
  type: TypeDto;
  @ApiProperty({
    type: () => NormDto,
  })
  norm: NormDto;
}
