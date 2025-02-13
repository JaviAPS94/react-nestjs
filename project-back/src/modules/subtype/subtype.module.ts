import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubType } from './entities/subtype.entity';
import { SubTypeService } from './subtype.service';
import { SubTypeController } from './subtype.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SubType])],
  providers: [SubTypeService],
  controllers: [SubTypeController],
})
export class SubtypeModule {}
