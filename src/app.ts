import express, { NextFunction, Request, Response } from "express";
import { Event } from "./event.js";

const app = express();
app.use(express.json());

const events = [
  new Event(
    "Wos en el luna park",
    "Es Wos!!! en el luna park!!!!",
    5000,
    "catamarca 1540",
    "2023-05-19",
    18,
    "id-de-prueba-test-lorem_ipsum"
  ),
];

//app.use('/', (req, res) => {
//  res.send("Hola!!!");
//});

function sanitizeEventsInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    name: req.body.name,
    description: req.body.description,
    total_capacity: req.body.total_capacity,
    direction: req.body.direction,
    date_time: req.body.date_time,
    min_age: req.body.min_age,
  };
  //more checks here

Object.keys(req.body.sanitizedInput).forEach(key =>{
  if (req.body.sanitizedInput[key] === undefined){
    delete req.body.sanitizedInput[key]
  }
})

  next();
}

app.get("/api/events", (req, res) => {
  res.json({ data: events });
});

app.get("/api/events/:id", (req, res) => {
  const event = events.find((event) => event.id === req.params.id);
  if (!event) {
    return res.status(404).send({ message: "Event not found" });
  }
  res.json({ data: event });
});

app.put("/api/events/:id", sanitizeEventsInput, (req, res) => {
  const eventIdx = events.findIndex((event) => event.id == req.params.id);

  if (eventIdx === -1) {
    return res.status(404).send({ message: "Event not found" });
  }

  events[eventIdx] = { ...events[eventIdx], ...req.body.sanitizedInput };

  return res.status(200).send({
    message: "Character updated successfully",
    data: events[eventIdx],
  });
});

app.patch("/api/events/:id", sanitizeEventsInput, (req, res) => {
  const eventIdx = events.findIndex((event) => event.id == req.params.id);

  if (eventIdx === -1) {
    return res.status(404).send({ message: "Event no encontrado" });
  }

  events[eventIdx] = { ...events[eventIdx], ...req.body.sanitizedInput };

  return res.status(200).send({
    message: "Character updated successfully",
    data: events[eventIdx],
  });
});

app.delete("/api/events/:id", (req, res)=> {
  const eventIdx = events.findIndex((event) => event.id === req.params.id)
  if (eventIdx=== -1){
    res.status(404).send({message:'Event not found'})
  }
  else {
  events.splice(eventIdx, 1)
  res.status(200).send({message: 'Event deleted successfully'})
  }
})


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});

app.post("/api/events", sanitizeEventsInput, (req, res) => {
  const input = req.body.sanitizedInput;
  
  const event = new Event(
    input.name,
    input.description,
    input.total_capacity,
    input.direction,
    input.date_time,
    input.min_age
  );

  events.push(event);
  return res.status(201).send({ message: "Event creado", data: event });
});

app.use((_, res)=>{
  return res.status(404).send({message: 'Resource not found'})
})