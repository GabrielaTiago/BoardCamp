import { connection } from "../databases/postgres.js";
import { newCategorySchema } from "../schemas/newCategorySchema.js";

async function newCategoryMiddleware(req, res, next) {
  const { name } = req.body;
  const validation = newCategorySchema.validate(req.body, { abortEarly: true });

  if (validation.error) {
    return res.status(400).send(validation.error.details);
  }

  try {
    const validCategory = await connection.query(
      'SELECT * FROM categories WHERE name = $1',
      [name]
    );

    if (validCategory.rowCount === 1) return res.sendStatus(409);

  } catch (error) {
    console.error(error);
    res.status(500).send("Bad Request");
  }

  next();
}

export { newCategoryMiddleware };
