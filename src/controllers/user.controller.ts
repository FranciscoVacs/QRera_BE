import type { User } from "../entities/user.entity.js";
import type { IUserModel } from "../interfaces/user.interface.js";
import { BaseController } from "./baseController.js";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import type { RequiredEntityData } from "@mikro-orm/core";
import { generateToken } from "../middlewares/auth.js";

export class UserController extends BaseController<User> {
  constructor(protected model: IUserModel<User>) {
    super(model);
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {email, user_name, user_surname, password, birth_date} = req.body;
      const userExists = await this.model.existsByEmail(email);

      if (userExists !== null) {
        return res.status(400).json({ message: "The user already exists" });
      }

      const cryptedPass = await bcrypt.hash(password, 10);


      const newUser = await this.model.create({
        email,
        user_name,
        user_surname,
        password: cryptedPass,
        birth_date,
      } as RequiredEntityData<User>);

      const token = generateToken(email);//generate token para usuario recien creado

      return res.status(201).header('token',token).send({ message: "User created", data: newUser });//mando el token junto con la data del usuario recien creado

    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {email, password} = req.body;
      const userExists = await this.model.existsByEmail(email);

      if (!userExists) {
        return res.status(400).json({ message: "The user does not exist" });
      }

      const validPass = await bcrypt.compare(password, userExists.password)

      if (!validPass) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const token = generateToken(email);

      return res.status(200).header('token', token).send({ message: "User logged in"});
      
    } catch (error) {
      next(error);
    }
  };

}

