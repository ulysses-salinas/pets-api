const express = require('express');
const bodyParser = require('body-parser');
const sails = require('sails');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static())
var owners = [
  {
    id: 1,
    name: 'Emma',
    pets: [
      {
        id: 1,
        name: 'Luna',
        type: 'Dog',
      },
      {
        id: 2,
        name: 'Bruce',
        type: 'Dog',
      },
    ],
  },
  {
    id: 2,
    name: 'Sophia',
    pets: [
      {
        id: 1,
        name: 'Tedward',
        type: 'Dog',
      },
    ],
  },
  {
    id: 3,
    name: 'Camila',
    pets: [
      {
        id: 1,
        name: 'Samson',
        type: 'Cat',
      },
      {
        id: 2,
        name: 'Delilah',
        type: 'Cat',
      },
    ],
  },
];

var owner = {};
for (var i = 0; i < owners.length; i++) {
  owner[owners[i].id] = owners[i];
}
app.param('id', function (request, response, next, id) {
  request.owner = request.owner || {};
  request.owner.id = owner[id];

  console.log(request.owner.id);

  if (!request.owner.id) {
    return response.status(404).send('There is nothing here');
  }
  next();
});

// GET /api/owners
app.get('/api/owners', function (request, response, next) {
  console.log('The Owners has been loaded!');
  response.send(owners);
});
// GET /api/owners/:id
app.get('/api/owners/:id', function (request, response, next) {
  response.send(request.owner.id);
});
// POST /api/owners
app.post('/api/owners', function (request, response, next) {
  const newOwner = {
    id: owners.length + 1,
    name: request.body.name,
    pets: [],
  };
  owners.push(newOwner);
  console.log('A new owner has been added!');
  response.send(owners);
});
// PUT /api/owners/:id
app.put('/api/owners/:id', function (request, response, next) {
  request.owner.id.name = request.body.name;
  console.log('Owner information has been updated!');
  response.send(request.owner.id);
});
// DELETE /api/owners/:id
app.delete('/api/owners/:id', function (request, response, next) {
  const delOwner = owners.indexOf(request.owner.id);
  console.log('An owner has been deleted!');
  owners.splice(delOwner, 1);
  response.send(owners);
});
// GET /api/owners/:id/pets
app.get('/api/owners/:id/pets', function (request, response, next) {
  const ownerId = owners.find(function (owner) {
    return owner.id === parseInt(request.params.id);
  });
  if (!ownerId) {
    return response.status(404).send('The requested page was not found!');
  }
  console.log("An owner's pet was loaded!");
  response.send(ownerId.pets);
});
// GET /api/owners/:id/pets/:petId
app.get('/api/owners/:id/pets/:petId', function (request, response, next) {
  const ownerId = owners.find(function (owner) {
    return owner.id === parseInt(request.params.id);
  });
  if (!ownerId) {
    return response.status(404).send('The requesed page was not found!');
  }
  const petId = ownerId.pets.find(function (pet) {
    return pet.id === parseInt(request.params.petId);
  });
  console.log('A pet ID was loaed!');
  response.send(petId);
});

// POST /api/owners/:id/pets
app.post('/api/owners/:id/pets', function (request, response, next) {
  const ownerId = owners.find(function (owner) {
    return owner.id === parseInt(request.params.id);
  });
  if (!ownerId) {
    return response.status(404).send('The requested page was not found!');
  }
  const newPet = {
    id: ownerId.pets.length + 1,
    name: request.body.name,
    type: request.body.type,
  };
  ownerId.pets.push(newPet);
  console.log('A pet has been added!');
  response.send(ownerId.pets);
});

// PUT /api/owners/:id/pets/:petId
app.put('/api/owners/:id/pets/:petId', function (request, response, next) {
  const ownerId = owners.find(function (owner) {
    return owner.id === parseInt(request.params.id);
  });
  if (!ownerId) {
    return response.status(404).send('The requested page was not found!');
  }
  const petId = ownerId.pets.find(function (pet) {
    return pet.id === parseInt(request.params.petId);
  });
  if (request.body.name && !request.body.type) {
    petId.name = request.body.name;
  } else if (!request.body.name && request.body.type) {
    return (petId.type = request.body.type);
  } else if (request.body.name && request.body.type) {
    petId.name = request.body.name;
    petId.type = request.body.type;
  }
  console.log('Pet information has been updated!');
  response.send(petId);
});
// DELETE /api/owners/:id/pets/:petId
app.delete('/api/owners/:id/pets/:petId', function (request, response, next) {
  const ownerId = owners.find(function (owner) {
    return owner.id === parseInt(request.params.id);
  });
  if (!ownerId) {
    return response.status(404).send('The requested page was not found!');
  }
  const petId = ownerId.pets.find(function (pet) {
    return pet.id === parseInt(request.params.petId);
  });
  console.log('A pet has been deleted!');
  ownerId.pets.splice(ownerId.pets.indexOf(petId), 1);
  response.send(ownerId.pets);
});

app.listen(3000, function () {
  console.log('The server is now listening!');
});
