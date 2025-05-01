import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignController } from './design.controller';
import { DesignTypeService } from './services/design-type.service';
import { DesignSubTypeService } from './services/design-subtype.service';
import { DesignType } from './entities/design-type.entity';
import { DesignSubType } from './entities/design-subtype.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DesignType, DesignSubType])],
  controllers: [DesignController],
  providers: [DesignTypeService, DesignSubTypeService],
  exports: [DesignTypeService, DesignSubTypeService],
})
export class DesignModule {}
