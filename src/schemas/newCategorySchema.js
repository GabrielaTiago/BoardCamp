import joi from "joi";

const newCategorySchema = joi.object({
  name: joi.string().required()
});

export { newCategorySchema };
