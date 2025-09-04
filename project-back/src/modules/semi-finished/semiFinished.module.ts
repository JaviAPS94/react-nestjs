import { Module } from '@nestjs/common';
import { SemiFinishedService } from './semiFinished.service';
import { SemiFinishedController } from './semiFinished.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemiFinished } from './entities/semiFinished.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SemiFinished])],
  providers: [SemiFinishedService],
  controllers: [SemiFinishedController],
})
export class SemiFinishedModule {}
