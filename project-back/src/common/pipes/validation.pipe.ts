import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = this.formatErrors(errors);
      throw new BadRequestException(messages);
    }
    return object;
  }

  private toValidate(metatype: any) {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]): string[] {
    const messages: string[] = [];

    errors.forEach((error) => {
      if (error.children && error.children.length > 0) {
        messages.push(...this.formatErrors(error.children));
      } else {
        const constraints = Object.values(error.constraints || {});
        messages.push(`${error.property}: ${constraints.join(', ')}`);
      }
    });

    return messages;
  }
}
