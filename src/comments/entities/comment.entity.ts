import { Exclude } from 'class-transformer';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
@Entity({ name: 'comments' })
export class Comment {

      @PrimaryGeneratedColumn({type:'bigint'})
      id: number;
    
      @Column('text') 
      content: string;
    
    
      @CreateDateColumn()
      createdAt: Date;
    
      @UpdateDateColumn()
      updatedAt: Date;
      
      @ManyToOne(() => User, user => user.comments, { nullable: false })
      @Exclude()
      author: User;  //   @JoinColumn({ name: 'authorId' })

      @ManyToOne(() => Post, post => post.comments, { nullable: false })
      @Exclude()
      post: Post;      

}
