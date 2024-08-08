import { repository } from "../shared/repository.js";
import { Event } from "./event.entity.js";
import { db } from "../shared/db/conn.js";

const eventsArray = [
  new Event(
    "Wos en el luna park",
    "Es Wos!!! en el luna park!!!!",
    5000,
    "santa cruz 1540",
    "2023-05-19",
    18,
    "id-de-prueba-test-lorem_ipsum"
  ),
];

const events = db.collection<Event>('events')

export class EventRepository implements repository<Event> {
  public async findAll(): Promise<Event[] | undefined>{
    return await events.find().toArray()
  }

  public async findOne(item: { id: string }): Promise<Event | undefined> {
    return await eventsArray.find((event) => event.id == item.id);
  }

  public async add(item: Event): Promise<Event | undefined >{
    eventsArray.push(item);
    return await item;
  }

  public async update(item: Event): Promise<Event | undefined >{
    const eventIdx = eventsArray.findIndex((event) => event.id == item.id);
    if (eventIdx !== -1) {
      eventsArray[eventIdx] = { ...eventsArray[eventIdx], ...item }
    }
    return await eventsArray[eventIdx];
  }

  public async delete(item: { id: string }): Promise<Event | undefined> {
    const eventIdx = eventsArray.findIndex((event) => event.id === item.id)
    if (eventIdx !== -1) {
        const deletedEventsArray = eventsArray[eventIdx]
        eventsArray.splice(eventIdx, 1)
        return await deletedEventsArray
    }
  }
}
