const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const knex = require("../database/knex");
const authConfig = require("../configs/auth");
const AppError = require("../utils/AppError");

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body;

    const user = await knex("users").where({ email }).first();

    if (!user) {
      throw new AppError("E-mail e/ou senha incorreta.", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("E-mail e/ou senha incorreta.", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role}, secret, {
      subject: String(user.id),
      expiresIn
    });

    // nome do cookie, valor do conteudo, objeto com config de segurança
    response.cookie("token", token, {
      httpOnly: true,  // impede que o cookie seja acessado por scripts, somente acessada por req. http
      sameSite: "none", // navegador envia cookies tanto para req cross-site / same-site
      secure: true,
      maxAge: 2 * 60 * 1000 // tempo de validade do cookie, 2 minutos
    }) 

    delete user.password // remove a  resposta com senha do local storage

    response.status(201).json({ user });
  }


}

module.exports = SessionsController;