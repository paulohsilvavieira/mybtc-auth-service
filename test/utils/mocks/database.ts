import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { IMemoryDb, newDb } from 'pg-mem';
import { DataSource } from 'typeorm';

export const makeFakeDb = async (
  entities: EntityClassOrSchema[],
): Promise<{ db: IMemoryDb; connection: DataSource }> => {
  const db = newDb();

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database',
  });

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'version',
  });

  const databaseConnection: DataSource =
    await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: entities,
      logging: false,
    });
  await databaseConnection.synchronize();

  return { db, connection: databaseConnection };
};
