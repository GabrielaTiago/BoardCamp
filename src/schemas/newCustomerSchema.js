import joi from "joi";

const newCustomerSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().min(10).max(11).required(),
  cpf: joi.string().min(11).max(11).required(),
  birthday: joi.date().iso().max("now").min("1900-01-01").required()
});

export { newCustomerSchema };
