import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateNormDto } from '../dtos/create-norm.dto';
import { validate } from 'class-validator';

@Injectable()
export class TransformAndValidatePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: any, _metadata: ArgumentMetadata) {
    const elements = [];

    // Extracting elements
    let index = 0;
    while (value[`elements[${index}].subType`] !== undefined) {
      const element = {
        id: undefined,
        subType: parseInt(value[`elements[${index}].subType`], 10),
        specialItem: parseInt(value[`elements[${index}].specialItem`], 10),
        sapReference: value[`elements[${index}].sapReference`],
        values: [],
      };

      if (value[`elements[${index}].id`]) {
        element.id = parseInt(value[`elements[${index}].id`], 10);
      }

      let valueIndex = 0;
      while (
        value[`elements[${index}].values[${valueIndex}].key`] !== undefined
      ) {
        const key = value[`elements[${index}].values[${valueIndex}].key`];
        const name = value[`elements[${index}].values[${valueIndex}].name`];
        const type = value[`elements[${index}].values[${valueIndex}].type`];
        const valueField =
          value[`elements[${index}].values[${valueIndex}].value`];

        element.values.push({
          key,
          name,
          type,
          value: valueField,
        });

        valueIndex++;
      }

      elements.push(element);
      index++;
    }

    // Transform form-data to CreateNormDto
    const transformedDto = plainToInstance(CreateNormDto, {
      id: value.id,
      name: value.name,
      version: value.version,
      country: parseInt(value.country, 10), // Ensure country is a number
      elements,
    });

    // Manually trigger validation on the transformed DTO
    const errors = await validate(transformedDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Return the transformed and validated DTO
    return transformedDto;
  }
}
