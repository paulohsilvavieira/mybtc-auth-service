import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAuthenticationTable1686419096797
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'authentications',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'token_recover_password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'expiration_time_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'last_access_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'otp_active',
            type: 'boolean',
            default: false,
          },
          {
            name: 'otp_secret',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('authentications', true, true, true);
  }
}
