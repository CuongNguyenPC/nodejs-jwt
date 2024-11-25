const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './uploads');
	},
	filename: function(req, file, cb){
		cb(null, new Date().toISOString + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	//reject a file
	if (file.mimetype === 'image/jpeg' || file.minetype === 'image/png'){
		cb(new Error('message'), true);
	}else {
		cb(null, false);
	}
};



const upload = multer({storage: storage, limits: {
	filzeSize: 1024 *1024 * 5
},
	fileFilter: fileFilter});

const Product = require('../models/products');




/*check again routes architecture
client sent to server and server catch request and response
routes getmethod to the model ./products*/
router.get("/", (req, res, next) =>{
	Product.find()
		.select("name price_id productImage")
		.exec()
		.then(docs => {
			const response = {
				count: docs.length,
				product: docs.map( doc => {
					return {
						name: doc.name,
						price: doc.price,
						productImage: doc.productImage,
						_id: doc._id,
						request: {
							type: 'GET',
							URL: 'http://locahost:3000/products/' + doc._id
						}
					}
				})
			};
		//if (docs.length >= 0){
			res.status(200).json(response);
		//} else {
		//	res.status(404).json({
		//	message: 'No entries found'
		//  });
		//}
	}).catch(err => {
		console.log(err);
		res.status(500).json({
			error : err
		});
	});
	
});

router.post("/", upload.single('productImage'), (req, res, next) =>{
	console.log(req.file);
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
	});
	product
		.save()
		.then(result => {
			console.log(result);
			res.status(201).json({
				message: 'Create product successfully',
				createdProduct: {
					name: result.name,
					price: result.price,
					_id: result.name,
					price: result.price,
					_id: result._id,
					request: {
						type: 'GET',
						URL: 'http://locahost:3000/products/' + result._id
					}
				}
				
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error:err
			});
		});
	})



router.get("/:productId", (req, res, next) =>{
	const id = req.params.productId;
	Product.findById(id)
		.select('name price _id productImage')
		.exec()
		.then(doc => {
			console.log("From database", doc);
			if (doc) {
			res.status(200).json({
				product: doc,
				request: {
					type: 'GET',
					URL: 'http://locahost:3000/products/'
				}
			});
			} else {
				res
					.status(404)
					.json({ message: "No valid entry found for provided ID"});
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({error: err});
});
});

router.patch("/:productId", (req, res, next) => {
	const id = req.params.productId;
	const updateOps = {};
	for (const Ops of req.body){
		updateOps[Ops.propName] = Ops.value;
	}
	Product.updateOne({ _id: id}, { $set: updateOps})
		.exec()
		.then(result => {

			res.status(200).json({
				message: 'Product updated',
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products' + id
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});


router.delete("/:productId", (req, res, next) => {
	const id = req.params.productId;
	Product.deleteOne({ _id: id})
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Product deleted',
			request: {
				type: 'POST',
				url: 'http://localhost:3000/products',
				body: { name: 'String', price: 'Number'}
			}
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});
	

module.exports = router;