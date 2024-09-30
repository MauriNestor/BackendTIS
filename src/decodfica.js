const jwt = require('jsonwebtoken');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RfZG9jZW50ZSI6NCwiaWF0IjoxNzI3NTY0MDk3LCJleHAiOjE3Mjc1Njc2OTd9.Illj1DgeKStJ8acjqgC2SZ-eE36Kk0K_Lp7gQLnPbYk';
const decoded = jwt.decode(token);
console.log(decoded);

// no le den importancia solo para verificar si el token tiene los datos correctos