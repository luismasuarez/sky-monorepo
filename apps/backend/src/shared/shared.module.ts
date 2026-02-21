import { Global, Module } from '@nestjs/common';
import { MinioService } from './services/minio.service';
import { NativeRpcService } from './services/native-rpc.service';
import { PrismaService } from './services/prisma.service';
import { ResponseService } from './services/response.service';

@Global()
@Module({
  providers: [
    PrismaService,
    ResponseService,
    NativeRpcService,
    MinioService,
  ],
  exports: [
    PrismaService,
    ResponseService,
    NativeRpcService,
    MinioService,
  ],
})
export class SharedModule { }
