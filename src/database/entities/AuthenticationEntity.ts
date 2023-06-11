import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'authentications' })
export class AuthenticationEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
