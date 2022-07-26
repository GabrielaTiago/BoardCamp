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

    const { rows: allCustomers } = await connection.query(
      `SELECT * FROM customers ${whereClause}`,
      params
    );

    res.status(200).send(allCustomers);
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Bad Request");
  }
}

async function getCustomerByID(req, res) {}

async function createCustomer(req, res) {}

async function updateCustomers(req, res) {}

export { getCustomers, getCustomerByID, createCustomer, updateCustomers };
