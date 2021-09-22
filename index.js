const express = require("express");
const app = express();
const PORT = 5432;
const router = require("./routes/grud");
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
