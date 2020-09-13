import { Migration } from "@mikro-orm/migrations";

export class Migration20200912200851 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" varchar(255) not null, "password" varchar(255) not null);'
    );
    this.addSql(
      'alter table "user" add constraint "user_pkey" primary key ("id");'
    );
    this.addSql(
      'alter table "user" add constraint "user_username_unique" unique ("username");'
    );
  }
}
