const jwt = require('jsonwebtoken');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RfZG9jZW50ZSI6MSwicm9sZSI6ImRvY2VudGUiLCJpYXQiOjE3MzAyNTA5MDYsImV4cCI6MTczMDI1NDUwNn0.W5OTpTEzqPj6Q77pzqIjutOrNf-tKjjn5x3vjnGYEnI';
const decoded = jwt.decode(token);
console.log(decoded);

// no le den importancia solo para verificar si el token tiene los datos correctos