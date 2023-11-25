import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity({ name: 'authentications' })
export class AuthenticationEntity {
  @PrimaryColumn()
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    nullable: true,
  })
  tokenRecoverPassword?: string;

  @Column({
    nullable: true,
  })
  expirationTimeToken?: number;

  @Column({ nullable: true })
  lastAccessAt?: Date;

  @Column({ nullable: true })
  otpActive?: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
