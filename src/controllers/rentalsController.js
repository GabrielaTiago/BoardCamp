import rentalsServices from '../services/rentalsServices.js';

async function getRentals(req, res) {
	const { customerId, gameId } = req.query;
	const rentals = await rentalsServices.getRentals(customerId, gameId);
	res.status(200).send(rentals);
}

async function createRental(req, res) {
	const { customerId, gameId, daysRented } = req.body;
	await rentalsServices.createRental(customerId, gameId, daysRented);
	res.status(201).send({ message: 'Rental created successfully' });
}

async function returnRental(req, res) {
	const { id: rentalId } = req.params;
	await rentalsServices.returnRental(rentalId);
	res.status(200).send({ message: 'Rental returned successfully' });
}

async function deleteRental(req, res) {
	const { id: rentalId } = req.params;
	await rentalsServices.deleteRental(rentalId);
	res.status(200).send({ message: 'Rental deleted successfully' });
}

const rentalsController = {
	getRentals,
	createRental,
	returnRental,
	deleteRental,
};

export default rentalsController;
