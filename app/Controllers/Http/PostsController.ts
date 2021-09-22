import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Post from "App/Models/Post";

const ROLE_USUARIO = 1;
const ROLE_ADMIN = 2;

export default class PostsController {
  public async index({ response }: HttpContextContract) {
    try {
      const posts = await Post.query().preload("user");
      return response.status(200).send({ posts });
    } catch (error) {
      return response.status(500).send({ error: error.message });
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only(["user_id", "title", "description"]);

      const post = await Post.create(data);

      return response.status(200).send({ post });
    } catch (error) {
      return response.status(500).send({ error: error.message });
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      //const post = await Post.findOrFail(params.id);
      const post = await Post.query()
        .where("id", params.id)
        .preload("user");
      return response.status(200).send({ post });
    } catch (error) {
      return response.status(500).send({ error: error.message });
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const post = await Post.findOrFail(params.id);
      const data = request.only(["title", "description"]);
      post.merge(data);
      await post.save();
      return response.status(200).send({ post });
    } catch (error) {
      return response.status(500).send({ error: error.message });
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      const post = await Post.findOrFail(params.id);
      await post.delete();
      return response.status(200).send({ msg: "Post apagado" });
    } catch (error) {
      return response.status(500).send({ error: error.message });
    }
  }
}
