import { connection } from "../databases/postgres.js";

async function getCustomers(req, res) {
  const cpf = req.query;

  try {
    const { rows: allCustomers } = await connection.query(
      `SELECT *
      FROM customers
      WHERE customers.cpf
      LIKE $1)
      `,
      [`%${cpf}%`]
    );

    res.status(200).send(allCustomers);

  } catch (error) {
    console.error(error);
    res.status(500).send("Bad Request");
  }
}

export { getCustomers };
