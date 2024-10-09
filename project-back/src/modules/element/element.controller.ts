import { Controller, Get, Query } from '@nestjs/common';
import { ElementService } from './element.service';
import { ElementResponseDto } from './dtos/element.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Element')
@Controller('element')
export class ElementController {
  constructor(private readonly elementService: ElementService) {}

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
  ): Promise<ElementResponseDto[]> {
    const elements = await this.elementService.getElementsByFilters(
      country,
      name,
    );

    return elements.map((element) => {
      const elementResponseDto = new ElementResponseDto();
      elementResponseDto.id = element.id;
      elementResponseDto.values = JSON.parse(element.values);
      elementResponseDto.type = {
        id: element.type.id,
        name: element.type.name,
      };
      elementResponseDto.norm = {
        id: element.norm.id,
        name: element.norm.name,
        version: element.norm.version,
        country: {
          id: element.norm.country.id,
          name: element.norm.country.name,
        },
      };
      return elementResponseDto;
    });
  }
}
