import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { ElementService } from './services/element.service';
import { ElementResponseDto } from './dtos/element.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SpecialItemOutputDto } from './dtos/special-item-output.dto';
import { SpecialItemService } from './services/special-item.service';
import { FiltersPaginatedDto } from './dtos/filters-paginated.dto';

@ApiTags('Element')
@Controller('element')
export class ElementController {
  constructor(
    private readonly elementService: ElementService,
    private readonly specialItemService: SpecialItemService,
  ) {}

  @Get('/by-filters')
  @ApiResponse({
    status: 200,
    description: 'The records have been successfully retrieved.',
    type: ElementResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getElementsByFilters(
    @Query('country') country: number,
    @Query('name') name: string,
    @Query('subType') subType: string,
    @Query('sapReference') sapReference: string,
  ): Promise<ElementResponseDto[]> {
    const elements = await this.elementService.getElementsByFilters(
      country,
      name,
      subType,
      sapReference,
    );

    return elements.map((element) => {
      const elementResponseDto = new ElementResponseDto();
      elementResponseDto.id = element.id;
      elementResponseDto.values = JSON.parse(element.values);
      elementResponseDto.subType = {
        id: element.subType.id,
        name: element.subType.name,
      };
      elementResponseDto.norm = {
        id: element.norm.id,
        name: element.norm.name,
        version: element.norm.version,
        country: {
          id: element.norm.country.id,
          name: element.norm.country.name,
          isoCode: element.norm.country.isoCode,
        },
      };
      return elementResponseDto;
    });
  }

  @Get('/by-filters-paginated')
  @ApiResponse({
    status: 200,
    description: 'The records have been successfully retrieved.',
    type: ElementResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getElementsByFiltersPaginated(
    @Query() filtersPaginatedDto: FiltersPaginatedDto,
  ) {
    try {
      return await this.elementService.getElementsByFiltersPaginated(
        filtersPaginatedDto,
      );
    } catch (error) {
      console.error('Error in getElementsByFiltersPaginated:', error);
      throw new HttpException(error.message, error?.getStatus() ?? 500);
    }
  }

  @Get('/special-items')
  @ApiResponse({
    status: 200,
    description: 'The records have been successfully retrieved.',
    type: SpecialItemOutputDto,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getSpecialItems(): Promise<SpecialItemOutputDto[]> {
    const specialItems = await this.specialItemService.findAll();

    return specialItems.map((specialItem) => {
      const specialItemOutputDto = new SpecialItemOutputDto();
      specialItemOutputDto.id = specialItem.id;
      specialItemOutputDto.letter = specialItem.letter;
      specialItemOutputDto.description = specialItem.description;
      return specialItemOutputDto;
    });
  }
}
