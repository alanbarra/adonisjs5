import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ApiToken from "App/Models/ApiToken";
import User from "App/Models/User";

export default class ResetPasswordsController {

  async process({ request, response }: HttpContextContract) {
    try {
      const data = request.only(["token", "password"]);

      const userToken = await ApiToken.query().where("token", data.token).first();

      if (!userToken) {
        return response
          .status(401)
          .send({ error: "Token inválido. Solicite uma nova senha !!" });
      }

      const user = await User.findOrFail(userToken.userId);
      user.password = data.password;
      await user.save();
      return response
        .status(200)
        .send({ message: "Senha alterada com sucesso !" });
    } catch (error) {
      return response.status(500).send({ error: error.message });
    }
  }
}
