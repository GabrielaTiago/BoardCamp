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
        WHERE LOWER(games.name) LIKE LOWER($1 || '%${name}%')
        `,
        [name]
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

export { getGames };
