import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

const ROLE_USUARIO = 1;
const ROLE_ADMIN = 2;

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {

    const email = request.input("email");
    const password = request.input("password");

    const user = await User.query()
      .where("email", email)
      .where("role", ROLE_USUARIO)
      .first();

    if (!user) {
      return response
        .status(401)
        .send({ msg: "Email não encontrado em nossa base de dados" });
    }

    try {
      const token = await auth.use("api").attempt(email, password{
        expiresIn: '30min',
        name: user.email
      });
      return response
        .status(200)
        .send({ msg: "Login efetuado com sucesso", token: token, user: user });
    } catch (error) {
      return response.status(500).send({ error: 'Invalid credentials' });
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.use('api').revoke()
      return response
        .status(200)
        .send({ msg: "Sessão encerrada com sucesso" });
    } catch (error) {
      return response.status(500).send({ error: error.message });
    }
  }

  public async profile({ response, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate();
      return response.status(200).send(user);
    } catch (error) {
      return response
        .status(401)
        .send({ error: "Efetue login para acessar essa área !" });
    }
  }
}
