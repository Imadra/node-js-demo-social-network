var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping');
Product.find(function(err, data) {
	for(var i=0;i<data.length;i++)
		data[i].remove();
});

var products = [
	new Product({
		imagePath: 'https://cdn.vox-cdn.com/thumbor/XVzWVrPKd-a52ECZV_au_6_FHPA=/0x0:1920x1080/1200x675/filters:focal(807x387:1113x693)/cdn.vox-cdn.com/uploads/chorus_image/image/57562691/NFS_Payback_Story_5.0.jpg',
		title: 'SIMS 4',
		description: 'Awesome Game',
		price: 20
	}),
		new Product({
		imagePath: 'https://www.ea.com/bundles/eathesims/dist/images/share/share_default.jpg',
		title: 'Need For SPEED',
		description: 'Awesome Game',
		price: 10
	}),
	new Product({
		imagePath: 'http://www.mweb.co.za/DesktopModules/DigArticle/MediaHandler.ashx?portalid=20&moduleid=5259&mediaid=54145&width=665&height=400',
		title: 'Counter Sctrike GO',
		description: 'Awesome Game',
		price: 77
	}),
	new Product({
		imagePath: 'https://media.contentapi.ea.com/content/dam/ea/easports/fifa/home/2017/june/5/homepage-share.jpg',
		title: 'Dota 2',
		description: 'Awesome Game',
		price: 123
	}),
	new Product({
		imagePath: 'https://steamcdn-a.akamaihd.net/steam/apps/570/header.jpg?t=1525818062',
		title: 'FIFA 2018',
		description: 'Awesome Game',
		price: 234
	}),
];

var done = 0;
for ( var i=0; i<products.length; i++)
{
	products[i].save(function(err, result) {
		done++;
		if(done == products.length) {
			exit();
		}
	});
}

function exit() {
	mongoose.disconnect();
}