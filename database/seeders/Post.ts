import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Post from "App/Models/Post";

export default class PostSeeder extends BaseSeeder {
  public async run() {
    var Fakerator = require("fakerator");
    var fakerator = Fakerator("pt-BR");

    for (let index = 0; index < 40; index++) {
      await Post.createMany([
        {
          userId: fakerator.random.number(1, 20),
          title: fakerator.lorem.sentence(),
          description: fakerator.lorem.paragraph(),
        },
      ]);
    }
  }
}
