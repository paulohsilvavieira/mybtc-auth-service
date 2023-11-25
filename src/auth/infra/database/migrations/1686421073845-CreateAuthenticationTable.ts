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
            name: 'tokenRecoverPassword',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'expirationTimeToken',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'lastAccessAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'otpActive',
            type: 'boolean',
            default: false,
          },
          {
            name: 'otp_secret',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
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
