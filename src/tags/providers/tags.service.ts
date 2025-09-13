import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { In, Repository } from 'typeorm';
import { Tag } from '../tags.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepostory: Repository<Tag>,
  ) {}
  public async create(createTagDto: CreateTagDto) {
    const tag = this.tagsRepostory.create(createTagDto);
    return await this.tagsRepostory.save(tag);
  }

  public async findmultiplesTags(tags: number[]) {
    const result = await this.tagsRepostory.find({
      where: {
        id: In(tags),
      },
    });
    return result;
  }

  public async delete(id: number) {
    await this.tagsRepostory.delete(id);
    return {
      deleted: true,
      id,
    };
  }

  public async softRemove(id: number) {
    await this.tagsRepostory.softDelete(id);
    return {
      softDeleted: true,
      id,
    };
  }
}
