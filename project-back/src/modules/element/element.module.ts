import { Module } from '@nestjs/common';
import { ElementController } from './element.controller';
import { ElementService } from './services/element.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialItem } from './entities/special-item.entity';
import { SpecialItemService } from './services/special-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialItem])],
  controllers: [ElementController],
  providers: [ElementService, SpecialItemService],
})
export class ElementModule {}
