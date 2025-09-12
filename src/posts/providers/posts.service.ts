import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    // Find author from dayabase based on authorId
    const author = await this.usersService.findOneById(createPostDto.authorId);

    // Create Post
    const post = this.postsRepository.create({
      ...createPostDto,
      author: author!,
    });
    // return the post
    return await this.postsRepository.save(post);
  }

  public async findAll(userId: string) {
    const post = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        author: true,
      },
    });
    return post;
  }

  public async delete(id: number) {
    // Deleting the post
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }
}
