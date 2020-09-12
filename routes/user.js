const express = require('express');

const User = require('../model/user');
const multer = require('multer');


const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
	destination : (req, file, cb) => {
		const isValid = MIME_TYPE_MAP[file.mimetype];
		let error = new Error("Invalid mime type");
    	if (isValid) {
     	 error = null;
   		 }
    	cb(error, "images");
	},
	filename: (req, file, cb) => {
	 const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
	}
})


//to get all users
router.get('/users', (req, res) => {
	User.find().then(users => {
		res.json({
      message: "User fetched successfully!",
      users: users
    })
	})
	.catch(err => {
		res.json(err)
	})
});

// to create new user
router.post('/create', multer({ storage: storage }).single("image"), (req, res) => {
	 const url = req.protocol + "://" + req.get("host");
	const user = new User({
		firstname : req.body.firstname,
		lastname : req.body.lastname,
		email : req.body.email,
		phonenumber : req.body.phonenumber,
		image : url + "/images/" + req.file.filename
	})
	console.log(user)
	user.save().then(userCreated => {
		res.json({
        message: "User added successfully",
        user: {
          ...userCreated,
          id: userCreated._id
        }
      })
	});
});


// to delete
router.delete('/user/:id', (req, res) => {
	User.deleteOne({_id: req.params.id })
	.then(result => {
		console.log("Deleted")
	})
	.catch(err => {
		console.log("Not deleted")
	})
})


// to get single user
router.get('/user/:id', (req, res) => {
	User.findById(req.params.id)
	.then(user => {
		if(user) {
			res.json(user);
		} else {
			res.json({message: "User Not found"})
		}
	})
})

//to update user

router.put('/user/:id', multer({ storage: storage }).single("image"), (req, res) => {
	let image = req.body.image;
	if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      image = url + "/images/" + req.file.filename
    }

	const user = new User({
		_id: req.body.id,
		firstname : req.body.firstname,
		lastname : req.body.lastname,
		email : req.body.email,
		phonenumber : req.body.phonenumber,
		image : image
	});
	console.log(user)
	User.updateOne({_id: req.params.id}, user)
	.then(result => {
		res.json({message: "update Successfully"});
	})
	.catch(err => {
		res.json({message: "Something worng"})
	})
});


module.exports = router;