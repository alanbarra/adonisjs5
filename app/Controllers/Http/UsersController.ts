import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Mail from "@ioc:Adonis/Addons/Mail";
import User from "App/Models/User";
import Application from "@ioc:Adonis/Core/Application";
import { string } from "@ioc:Adonis/Core/Helpers";

const ROLE_USUARIO = 1;
const ROLE_ADMIN = 2;

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.query()
        .where("role", ROLE_USUARIO)
        .preload("posts");
      return response.status(200).send({ users });
    } catch (error) {
      return response.status(500).send({ error: error.message });
    }
  }

  public async register({ request, response }: HttpContextContract) {
    try {
      const { name, password, email, role } = request.only([
        "name",
        "email",
        "password",
        "role",
      ]);

      const newUser = await User.query().where("email", email).first();
      if (newUser) {
        return response
          .status(400)
          .send({ msg: "Já existe cadastro com esse email!" });
      }

      const user = await User.create({ name, password, email, role });

      await Mail.send((message) => {
        message
          .from("teste@teste.com")
          .to(user.email)
          .subject("Bem Vindo !")
          .htmlView("emails/welcome", { nome: user.name, email: user.email });
      });

      return response
        .status(200)
        .send({ msg: "Cadastro efetuado com sucesso", user });
    } catch (error) {
      return response.status(500).send({ error: error.message });
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id);
      await user.delete();
      return response
        .status(200)
        .send({ msg: "Usuário e seus posts apagados" });
    } catch (error) {
      return response.status(500).send({ error: error.message });
    }
  }

  public async upload({ request, response }: HttpContextContract) {
    try {
      const imagem = request.file("imagem", {
        size: "10mb",
        extnames: ["jpg", "png", "gif"],
      });

      if (!imagem) {
        return response.status(500).send({ msg: "arquivo não anexado" });
      }
      if (!imagem.isValid) {
        return response.status(500).send({ error: imagem.errors });
      }
      const rand = string.generateRandom(6);
      await imagem.move(Application.publicPath("uploads"), {
        name: `arquivo_${rand}.${imagem.subtype}`,
      });

      const nomeArq = `arquivo_${rand}.${imagem.subtype}`;
      console.log(nomeArq);
      return response.status(200).send({ msg: "arquivo enviado com sucesso" });
    } catch (error) {
      return response.status(500).send({ error: error.message });
    }
  }
}
