const jwt = require('jsonwebtoken');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RpZ29TaXMiOjIwMjEwMzgxOSwicm9sZSI6ImVzdHVkaWFudGUiLCJpYXQiOjE3MjkzMDUyNTIsImV4cCI6MTcyOTMwODg1Mn0.DK0hca1APtZZ-5Ri8aB2IHLMOlBEbpplZ8WMfk4B_C0';
const decoded = jwt.decode(token);
console.log(decoded);

// no le den importancia solo para verificar si el token tiene los datos correctos