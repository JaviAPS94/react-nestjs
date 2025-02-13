import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { NormService } from './services/norm.service';
import { CreateNormDto } from './dtos/create-norm.dto';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File as MulterFile } from 'multer';
import { TransformAndValidatePipe } from './pipes/transform-data.pipe';
import { NormSpecificationService } from './services/norm-specification.service';
import { NormSpecificationOutputDto } from './dtos/norm-specification-output.dto';

@ApiTags('Norm')
@Controller('norm')
export class NormController {
  constructor(
    private readonly normService: NormService,
    private readonly normSpecificationService: NormSpecificationService,
  ) {}

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
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
  async createNorm(
    @Body(TransformAndValidatePipe) normData: CreateNormDto,
    @UploadedFiles() files: MulterFile[],
  ): Promise<void> {
    try {
      await this.normService.createNorm(normData, files);
    } catch (error) {
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Get('/specifications')
  @ApiResponse({
    status: 200,
    description: 'The records have been successfully retrieved.',
    type: NormSpecificationOutputDto,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getNormSpecifications(): Promise<NormSpecificationOutputDto[]> {
    try {
      const specifications = await this.normSpecificationService.findAll();
      return specifications.map((specification) => {
        const specificationDto = new NormSpecificationOutputDto();
        specificationDto.id = specification.id;
        specificationDto.name = specification.name;
        specificationDto.code = specification.code;
        return specificationDto;
      });
    } catch (error) {
      throw new HttpException(error.message, error.getStatus());
    }
  }
}
