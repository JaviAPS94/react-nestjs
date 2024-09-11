import { Module } from '@nestjs/common';
import { ElementController } from './element.controller';
import { ElementService } from './element.service';

@Module({
  controllers: [ElementController],
  providers: [ElementService]
})
export class ElementModule {}
