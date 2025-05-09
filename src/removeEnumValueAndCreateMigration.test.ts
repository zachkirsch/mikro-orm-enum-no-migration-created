import { Migrator } from "@mikro-orm/migrations";
import {
  Entity,
  Enum,
  MikroORM,
  PostgreSqlDriver,
  PrimaryKey,
} from "@mikro-orm/postgresql";
import { readdir } from "fs/promises";
import path from "path";

enum Color {
  RED = "RED",
  GREEN = "GREEN",
  BLUE = "BLUE",
}

@Entity()
class User {
  @PrimaryKey()
  id!: number;

  @Enum({ items: () => Color, nativeEnumName: "Color" })
  favoriteColor!: Color;
}

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    driver: PostgreSqlDriver,
    dbName: "postgres",
    user: "postgres",
    password: "password",
    port: 1000,
    host: "localhost",
    entities: [User],
    debug: ["query", "query-params"],
    allowGlobalContext: true, // only for testing
    extensions: [Migrator],
    migrations: {
      path: "dist/migrations",
      pathTs: "src/migrations",
    },
    connect: false,
  });
});

afterAll(async () => {
  await orm.close(true);
});

test("create migration", async () => {
  expect(await getNumberOfMigrations()).toBe(1);

  // this should create a migration file because
  // the enum in code is { RED, GREEN } and the enum
  // in the snapshot is { RED, GREEN, BLUE }
  await orm.migrator.createMigration();

  expect(await getNumberOfMigrations()).toBe(2);
});

async function getNumberOfMigrations() {
  const filesInMigrationsDir = await readdir(
    path.join(__dirname, "migrations")
  );
  const migrationFiltes = filesInMigrationsDir.filter((file) =>
    file.startsWith("Migration")
  );
  return migrationFiltes.length;
}
