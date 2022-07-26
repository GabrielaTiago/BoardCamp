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

    const { rows: allCustomers, rowCount} = await connection.query(
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

  const { rows: customers, rowCount } = await connection.query(
    `SELECT * FROM customers WHERE id= $1`,
    [id]
  );

  if (rowCount === 0) return res.sendStatus(404);


  res.status(200).send(customers);
}

async function newCustomer(req, res) {

}

async function updateCustomers(req, res) {}

export { getCustomers, getCustomerByID, newCustomer, updateCustomers };
