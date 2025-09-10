import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}

  public create(@Body() createPostDto : CreatePostDto){
    // Create Meta options
    

    // Create POst

    // Add Metaoptions to the post

    // return the post
  }



  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);

    return [
      {
        user: user,
        title: 'Test Title',
        content: 'Test content ',
      },
      {
        user: user,
        title: 'Test Title2',
        content: 'Test content 2',
      },
      {
        user: user,
        title: 'Test Title',
        content: 'Test content 2',
      },
    ];
  }
}
