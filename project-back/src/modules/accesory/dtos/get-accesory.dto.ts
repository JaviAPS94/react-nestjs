import { IsNotEmpty, IsString } from 'class-validator';

export class GetAccesotyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  inventaryType: string;
}
