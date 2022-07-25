import { connection } from "../databases/postgres.js";

async function getCategories(req, res) {
  try {
    const { rows: allCategories } = await connection.query(
      'SELECT * FROM categories'
    );

    if (allCategories) res.status(200).send(allCategories);
  } catch (error) {
    console.error(error);
    res.status(500).send("Bad request");
  }
}

async function newCategory(req, res) {
  const { name } = req.body;

  try {
    await connection.query('INSERT INTO categories (name) VALUES ($1)', [name]);
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500).send("Bad request");
  }
}
export { getCategories, newCategory };
