/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Post } from '../post.entity';
import { Tag } from 'src/tags/tags.entity';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { ActiveUserInterface } from 'src/auth/interfaces/active-user.interface';
import { CreatePostProvider } from './create-post.provider';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    private readonly tagService: TagsService,
    private readonly paginationProvider: PaginationProvider,
    private readonly createPostProvider: CreatePostProvider,
  ) {}

  public async create(createPostDto: CreatePostDto, user: ActiveUserInterface) {
    return await this.createPostProvider.create(createPostDto, user);
  }

  public async findAll(postQuery: GetPostsDto): Promise<Paginated<Post>> {
    const post = await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postsRepository,
    );
    return post;
  }

  public async findSingle(userId: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id: Number(userId),
      },
      relations: {
        metaOptions: true,
        author: true,
        tags: true,
      },
    });
    return post;
  }

  public async update(patchPostDto: PatchPostDto) {
    // Find the Tags
    let tags: Tag[] | undefined = undefined;
    let post: Post | null = null;
    try {
      tags = await this.tagService.findmultiplesTags(patchPostDto.tags ?? []);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    if (!tags || tags?.length !== patchPostDto.tags?.length) {
      throw new BadRequestException(
        'Please check your tag It and ensure tghey are correct',
      );
    }

    // Find the Post
    try {
      post = await this.postsRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!post) {
      throw new BadRequestException(
        `Post with id ${patchPostDto.id} not found`,
      );
    }

    // Update the properties
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    // Assign the new tags
    post.tags = tags;

    try {
      post = await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    // Save the post and return
    return post;
  }

  public async delete(id: number) {
    // Deleting the post
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }
}
