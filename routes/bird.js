const express = require('express');
const router = express.Router();
const models = require('../models');
const Post = models.Post;
const Bird = models.Bird;
module.exports = router;

// //  Birds
router.get('/', function (req, res, next) {
  // res.send("this is the /bird GET route");

  Bird.findAll({})
  .then(function(birds)
  	{res.render('birdlist', {birds: birds});
  })
  .catch(next);
});

router.get('/add', (req,res,next) => {
	res.render('addbird');
});

// router.get('/:name', (req,res,next) => {
// 	const findBird = Bird.findByName(req.params.name);

// 	const findPosts = Post.findAll({
// 		where: {
// 			authorId = req.params.name
// 		}
// 	});

// 	Promise.all([findBird, findPosts])
// 	.spread((bird, birdPosts) => {
// 		res.render('userpages', {
// 			posts: birdPosts,
// 			bird: bird
// 		})
// 	})
// 	.catch(next);
// });

router.post('/', (req,res,next) => {
	Bird.findOrCreate({
		where: {
			name: req.body.name,
			breed: req.body.breed,
			favoriteColor: req.body.favoriteColor,
			favoriteNumber: req.body.favoriteNumber
		}
	})
	.spread(function(bird, createdBool){
		res.redirect(bird.route);
	})
	.catch(next);
});

router.get('/:name', function (req, res, next) {

    Bird.findOne({
            where: {
                name: req.params.name
            }
        })
        .then(function (bird) {
            if (bird === null) {
                throw generateError('No bird found with this name', 404);
            } else {
                res.render('birdpage', {
                    bird: bird
                });

            }
        })
        .catch(next);

});

router.post('/:name', function (req, res, next) {
	console.log("req.body", req.body);
    console.log("req.params.name", req.params.name)
	Bird.update(req.body, {
		where: {
			name: req.params.name
		},
		returning: true
	})
	.spread(function(updatedRowCount, updatedBirdInfo){
		// console.log("updatedRowCount:", updatedRowCount);
		console.log("updatedBirdInfo[0]:", updatedBirdInfo[0]);
		res.redirect(updatedBirdInfo[0].route);
	})
	.catch(next);
});

router.get('/:name/edit', function (req, res, next) {
    Bird.findOne({
            where: {
                name: req.params.name
            },
        })
        .then(function (bird) {
            if (bird === null) {
                //to show you sendStatus in contrast to using the error handling middleware above
                res.sendStatus(404);
            } else {
                res.render('editpage', {
                    bird: bird
                });
            }
        })
        .catch(next);

});

// // Deletes the bird specified by ‘:name’ from the database. Should also delete all posts created by that bird. Once deleted, redirects to the ‘/birds’ page.
router.get('/:name/delete', function (req, res, next) {
	Bird.destroy({
		where: {
			name: req.params.name
		}
	})
	.then( () => res.redirect('/bird'))
	.catch(next);
});


// function generateError (message, status) {
//     let err = new Error(message);
//     err.status = status;
//     return err;
// }

// Post Routes
// GET /birds/:name/addPost

// Renders a page with a form to create a new ‘post’ for the bird specified by :name. This should have fields for ‘Body’, ‘Image URL’, and a button to ‘C
router.get('/:name/addPost', (req,res,next) => {
	res.render('addpost');
});
