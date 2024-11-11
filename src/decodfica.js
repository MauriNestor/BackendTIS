const jwt = require('jsonwebtoken');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RpZ29TaXMiOjIwMjEwMzgxOSwicm9sZSI6ImVzdHVkaWFudGUiLCJpYXQiOjE3MzEyOTQ4NzUsImV4cCI6MTczMTI5ODQ3NX0.AHW4oNbYHr5SyPR5BGX6jGJl8aPfzbTHxWkbPOkRzaQ';
const decoded = jwt.decode(token);
console.log(decoded);

// no le den importancia solo para verificar si el token tiene los datos correctos