var express = require('express'),
    app = express(),
    mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chat');
var User = require('../models/user');
var router = express.Router();
//var Cart = require('../models/cart');

//var Product = require('../models/product');
//var Order = require('../models/order');

/* GET home page. */
router.get('/', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    /*Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', {title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
    });*/
    res.render('main/mainpage');
});
router.post('/chat', function(req, res, next) {
    var users = {}, io = require('../bin/www');

    var gr = ['A', 'B', 'C'];

    res.render('chat/index');

    var Chat = require('../models/Message.js');

    io.sockets.on('connection', function(socket) {
        console.log('Connected ' + req.body.email);
        /*var query = Chat.find({});
        query.sort('-created').limit(8).exec(function(err, docs) {
            if(err)
                throw err;
            socket.emit('load old msgs', docs);
        });*/

        socket.on('new user', function(callback) {
            User.findOne({'email':req.body.email}, function(err, user) {
                if(err){
                    callback(false);
                }
                if(!user) {
                    callback(false);
                }
                callback(true);
                socket.name = user.name;
                users[socket.name] = socket;
                updateNicknames();
                socket.emit('starting message', {msg:'Hello ', nick: socket.name});
            });
        })

        socket.on('request grouplist', function(callback) {
            k = ['List of groups:'];
            for(var i=0;i<gr.length;i++) {
                k.push(gr[i]);
            }
            callback(null, k);
        });

        function updateNicknames() {
            io.sockets.emit('usernames', Object.keys(users));
        }

        socket.on('send message', function(data, callback) {
            var msg = data.trim();
            if(msg.substring(0, 3) === '/w ') {
                msg = msg.substr(3);
                var ind = msg.indexOf(' ');
                if(ind !== -1) {
                    var name = msg.substring(0, ind);
                    var msg = msg.substring(ind + 1);
                    if(name in users)
                    {
                        users[name].emit('whisper', {msg:msg, nick: socket.name});
                        console.log('Whisper!');
                    }
                    else {
                        callback('Error! Enter a valid user!');
                    }
                }
                else {
                    callback('Error. Please enter a message for your whisper!')
                }
            }
            else {
                var newMsg = new Chat({msg: msg, nick: socket.name});
                newMsg.save(function(err) {
                    if(err)
                        throw(err);
                    io.sockets.emit('new message', {msg:msg, nick: socket.name});
                })
            }
        });

        socket.on('disconnect', function(data) {
            if(!socket.name)
                return;
            delete users[socket.name];
            updateNicknames();
        });
    });
})
/*router.get('/add-to-cart/:id', function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, function(err, product) {
		if(err){
			return res.redirect('');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		console.log(req.session.cart);
		res.redirect('/');
	})
});

router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
})

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
})

router.get('/shopping-cart', function(req, res, next) {
	if(!req.session.cart) {
		return res.render('shop/shopping-cart', {products: null});
	}
	var cart = new Cart(req.session.cart);
	return res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
})

router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    
    var stripe = require("stripe")(
        "sk_test_EIawwmtxzeLpyNRa7aB6lP2X"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        });
    }); 
});*/

module.exports = router;

/*function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}*/