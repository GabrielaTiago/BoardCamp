import joi from "joi";

const newGameSchema = joi.object({
  name: joi.string().required(),
  image: joi.string().required(),
  categoryId: joi.number().integer().required(),
  stockTotal: joi.number().integer().greater(0).required(),
  pricePerDay: joi.number().greater(0).required(),
});

export { newGameSchema };
