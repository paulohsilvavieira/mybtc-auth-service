import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as crypto from 'node:crypto';
import { AuthenticationEntity } from './AuthenticationEntity';

@Entity()
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({
    unique: false,
  })
  email: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  document?: string;

  @Column({ nullable: true })
  typeDocument?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  proofAddress?: string;

  @Column({ nullable: true })
  proofDocumentFront?: string;

  @Column({ nullable: true })
  proofDocumentBack?: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  @OneToOne(() => AuthenticationEntity, (auth) => auth.userInfo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authenticationId' })
  authenticationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  setId?() {
    this.id = crypto.randomUUID();
  }
}
