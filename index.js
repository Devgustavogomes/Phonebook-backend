const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status - :response-time ms :body'));


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/info', (request, response) => {
    const length = persons.length
    const date = new Date();
    response.send(`<h1>Phonebook has info for ${length} people</h1>
        <h2>${date}</h2>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (!person) {
        response.status(404).end()
    }
    response.send(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.send(204).end()
})

const generateId = () => {
    const ids = [...persons.map(person => person.id)];
    let id;
    do {
        id = parseInt(Math.random() * 1000)
    } while (ids.includes(id))

    return id;
}


app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    const repeatPerson = persons.find(person => person.name === body.name)

    if (repeatPerson) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.send(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

