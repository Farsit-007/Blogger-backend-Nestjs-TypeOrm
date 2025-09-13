import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Post } from '../post.entity';

@Injectable()
export class PostsService {
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
      author: author!,
      tags: tags,
    });
    // return the post
    return await this.postsRepository.save(post);
  }

  public async findAll(userId: string) {
    const post = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        // author: true,
        // tags: true,
      },
    });
    return post;
  }

  public async update(patchPostDto: PatchPostDto) {
    // Find the Tags
    const tags = await this.tagService.findmultiplesTags(
      patchPostDto.tags ?? [],
    );

    // Find the Post
    const post = await this.postsRepository.findOneBy({
      id: patchPostDto.id,
    });

    if (!post) {
      throw new Error(`Post with id ${patchPostDto.id} not found`);
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

    // Save the post and return
    return await this.postsRepository.save(post);
  }

  public async delete(id: number) {
    // Deleting the post
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }
}
