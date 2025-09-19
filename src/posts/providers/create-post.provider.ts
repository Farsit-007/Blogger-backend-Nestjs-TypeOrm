import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { Post } from '../post.entity';
import { ActiveUserInterface } from 'src/auth/interfaces/active-user.interface';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tags.entity';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    private readonly tagService: TagsService,
  ) {}

  public async create(createPostDto: CreatePostDto, user: ActiveUserInterface) {
    let author: User | null = null;
    let tags: Tag[] | [] = [];
    try {
      // Find author from dayabase based on authorId
      author = await this.usersService.findOneById(user.sub);

      tags = await this.tagService.findmultiplesTags(createPostDto.tags!);
    } catch (error) {
      throw new ConflictException(error);
    }
    if (createPostDto.tags?.length !== tags?.length) {
      throw new BadRequestException('Please check your tags');
    }
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
