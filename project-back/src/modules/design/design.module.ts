import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignController } from './design.controller';
import { DesignTypeService } from './services/design-type.service';
import { DesignSubTypeService } from './services/design-subtype.service';
import { DesignType } from './entities/design-type.entity';
import { DesignSubType } from './entities/design-subtype.entity';
import { DesignFunction } from './entities/design-function.entity';
import { DesignFunctionService } from './services/design-function.service';
import { DesignFunctionController } from './design-function.controller';
import { HttpModule } from '@nestjs/axios';
import { TemplateService } from './services/template.service';
import { Template } from './entities/template.entity';
import { DesignService } from './services/design.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      DesignType,
      DesignSubType,
      DesignFunction,
      Template,
    ]),
  ],
  controllers: [DesignController, DesignFunctionController],
  providers: [
    DesignTypeService,
    DesignSubTypeService,
    DesignFunctionService,
    TemplateService,
    DesignService,
  ],
  exports: [
    DesignTypeService,
    DesignSubTypeService,
    DesignFunctionService,
    TemplateService,
    DesignService,
  ],
})
export class DesignModule {}
