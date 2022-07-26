import { newCustomerSchema } from "../schemas/newCustomerSchema.js";

async function newCustomerMiddleware(req, res, next) {

  const validation = newCustomerSchema.validate(req.body, { abortEarly: true });

  if (validation.error) {
    return res.status(400).send(validation.error.details);
  }

  next();
}

export { newCustomerMiddleware };
