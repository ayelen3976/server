const express = require("express");
const router = express.Router();
const db = require("../models");
const auth = require("../middleware/auth");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// All Order Data
router.get("/all", (req, res) => {
	db.Orders.findAll({
		include: [
			{
				model: db.OrderItem,
				include: [db.Product],
			},
			db.Users,
		],
		order: [["Orders_id", "DESC"]],
	}).then((order) => res.send(order));
});

// Specific Order
router.get("/all/:id", auth, (req, res) => {
	db.Orders.findAll({
		include: [
			{
				model: db.OrderItem,
				include: [db.Product],
			},
			db.Users,
		],
		order: [["Orders_id", "DESC"]],
		where: {
			Users_id: req.params.id,
		},
	}).then((order) => res.send(order));
});

// // Get Single Order
// router.get("/find/:id", (req, res) => {
//     db.Orders.findAll({
//         where: {
//             Orders_id: req.params.id
//         }
//     }).then(oneorder => res.send(oneorder))
// })

// Insert Order
router.post('/new', (req, res) => {
		db.Orders.create({
			Status: req.body.Status,
			Discount: req.body.Discount,
			Address: req.body.Address,
			Delivery_date: req.body.Delivery_date,
			ClientName: req.body.ClientName,
			Email: req.body.Email,
			Phone: req.body.Phone,
			Users_id: req.body.Users_id
		}).then(submittedOrder => res.send(submittedOrder))
})


// Delete Product
// router.delete('/delete/:id', (req, res) => {
//     db.Category.destroy({
//         where: {
//             Category_id: req.params.id
//         }
//     }).then(() => res.send("success"))
// })

// Update Status
router.put("/status", (req, res) => {
	db.Orders.update(
		{
			Status: req.body.Status,
		},
		{
			where: {
				Orders_id: req.body.Orders_id,
			},
		}
	).then(() => res.send("successfully Updated"));
});

router.post('/payment', async (req, res) => {
	const body = {
		amount: req.body.amount,
		currency: 'ars',
	}

	try {
		const paymentIntent = await stripe.paymentIntents.create(body);
	
		res.status(200).send(paymentIntent.client_secret);
	} catch (error) {
		res.status(500).json({ statusCode: 500, message: error.message })
	}


	// var payload = await stripe.paymentMethods.create({
	// 	type: req.body.type,
	// 	card: JSON.parse(req.body.card),
	// 	billing_details: req.body.billingDetails
	// });
	// res.send(payload.data)
	// stripe.charges.create(body, (stripeErr, stripeRes) => {
	// 	if(stripeErr) {
	// 		res.status(500).send({error: stripeErr})
	// 	} else {
	// 		res.status(200).send({ success: stripeRes })
	// 	}
	// })
})

module.exports = router;
