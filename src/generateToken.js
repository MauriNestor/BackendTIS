const jwt = require('jsonwebtoken');

const payload = {
  id: 1,
  role: 'docente', 
};

const token = jwt.sign(payload, 'tu_clave_secreta', { expiresIn: '1h' });

console.log('Token JWT simulado:', token);
