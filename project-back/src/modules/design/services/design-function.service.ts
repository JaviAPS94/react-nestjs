import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DesignFunction } from '../entities/design-function.entity';
import { CreateDesignFunctionDto } from '../dtos/create-design-function.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  CalculateFunctionItemDto,
  FunctionParametersDto,
} from '../dtos/calculate-function.dto';
import { FunctionCalculationResultDto } from '../dtos/calculate-function-response.dto';

@Injectable()
export class DesignFunctionService {
  private readonly secureFunctionEngineUrl: string;

  constructor(
    @InjectRepository(DesignFunction)
    private readonly designFunctionRepository: Repository<DesignFunction>,
    private readonly httpService: HttpService,
  ) {
    this.secureFunctionEngineUrl = process.env.SECURE_FUNCTION_ENGINE_URL;
  }

  async create(createDto: CreateDesignFunctionDto): Promise<DesignFunction> {
    // Encrypt sensitive data before saving
    const dataToEncrypt = {
      plainTextFunction: createDto.expression,
    };

    const encryptedDataResponse = await firstValueFrom(
      this.httpService.post(
        `${this.secureFunctionEngineUrl}/function-engine/encrypt`,
        dataToEncrypt,
      ),
    );

    const designFunction = this.designFunctionRepository.create({
      name: createDto.name,
      expression: encryptedDataResponse.data.encrypted,
      variables: createDto.variables,
      description: createDto.description,
      constants: JSON.stringify(createDto.constants),
      code: createDto.code,
    });

    return this.designFunctionRepository.save(designFunction);
  }

  async calculateFunctions(
    functions: CalculateFunctionItemDto[],
  ): Promise<FunctionCalculationResultDto[]> {
    try {
      const calculationPromises = functions.map((func) =>
        this.calculateSingleFunction(func.designFunctionId, func.parameters),
      );

      return Promise.all(calculationPromises);
    } catch (error) {
      throw new Error(`Error calculating functions: ${error.message}`);
    }
  }

  private async calculateSingleFunction(
    designFunctionId: number,
    parameters: FunctionParametersDto,
  ): Promise<FunctionCalculationResultDto> {
    try {
      // Get the design function from the database
      const designFunction = await this.designFunctionRepository.findOne({
        where: { id: designFunctionId },
      });

      if (!designFunction) {
        throw new Error(
          `Design function with ID ${designFunctionId} not found`,
        );
      }

      // Extract the encrypted function from the design function entity
      const encryptedFunction = designFunction.expression;

      // Call the secure function engine
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.secureFunctionEngineUrl}/function-engine/evaluate-function`,
          {
            encryptedFunction,
            parameters,
            constants: JSON.parse(designFunction.constants) || {},
          },
        ),
      );

      // Add the design function ID to the result
      return {
        designFunctionId,
        ...response.data,
      };
    } catch (error) {
      throw new Error(`Error calling secure function engine: ${error.message}`);
    }
  }
}
