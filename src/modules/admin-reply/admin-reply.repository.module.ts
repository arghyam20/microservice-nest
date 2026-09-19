import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminReply } from './schemas/admin-reply.schema';
import { AdminReplyRepository } from './repositories/admin-reply.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AdminReply])],
  providers: [AdminReplyRepository],
  exports: [AdminReplyRepository],
})
export class AdminReplyRepositoryModule {}
