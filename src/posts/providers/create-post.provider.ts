import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { Post } from '../post.entity';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    private readonly tagService: TagsService,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    // Find author from dayabase based on authorId
    const author = await this.usersService.findOneById(createPostDto.authorId);

    const tags = await this.tagService.findmultiplesTags(createPostDto.tags!);

    // Create Post
    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });
    // return the post
    return await this.postsRepository.save(post);
  }
}
