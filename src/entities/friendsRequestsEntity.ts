import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from "typeorm";
import { UserEntity } from "./userEntity";

@Entity("friends_requests")
export class friendsRequestEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @JoinColumn({ name: "user_email", referencedColumnName: "email" })
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false })
  user_receiver_email: string;

  @Column({ nullable: false })
  user_sender_email: string;
}
