const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(cors())

app.use(express.json());

let phonebookEntries = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];



// Morgan logging
morgan.token('post', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'));

app.get('/api/persons', (req, res) => {
  res.json(phonebookEntries);
});

app.get('/info', (req, res) => {
    
    const currentTime = new Date();
    const numberOfEntries = phonebookEntries.length;
    res.send(
      `<p>Phonebook has info for ${numberOfEntries} people</p>
      <p>${currentTime}</p>`
    );
  });

  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
  const person = phonebookEntries.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send('Person not found');
  }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    phonebookEntries = phonebookEntries.filter(person => person.id !== id);
  
    res.status(204).end();
  });

  app.post('/api/persons', (req, res) => {
    const newEntry = req.body;

    // Check if name or number is missing
    if (!newEntry.name || !newEntry.number) {
      return res.status(400).json({ error: 'name or number is missing' });
  }

  // Check if name already exists
  if (phonebookEntries.find(person => person.name === newEntry.name)) {
      return res.status(400).json({ error: 'name must be unique' });
  }
  
    // Generate a new ID with a large range to avoid collisions
    newEntry.id = Math.floor(Math.random() * 1000000);
  
    // Add the new entry to the array
    phonebookEntries.push(newEntry);
  
    // Return the new entry ff
    res.json(newEntry);
  });

  const PORT = process.env.PORT || 3001;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});