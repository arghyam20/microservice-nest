import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/bases/base.repository';
import { AdminReply, AdminReplyDocument } from '../schemas/admin-reply.schema';

@Injectable()
export class AdminReplyRepository extends BaseRepository<AdminReplyDocument> {
  constructor(
    @InjectRepository(AdminReply) repository: Repository<AdminReplyDocument>,
  ) {
    super(repository);
  }
}
