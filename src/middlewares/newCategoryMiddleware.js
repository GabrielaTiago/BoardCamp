import { newCategorySchema } from "../schemas/newCategorySchema.js";

async function newCategoryMiddleware(req, res, next) {
  const { name } = req.body;
  const validation = newCategorySchema.validate(req.body, { abortEarly: true });

  if (validation.error) {
    return res.status(400).send(validation.error.details);
  }

  next();
}

export { newCategoryMiddleware };
