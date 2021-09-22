import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import User from "App/Models/User";

export default class UserSeeder extends BaseSeeder {
  public async run() {
    var Fakerator = require("fakerator");
    var fakerator = Fakerator("pt-BR");

    for (let index = 0; index < 20; index++) {
      await User.createMany([
        {
          name: fakerator.names.name(),
          email: fakerator.internet.email(),
          role: 1,
          password: "123456",
        },
      ]);
    }
  }
}
