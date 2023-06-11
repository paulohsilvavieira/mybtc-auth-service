import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class AuthenticationEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
