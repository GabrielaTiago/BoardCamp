import { connection } from "../databases/postgres.js";


async function getGames(req, res) {
  let name = req.query.name;

  try {
    if (name) {
      const { rows: nameGames } = await connection.query(
        `SELECT games.*, categories.name AS categoryName
        FROM games
        JOIN categories
        ON games."categoryId" = categories.id
        WHERE LOWER(games.name) LIKE LOWER ($1))
        `,
        [`%${name}%`]
      );
      res.status(200).send(nameGames);
    } else {
      const { rows: allGames } = await connection.query(
        `SELECT games.*, categories.name AS categoryName
        FROM games
        JOIN categories
        ON games."categoryId" = categories.id
        `
      );
      res.status(200).send(allGames);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Bad Request");
  }
}

async function newGame(req, res) {
  const { name, image, categoryId, stockTotal, pricePerDay } = req.body;

  try {
    await connection.query(
      `INSERT INTO games (name, image, "categoryId", "stockTotal", "pricePerDay")
        VALUES ($1, $2, $3, $4, $5)`,
      [name, image, categoryId, stockTotal, pricePerDay]
    );
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500).send("Bad request");
  }
}

export { getGames, newGame };
