import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("user_friend")
export class UserFriendsEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @PrimaryColumn({ nullable: false })
  user: number;

  @PrimaryColumn({ nullable: false })
  other_user: number;
}
