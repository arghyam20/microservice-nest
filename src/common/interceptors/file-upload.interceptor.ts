import { Injectable, mixin, NestInterceptor, ExecutionContext, CallHandler, BadRequestException, Type } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

export function createFileUploadOptions() {
  return {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads'),
      filename: (_req: any, file: any, callback: any) => {
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
        callback(null, fileName);
      },
    }),
    fileFilter: (_req: any, file: any, callback: any) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return callback(new BadRequestException('Only image files are allowed'), false);
      }
      callback(null, true);
    },
  };
}

export function FileUploadInterceptor(fieldName: string): Type<NestInterceptor> {
  return FileInterceptor(fieldName, createFileUploadOptions()) as any;
}

