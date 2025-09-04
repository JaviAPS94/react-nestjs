import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GetAccesotyDto } from './dtos/get-accesory.dto';

@Injectable()
export class AccesoryService {
  constructor(private readonly httpService: HttpService) {}

  async getAccesories(getAccesoryDto: GetAccesotyDto) {
    const apiUrl = process.env.EXTERNAL_API_URL;
    const apiKey = process.env.API_KEY;

    const data = {
      palabraClave: getAccesoryDto.name,
      tipoInventario: getAccesoryDto.inventaryType,
    };

    const response = await firstValueFrom(
      this.httpService.post(`${apiUrl}/api/DocumentInbox/getItems`, data, {
        headers: {
          Api_Key: apiKey,
        },
      }),
    );
    return response.data;
  }
}
