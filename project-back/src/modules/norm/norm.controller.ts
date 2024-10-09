import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { NormService } from './norm.service';
import { CreateNormDto } from './dtos/create-norm.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Norm')
@Controller('norm')
export class NormController {
  constructor(private readonly normService: NormService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  @ApiBody({
    type: CreateNormDto,
    description: 'Json structure for norm object',
  })
  async createNorm(@Body() normData: CreateNormDto): Promise<void> {
    try {
      await this.normService.createNorm(normData);
    } catch (error) {
      throw new HttpException(error.message, error.getStatus());
    }
  }
}
