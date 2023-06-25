import { IMemoryDb, newDb } from 'pg-mem';
import { DataSource } from 'typeorm';

export const makeFakeDb = async (
  entities?: any[],
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

  const databaseConnection = db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? [__dirname + '../entities/index.{ts,js}'],
  });

  const connection: DataSource = await databaseConnection.initialize();

  await connection.synchronize();

  return { db, connection };
};
