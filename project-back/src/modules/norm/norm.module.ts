import { Module } from '@nestjs/common';
import { NormController } from './norm.controller';
import { NormService } from './services/norm.service';
import { NormSpecificationService } from './services/norm-specification.service';
import { NormSpecification } from './entities/norm-specification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([NormSpecification])],
  controllers: [NormController],
  providers: [NormService, NormSpecificationService],
})
export class NormModule {}
