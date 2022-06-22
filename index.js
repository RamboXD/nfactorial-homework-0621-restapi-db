import express, { request } from "express";
import bodyParser from "body-parser";
import { connect, getDB } from "./db.js";
import { ObjectId } from "mongodb";
// import "dotenv/config";

const app = express();
const port = process.env.port || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connect();
// ----------------------------------------------------------------------------------------
//BRONZE GET+POST
app.get("/todolist", (req, res) => {
  getDB()
    .collection("todolist")
    .find({})
    .toArray((err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ err: err });
        return;
      }
      res.status(200).json(result);
    });
});

app.post("/todolist", (req, res) => {
  const newProduct = req.body;

  getDB().collection("todolist").insertOne(newProduct);

  res.status(200).send();
});
// ----------------------------------------------------------------------------------------
//SILVER  FILTER + DELETE
app.get("/todolist/find", (req, res) => {
  const query = req.body;
  getDB()
    .collection("todolist")
    .find(query)
    .toArray((err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ err: err });
        return;
      }
      res.status(200).json(result);
    });
});

app.delete(`/todolist/:id`, (req, res) => {
  const { id } = req.params;
  getDB()
    .collection("todolist")
    .deleteOne({
      _id: new ObjectId(id),
    });

  res.status(200).send();
});
// ----------------------------------------------------------------------------------------
// GOLD   PUT + SORT
app.put("/todolist/:id", async (req, res) => {
  const { name, amount, priority } = req.body;
  const { id } = req.params;
  getDB()
    .collection("todolist")
    .updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name,
          amount,
          priority,
        },
      }
    );
  res.status(200).send();
});

app.get("/todolist/sort", (req, res) => {
  getDB()
    .collection("todolist")
    .find({})
    .sort("priority")
    .toArray((err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ err: err });
        return;
      }
      res.status(200).json(result);
    });
});
// ----------------------------------------------------------------------------------------

app.listen(port, () => {
  console.log("Server started!");
});
