import { Entity, BaseEntity, PrimaryColumn } from "typeorm";

@Entity("user_friend")
export class UserFriendsEntity extends BaseEntity {
  @PrimaryColumn({ nullable: false })
  user: number;

  @PrimaryColumn({ nullable: false })
  other_user: number;
}
