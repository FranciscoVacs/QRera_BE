import { TicketType } from "../../entities/ticketType.entity.js";
import { BaseModel } from "./baseModel.js";
import type { EntityManager } from "@mikro-orm/mysql";

export class TicketTypeModel extends BaseModel<TicketType> {
  constructor(em: EntityManager) {
    super(em, TicketType);
  }

}