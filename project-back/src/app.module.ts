import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryModule } from './modules/country/country.module';
import { NormModule } from './modules/norm/norm.module';
import { ElementModule } from './modules/element/element.module';
import { TypeModule } from './modules/type/type.module';
import { FieldModule } from './modules/field/field.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
