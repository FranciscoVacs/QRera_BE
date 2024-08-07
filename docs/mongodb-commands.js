//
// use eventosDelAño

//insert data
db.events.insertOne({
  name: 'el duketo',
  description: 'suena temporada de regaeton',
  total_capacity: 10,
  direction: 'movistar madera',
  date_time: '2024-04-11',
  min_age: 2
})

db.events.insertOne({
  name: 'july3p',
  description: 'agarrate agarrate',
  total_capacity: 11000,
  direction: 'azerbaiyan stadium',
  date_time: '2034-01-09',
  min_age: 72
})


// query
db.events.find()
db.events.find({ name: 'july3p' })
db.events.find({ min_age: { $gt: 30 } })
db.events.find({ min_age: { $gt: 30 } }, { name: 1, description: 1 })
db.events.find({ min_age: { $gt: 30 } }, { name: 1, description: 1, _id: 0 })
db.events.find({ _id: ObjectId('66b43d83f7f97ed606228fb5') }) //change the id according to the autogenerated value

//update
db.events.updateOne({ name: 'el duketo' }, { $set: { name: 'Mauro Lombardo', description: 'ganador del 5to escalon' } })

//delete
db.events.deleteOne({ description: 'agarrate agarrate' })
