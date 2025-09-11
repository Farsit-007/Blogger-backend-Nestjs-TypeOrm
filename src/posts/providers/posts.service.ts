import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOptions } from 'src/meta-options/providers/meta-options.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(MetaOptions)
    private readonly metaOptionsRepository: Repository<MetaOptions>,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    // Create Post
    const post = this.postsRepository.create(createPostDto);
    // return the post
    return await this.postsRepository.save(post);
  }

  public async findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    const post = await this.postsRepository.find();
    return post;
  }

  public async delete(id: number) {
    // Deleting the post
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }
}
