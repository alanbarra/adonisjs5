import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  //
  Route.post("/login", "AuthController.login");
  Route.post("/logout", "AuthController.logout").middleware("auth");
  Route.get("/profile", "AuthController.profile").middleware("auth");
  //
  Route.post("/forgotPassword", "ForgotPasswordsController.sendEmail");
  Route.post("/resetPassword", "ResetPasswordsController.process");
  //
  Route.get("/users", "UsersController.index");
  Route.post("/users", "UsersController.register");
  Route.delete("/users/:id", "UsersController.destroy");
  Route.post("/upload", "UsersController.upload");
  //
  Route.get("/posts", "PostsController.index");
  Route.post("/posts", "PostsController.store");
  Route.get("/posts/:id", "PostsController.show");
  Route.put("/posts/:id", "PostsController.update");
  Route.delete("/posts/:id", "PostsController.destroy");
  //Route.resource('/posts', 'PostsController').apiOnly();
}).prefix("/api");
