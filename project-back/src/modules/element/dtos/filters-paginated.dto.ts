import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FiltersPaginatedDto extends PaginationDto {
  @IsOptional()
  @IsString()
  subType?: string;

  @IsOptional()
  @IsString()
  sapReference?: string;
}
