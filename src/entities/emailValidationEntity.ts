import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
const secret = () => Math.trunc(Math.random() * 100000000000);

@Entity("email_validations")
export class emailValidationEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ default: `${secret()}` })
  secret: string;

  @Column({ default: false })
  is_verified: boolean;
}
