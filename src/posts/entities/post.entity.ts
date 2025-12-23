import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Comment } from 'src/comments/entities/comment.entity';
@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn({type:'bigint'})
  id: number;

  @Column({ length: 500 })
  title: string;

  @Column('text') 
  content: string;

  @Column()
  authorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @ManyToOne(() => User, user => user.posts, { nullable: false })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];
}
