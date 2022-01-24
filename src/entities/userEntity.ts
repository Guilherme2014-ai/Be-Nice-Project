import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { ComplimentEntity } from "./complimentEntity";

import Hasher from "../password/Hash";

@Entity("users")
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ unique: true, nullable: false, length: 60 })
  email: string;

  @Column({ nullable: false })
  password_hash: string;

  //--------------------

  @OneToMany(
    () => ComplimentEntity,
    (_complimentEntity) => _complimentEntity.user_receiver, // Campo de Referencia
  )
  compliments_receiveds: ComplimentEntity[];

  @OneToMany(
    () => ComplimentEntity,
    (_complimentEntity) => _complimentEntity.user_sender, // Campo de Referencia
  )
  compliments_sents: ComplimentEntity[];

  //---------------------

  @BeforeInsert()
  async handle() {
    const hash = await new Hasher(this.password_hash).Hash();

    this.password_hash = hash;
  }
}
