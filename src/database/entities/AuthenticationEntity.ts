import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as crypto from 'node:crypto';
import { UserEntity } from './UserEntity';
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

  @Column({ nullable: true })
  last_access_at?: Date;

  @Column({ nullable: true })
  otp_active?: boolean;

  @OneToOne(() => UserEntity, (user) => user.authenticationId, {
    cascade: true,
  })
  userInfo: UserEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  setId?() {
    this.id = crypto.randomUUID();
  }
}
