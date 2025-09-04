import { Module } from '@nestjs/common';
import { NormController } from './norm.controller';
import { NormService } from './services/norm.service';
import { NormSpecificationService } from './services/norm-specification.service';
import { NormSpecification } from './entities/norm-specification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Norm } from './entities/norm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NormSpecification, Norm])],
  controllers: [NormController],
  providers: [NormService, NormSpecificationService],
})
export class NormModule {}
