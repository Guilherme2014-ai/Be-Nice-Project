import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from "typeorm";
import { UserEntity } from "./userEntity";

@Entity("compliments")
export class ComplimentEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ nullable: false })
  message: string;

  @JoinColumn({ name: "user_receiver", referencedColumnName: "id" })
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  user_receiver: UserEntity;

  @JoinColumn({ name: "user_sender", referencedColumnName: "id" })
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  user_sender: UserEntity;
}
