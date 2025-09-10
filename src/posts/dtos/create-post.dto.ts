import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postType } from '../enums/postType.enum';
import { statusType } from '../enums/statusType.enum';
import { CreatePostMetaOptionsDto } from './create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'This is a title',
    description: 'This is the title for the blog post',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(512)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: postType,
    description: "Possible value : 'post', 'page', 'story', 'series'",
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    example: 'is-a-slug',
    description: "For Example - 'my-url'",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  slug: string;

  @ApiProperty({
    enum: statusType,
    description: "Possible value : 'draft', 'scheduled', 'review', 'published'",
  })
  @IsEnum(statusType)
  @IsNotEmpty()
  status: statusType;

  @ApiPropertyOptional({
    description: 'This is a content of a post',
    example: 'The post content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'This is a schema of a post',
    example: '{"type":"article","author":"Robayat"}',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'This is a featuredImageUrl of a post',
    example: 'https://example.com/images/post1.jpg',
  })
  @IsOptional()
  @IsUrl()
  featuredImageUrl?: string;

  @ApiProperty({
    description: 'This is a publish date of a post',
    example: '2025-09-08T10:30:00.000Z',
  })
  @IsISO8601()
  publishOn: Date;

  @ApiPropertyOptional({
    description: 'This is a tags of a post',
    example: '["tech", "blogging", "nestjs"]',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[];

  @ApiPropertyOptional({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'The key can be string',
          example: 'sidebarEnabled',
        },
        value: {
          type: 'any',
          description: 'The value can be any types',
          example: true,
        },
      },
    },
    description: 'This is a tags of a post',
    example: '',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto[];
}
