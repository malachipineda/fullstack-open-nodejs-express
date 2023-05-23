const express = require('express')
const app = express()
const morgan = require('morgan')
const timeStamp = new Date(Date.now()).toString()

// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:  ', request.path)
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
//   }

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

morgan.token('body', (request) => JSON.stringify(request.body))

app.use(express.json())
// app.use(requestLogger)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
  ]
  
  //Create

  const generateId = () => {
    const id = Math.floor(Math.random() * 2147483647)
    return id
  }

  app.post('/api/persons', (request, response) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number || false,
        id: generateId(),
    }

    switch (true) {
        case !body.name ||
             !body.number:
                response.status(400).json({
                    error: 'missing name or number'
                })
            break;
        case !!persons.find(({ name }) => body.name === name) ||
             !!persons.find(({number}) => body.number === number):
            response.status(400).json({
                error: 'name or number already exist'
            })
            break;
        default:
            persons = persons.concat(person)
            response.json(person)
    }
  })

  //Read
  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
  })

  app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people 
    <br/>
    <br/>
    ${timeStamp}`)
  })

  //Delete
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
  })

  app.use(unknownEndpoint)

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
