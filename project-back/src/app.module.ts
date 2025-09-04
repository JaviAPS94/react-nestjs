import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryModule } from './modules/country/country.module';
import { NormModule } from './modules/norm/norm.module';
import { ElementModule } from './modules/element/element.module';
import { TypeModule } from './modules/type/type.module';
import { FieldModule } from './modules/field/field.module';
import { SubtypeModule } from './modules/subtype/subtype.module';
import { AccesoryModule } from './modules/accesory/accesory.module';
import { SemiFinishedModule } from './modules/semi-finished/semiFinished.module';
import { DesignModule } from './modules/design/design.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    CountryModule,
    NormModule,
    ElementModule,
    TypeModule,
    FieldModule,
    SubtypeModule,
    AccesoryModule,
    SemiFinishedModule,
    DesignModule,
  ],
  providers: [],
})
export class AppModule {}
