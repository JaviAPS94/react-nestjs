import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AccesoryService } from './accesory.service';
import { AccesoryController } from './accesory.controller';

@Module({
  imports: [HttpModule],
  providers: [AccesoryService],
  controllers: [AccesoryController],
})
export class AccesoryModule {}
