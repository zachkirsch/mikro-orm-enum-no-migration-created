import { Migration } from '@mikro-orm/migrations';

export class Migration20250509232849 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create type "Color" as enum ('RED', 'GREEN', 'BLUE');`);
    this.addSql(`create table "user" ("id" serial primary key, "favorite_color" "Color" not null);`);
  }

}
