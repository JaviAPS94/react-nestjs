import { ApiProperty } from '@nestjs/swagger';

export class SemiFinishedOutputDto {
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: 'Bobina',
  })
  name: string;
  @ApiProperty({
    example: '123JR5',
  })
  code: string;
}
