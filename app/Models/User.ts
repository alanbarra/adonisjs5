import { DateTime } from "luxon";
import {
  BaseModel,
  beforeSave,
  column,
  HasMany,
  hasMany,
} from "@ioc:Adonis/Lucid/Orm";
import Post from "./Post";
import Hash from "@ioc:Adonis/Core/Hash";
import ApiToken from "./ApiToken";

export default class User extends BaseModel {
  public static table = "users";

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>;

  @hasMany(() => ApiToken)
  public tokens: HasMany<typeof ApiToken>;

  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public role: number;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @column()
  public remember_me_token: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
