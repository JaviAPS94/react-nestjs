import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  total: number;
  @IsNotEmpty()
  date: Date;
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
