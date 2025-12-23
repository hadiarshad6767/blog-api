import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';


@Injectable() 
export class PostsService {
constructor(@InjectRepository(Post) private postsRepository: Repository<Post>,@InjectRepository(User) private usersRepository: Repository<User>,@InjectRepository(Comment) private commentsRepository: Repository<Comment>) {}
async create(createPostDto: CreatePostDto) {
  const { authorId, title, content } = createPostDto;

  const author = await this.usersRepository.findOne({
    where: { id: authorId },
  });

  if (!author) {
    throw new NotFoundException('Author does not exist');
  }

  const post = this.postsRepository.create({
    title,
    content,
    author, // attach relation
  });

  const savedPost = await this.postsRepository.save(post);

  // load relation for response
  return this.postsRepository.findOne({
    where: { id: savedPost.id },
    relations: ['author'],
  });
}


  findAll() {
    return this.postsRepository.find({ relations: ['author']});
  }

findAllComments(id: number) {
  return this.commentsRepository.find({
    where: {
      post: {
        id: id,
      },
    },
    relations: ['author', 'post'],
  });
}

  findOne(id: number) {
    return this.postsRepository.findOneBy({id,},);
  }

async update(id: number, updatePostDto: UpdatePostDto) {
  const post = await this.postsRepository.findOne({
    where: { id },
    relations: ['author'],
  });

  if (!post) {
    throw new NotFoundException('Post not found');
  }

  // Update author if provided
  if (updatePostDto.authorId !== undefined) {
    const author = await this.usersRepository.findOne({
      where: { id: updatePostDto.authorId },
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    post.author = author;
  }

  // Update scalar fields
  if (updatePostDto.title !== undefined)
    post.title = updatePostDto.title;

  if (updatePostDto.content !== undefined)
    post.content = updatePostDto.content;

  return this.postsRepository.save(post);
}


  remove(id: number) {
    return this.postsRepository.delete({id}); 
  }
}
