import express from "express";
import "reflect-metadata";
import { RequestContext } from "@mikro-orm/core";
import { corsMiddleware } from "./middlewares/cors.js";
import { orm, syncSchema } from "./shared/db/orm.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { createEventRouter } from "./routes/event.route.js";
import { createLocationRouter } from "./routes/location.route.js";
import { createCityRouter } from "./routes/city.route.js";
import { createTicketTypeRouter } from "./routes/ticketType.route.js";
import { createTicketRouter } from "./routes/ticket.route.js";
import { createUserRouter } from "./routes/user.route.js";
import { createPurchaseRouter } from "./routes/purchase.route.js";
import type { IModel } from "./interfaces/model.interface.js";
import type { City } from "./entities/city.entity.js";
import type{ Ticket } from "./entities/ticket.entity.js";
import type { Event } from "./entities/event.entity.js";
import type { Location } from "./entities/location.entity.js";
import type { TicketType } from "./entities/ticketType.entity.js";
import type { User } from "./entities/user.entity.js";
import type { Purchase } from "./entities/purchase.entity.js";
import type { IUserModel } from "./interfaces/user.interface.js";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from 'node:url';
import type { Dj } from "./entities/dj.entity.js";
import { createDjRouter } from "./routes/dj.route.js";
import type { IPurchaseModel } from "./interfaces/purchase.interface.js";


export const createApp = async (
  eventModel: IModel<Event>,
  locationModel: IModel<Location>,
  cityModel: IModel<City>,
  ticketTypeModel: IModel<TicketType>,
  ticketModel: IModel<Ticket>,
  userModel: IUserModel<User>, // 👈 Inject the user model, para los nuevos metodos
  purchaseModel: IPurchaseModel<Purchase>, // 👈 Inject the user model, para los nuevos metodos
  djModel: IModel<Dj>
) => {
  
  const envFound = dotenv.config();
  if (envFound.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const app = express();
  app.use(express.json());
  app.use(corsMiddleware());
  app.disable("x-powered-by");
  app.use('/public/uploads', express.static(path.join(__dirname, '../public/uploads')));


  app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
  });


  app.use("/api/event", createEventRouter({ eventModel }));
  app.use("/api/location", createLocationRouter({ locationModel }));
  app.use("/api/city", createCityRouter({ cityModel }));
  app.use("/api/event/:eventId/ticketType", createTicketTypeRouter({ ticketTypeModel }));
  app.use("/api/ticket", createTicketRouter({ ticketModel }));
  app.use("/api/user", createUserRouter({ userModel }));
  app.use("/api/purchase", createPurchaseRouter({ purchaseModel }));
  app.use("/api/dj", createDjRouter({ djModel }));

  app.use(errorHandler);

  await syncSchema();

  const PORT = process.env.PORT ?? 3000;

  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
  });
};
