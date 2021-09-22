import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";

export default class Post extends BaseModel {

  public static table = 'posts';

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @column({ isPrimary: true })
  public id: number;

  @column()
  public userId: number;

  @column()
  public title: string;

  @column()
  public description: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
