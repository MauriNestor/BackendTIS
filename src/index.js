const express = require('express');
const dotenv = require('dotenv');
const healthyRoutes = require('./routes/healthy');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 

app.use('/', healthyRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });