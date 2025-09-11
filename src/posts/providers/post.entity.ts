import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { postType } from '../enums/postType.enum';
import { statusType } from '../enums/statusType.enum';

import { MetaOptions } from 'src/meta-options/providers/meta-options.entity';
import { User } from 'src/users/providers/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: '512',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: postType,
    nullable: false,
    default: postType.POST,
  })
  postType: postType;

  @Column({
    type: 'varchar',
    length: '256',
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: statusType,
    nullable: false,
    default: statusType.DRAFT,
  })
  status: statusType;

  @Column({
    type: 'text',
    nullable: true,
  })
  content?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  featuredImageUrl?: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  publishOn: Date;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;
  // Work on there in the lecture on relationships
  tags?: string[];

  @OneToOne(() => MetaOptions, (metaOptions) => metaOptions.post, {
    cascade: true,
    eager: true,
  })
  metaOptions?: MetaOptions;
}
