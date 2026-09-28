const express = require("express");
require("dotenv").config();
const db = require("./db");

const app = express();
app.use(express.json());

const bugsRoutes = require("./routes/bugs");
app.use(bugsRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
