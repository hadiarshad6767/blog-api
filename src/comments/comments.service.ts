import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private commentsRepository: Repository<Comment>,@InjectRepository(User) private usersRepository: Repository<User>,@InjectRepository(Post) private postsRepository: Repository<Post>) {}
  async create(createCommentDto: CreateCommentDto) {
    
     const { authorId, postId, content } = createCommentDto;
   
     const author = await this.usersRepository.findOne({
       where: { id: authorId },
     });
   
     if (!author) {
       throw new NotFoundException('Author does not exist');
     }
    const post = await this.postsRepository.findOne({
       where: { id: postId },
     });
   
     if (!post) {
       throw new NotFoundException('Post does not exist');
     }
   
     const comment = this.commentsRepository.create({
       content,
       author,
        post,
     });
   
     return this.commentsRepository.save(comment);
  }

  // findAll() {
  //       return this.commentsRepository.find({ relations: ['author', 'post'] });
  // }
  async findAll(){
  const comments = await this.commentsRepository.find({ relations: ['author', 'post'] });
  
  return comments.map(c => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    author: {
      id: c.author.id,
      name: c.author.name,
      email: c.author.email,
    },
    post: {
      id: c.post.id,
      title: c.post.title,
      content: c.post.content,
    },
  }));
}


  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

async remove(id: number) {
  const result = await this.commentsRepository.delete({ id });

  if (result.affected === 0) {
    // Comment not found
    throw new NotFoundException(`Comment with id ${id} does not exist`);
  }

  return {
    status: HttpStatus.OK,
    message: `Comment with id ${id} deleted successfully`,
  };
}
}
