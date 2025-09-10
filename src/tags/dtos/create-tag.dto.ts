import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTagDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(256)
  name: string;

  @ApiProperty({
    example: 'is-a-slug',
    description: "For Example - 'my-url'",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  slug: string;

  @ApiPropertyOptional({
    description: 'This is a description of a post',
    example: 'The tags description',
  })
  @IsString()
  @IsOptional()
  description?: string;

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
  @MaxLength(1024)
  featuredImageUrl?: string;
}
