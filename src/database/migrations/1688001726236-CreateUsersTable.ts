import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUsersTable1688001726236 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
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
          },
          {
            name: 'firstName',
            type: 'varchar',
            isNullable: false,
            default: "''",
          },
          {
            name: 'lastName',
            type: 'varchar',
            isNullable: false,
            default: "''",
          },

          {
            name: 'document',
            type: 'varchar',
            isNullable: false,
            default: "''",
          },

          {
            name: 'typeDocument',
            type: 'varchar',
            isNullable: false,
            default: "''",
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: false,
            default: "''",
          },
          {
            name: 'state',
            type: 'varchar',
            isNullable: false,
            default: "''",
          },
          {
            name: 'country',
            type: 'varchar',
            isNullable: false,
            default: "''",
          },
          {
            name: 'phoneNumber',
            type: 'varchar',
            isNullable: false,
            default: "''",
          },

          {
            name: 'proofAddress',
            type: 'varchar',
            isNullable: false,
            default: "''",
          },
          {
            name: 'proofDocumentFront',
            type: 'varchar',
            isNullable: false,
            default: "''",
          },
          {
            name: 'proofDocumentBack',
            type: 'varchar',
            isNullable: false,
            default: "''",
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
            default: "''",
          },
          {
            name: 'authenticationId',
            type: 'varchar',
            isNullable: false,
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
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['authenticationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'authentications',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users', true, true, true);
  }
}
