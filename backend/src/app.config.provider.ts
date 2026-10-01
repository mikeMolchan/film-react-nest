import { ConfigService } from '@nestjs/config';

export interface AppConfigDatabase {
  driver: string;
  host: string;
  port: number;
  name: string;
  username: string;
  password: string;
}

export interface AppConfig {
  port: number;
  database: AppConfigDatabase;
}

export const configProvider = {
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    port: configService.get<number>('PORT', 3000),
    database: {
      driver: configService.get<string>('DATABASE_DRIVER', 'postgres'),
      host: configService.get<string>('DATABASE_HOST', 'localhost'),
      port: configService.get<number>('DATABASE_PORT', 5432),
      name: configService.get<string>('DATABASE_NAME', 'prac'),
      username: configService.get<string>('DATABASE_USERNAME', 'prac'),
      password: configService.get<string>('DATABASE_PASSWORD', ''),
    },
  }),
};
