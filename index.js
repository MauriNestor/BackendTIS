const app = require('./src/app');
console.log(app); // Esto debería mostrar el objeto 'app' de Express

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
