import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as crypto from 'node:crypto';
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  setId?() {
    this.id = crypto.randomUUID();
  }
}
