import { Module } from '@nestjs/common';
import { NormController } from './norm.controller';
import { NormService } from './norm.service';

@Module({
  controllers: [NormController],
  providers: [NormService]
})
export class NormModule {}
