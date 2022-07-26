import { connection } from "../databases/postgres.js";

async function getCustomers(req, res) {
  const { cpf } = req.query;

  try {
    const params = [];
    let whereClause = "";

    if (cpf) {
      params.push(`%${cpf}%`);
      whereClause += `WHERE cpf ILIKE $${params.length}`;
    }

    const { rows: allCustomers, rowCount } = await connection.query(
      `SELECT * FROM customers ${whereClause}`,
      params
    );

    if (rowCount === 0) return res.sendStatus(404);

    res.status(200).send(allCustomers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Bad Request");
  }
}

async function getCustomerByID(req, res) {
  const { id } = req.params;

  try {
    const { rows: customer, rowCount } = await connection.query(
      `SELECT * FROM customers WHERE id= $1`,
      [id]
    );

    if (rowCount === 0) return res.sendStatus(404);

    res.status(200).send(customer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Bad Request");
  }
}

async function newCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    const { rowCount } = await connection.query(
      `SELECT * FROM customers WHERE cpf = $1`,
      [cpf]
    );

    if (rowCount === 1) return res.sendStatus(409);

    await connection.query(
      `INSERT INTO customers (name, phone, cpf, birthday)
        VALUES ($1, $2, $3, $4)`,
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500).send("Bad Request");
  }
}

async function updateCustomers(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;

  try {
    const { rowCount } = await connection.query(
      `SELECT * FROM customers WHERE cpf = $1 AND id <> $2`,
      [cpf, id]
    );

    if (rowCount === 1) return res.sendStatus(409);

    await connection.query(
      `UPDATE customers 
      SET (name, phone, cpf, birthday) = ($1, $2, $3, $4)
      WHERE id = $5`,
      [name, phone, cpf, birthday, id]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Bad Request");
  }
}

export { getCustomers, getCustomerByID, newCustomer, updateCustomers };
