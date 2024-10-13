import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,

          },
        },
        serializers: {
          err: pino.stdSerializers.err,
          req: (req) => ({
            method: req.method,
            url: req.url,
          }),
        },
        customLogLevel: (req, res, err) => {
          if (res.statusCode >= 400 || err) {
            return 'error';
          }
          return 'info';
        },
      },
    }),
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
