import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ApiToken from "App/Models/ApiToken";
import User from "App/Models/User";
import Env from "@ioc:Adonis/Core/Env";
import Mail from "@ioc:Adonis/Addons/Mail";

const { randomBytes } = require("crypto");
const { promisify } = require("util");

const ROLE_USUARIO = 1;
const ROLE_ADMIN = 2;

export default class ForgotPasswordsController {
  public async sendEmail({ request, response }: HttpContextContract) {
    try {
      const { email } = request.only(["email"]);

      const user = await User.query()
        .where("email", email)
        .where("role", ROLE_USUARIO)
        .first();

      if (!user) {
        return response
          .status(401)
          .send({ error: "Email não encontrado em nossa base de dados" });
      }

      const userToken = await ApiToken.query()
        .where("user_id", user.id)
        .where("type", "Bearer")
        .first();

      if (userToken) {
        await userToken.delete();
      }

      const random = await promisify(randomBytes)(16);
      const token = random.toString("hex");

      await ApiToken.create({
        userId: user.id,
        name: user.email,
        type: "Bearer",
        token: token,
      });

      const resetPasswordUrl = `${Env.get(
        "FRONT_URL"
      )}/response-password-reset?token=${token}`;

      await Mail.send((message) => {
        message
          .from("noreply@teste.com")
          .to(user.email)
          .subject("Resetar senha")
          .htmlView("emails/reset", {
            nome: user.name,
            email: user.email,
            link: resetPasswordUrl,
          });
      });

      return response
        .status(200)
        .send({ msg: "Email enviado com sucesso" });
    } catch (error) {
      return response.status(500).send({ error: error.message });
    }
  }
}
