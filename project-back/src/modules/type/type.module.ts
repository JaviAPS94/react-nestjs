import { Module } from '@nestjs/common';
import { TypeService } from './type.service';
import { TypeController } from './type.controller';

@Module({
  providers: [TypeService],
  controllers: [TypeController]
})
export class TypeModule {}
