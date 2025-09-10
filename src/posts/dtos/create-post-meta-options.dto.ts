import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostMetaOptionsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  key: string;

  @IsNotEmpty()
  value: any;
}
