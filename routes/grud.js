const router = require("express").Router();
const pool = require("../db");
const { body, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
require("dotenv").config();
const validator = [
  body("first_name").notEmpty().isLength({ min: 3, max: 20 }),
  body("last_name").notEmpty().isLength({ min: 3, max: 20 }),
  body("age").notEmpty().isLength({ min: 1, max: 20 }),
];

// Users
router.use(require("express").json());
//get ALL Users
router.get("/users", (req, res) => {
  pool
    .query("SELECT * FROM users;")
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

//Get User by ID
router.get("/users/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query(
      //   `SELECT id,first_name,last_name, orders.user_id FROM users
      //  left JOIN orders ON orders.user_id=users.id;
      //  WHERE orders.user_id=$1;`,
      //   [id]
      "SELECT * FROM users WHERE id=$1 ;",
      [id]
    )
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(404));
});

// Create User
router.post(
  "/users",
  validator,

  async (req, res) => {
    const { first_name, last_name, age } = req.body;
    //   body("first_name", "last_name", "age").notEmpty();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send(errors.array());
    }
    await pool
      .query(
        "INSERT INTO users(first_name, last_name, age) values($1,$2,$3) RETURNING *;",
        [first_name, last_name, age]
      )
      .then((data) => res.status(201).json(data.rows))
      .catch((e) => res.sendStatus(404));
  }
);

// Update  User
router.put("/users/:id", (req, res) => {
  const { id } = req.params;

  const { first_name, last_name, age } = req.body;
  pool
    .query(
      "UPDATE users SET first_name= $1, last_name= $2, age= $3 WHERE id = $4 RETURNING *;",
      [first_name, last_name, age, id]
    )
    .then((data) => res.status(201).json(data.rows))
    .catch((e) => res.sendStatus(404));
});

// Delete User
// router.delete("/users/:id", (req, res) => {
//   const { id } = req.params;

//   pool
//     .query("UPDATE users SET name=$1 WHERE id=$2 RETURNING *;", [name, id])
//     .then((data) => res.status(201).json(data))
//     .catch((e) => res.sendStatus(404));
// });

// get Orders
router.get("/orders", (req, res) => {
  pool
    .query("SELECT * FROM orders;")
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

// Create Orders
router.post("/orders", validator, (req, res) => {
  const errors = validationResult(req);
  const { price, date, user_id } = req.body;
  pool
    .query(
      "INSERT INTO orders(price,date, user_id) values($1,$2,$3) RETURNING *;",
      [price, date, user_id]
    )
    .then((data) => res.status(201).json(data.rows))
    .catch((e) => res.sendStatus(404));
});
//Update orders
router.put("/orders/:id", (req, res) => {
  const { id } = req.params;

  const { price, date, user_id } = req.body;
  pool
    .query(
      "UPDATE users SET price= $1, date= $2, user_id= $3 WHERE id = $4 RETURNING *;",
      [first_name, last_name, age, id]
    )
    .then((data) => res.status(201).json(data.rows))
    .catch((e) => res.sendStatus(404));
});

//Get User by ID
router.get("/users/:id/orders", (req, res) => {
  const { id } = req.params;

  pool
    .query(
      `SELECT *  FROM users JOIN orders ON users.id = orders.user_id WHERE users.id=${id} `
      //  WHERE orders.user_id=${user_id}=users.id=${id}
      //   "SELECT * FROM users WHERE id=$1 ;",
      //   [id]
    )
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(404));
});

//Get User by ID
router.get("/users/:id/orders", (req, res) => {
  const { id } = req.params;

  pool
    .query(
      `SELECT *  FROM users JOIN orders ON users.id = orders.user_id WHERE users.id=${id} `
      //  WHERE orders.user_id=${user_id}=users.id=${id}
      //   "SELECT * FROM users WHERE id=$1 ;",
      //   [id]
    )
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(404));
});

module.exports = router;
