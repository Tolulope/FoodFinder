var casper = require('casper').create();


var algoliasearch = require('node_modules/algoliasearch/dist/algoliasearch');


var links, links2;
var restaurants = [];

var client = algoliasearch('AO1SF8CDEJ', '55d7f295a6ba8c29213d815450eca322');


function getRestaurants(){
	function getLinks() {
		// Scrape the links from top-right nav of the website
		var links = document.querySelectorAll('body div.js-react-on-rails-component');
		return Array.prototype.map.call(links, function (e) {
			return e.getAttribute('data-props');
		});
	}
	function getLinks2() {
		// Scrape the links from top-right nav of the website
		var links2 = document.querySelectorAll('div.restaurants__list__item');
		return Array.prototype.map.call(links2, function (e) {
			return e.getAttribute('data-vendor');
		});
	}
	casper.start('https://deliveroo.fr/fr/restaurants/bordeaux/centre');
	casper.then(function () {
		links = this.evaluate(getLinks);
		for(var i in JSON.parse(links[0]).restaurants) {
			var tempRestau = JSON.parse(links[0]).restaurants[i];
			var customTempRestau = {};

			

			customTempRestau = {
				id: tempRestau.id,
				tags: tempRestau.food_tags,
				image: tempRestau.image_url,
				new: tempRestau.is_new,
				priceCat: tempRestau.price_category,
				name: tempRestau.name,
				url: 'https://deliveroo.fr/fr' + tempRestau.url,
				lat: '',
				long: '',
				distance : '5',
				provider : 'deliveroo'
			}
	    	//console.log(JSON.stringify(customTempRestau));
	    	restaurants.push(customTempRestau);
	    }
	   // console.log(restaurants);
	});

	casper.thenOpen('https://www.foodora.fr/restaurants/lat/44.8314018/lng/-0.5736742999999933/plz/33000/city/Bordeaux/address/26%2520Place%2520de%2520la%2520Victoire%252C%252033000%2520Bordeaux%252C%2520France/Place%2520de%2520la%2520Victoire/26', function(){
		links2 = this.evaluate(getLinks2);
		for(var i in links2) {
			var tempRestau2 = JSON.parse(links2[i]);
			var indexImageSubstr = tempRestau2.image_high_resolution.search('(45)');
			tempRestau2.image_high_resolution = tempRestau2.image_high_resolution.substr(indexImageSubstr+4);
			var customTempRestau2 = {};
			customTempRestau2 = {
				id: tempRestau2.id,
				tags: tempRestau2.description,
				image: tempRestau2.image_high_resolution,
				new: 'false',
				priceCat: tempRestau2.budget,
				name: tempRestau2.name,
				url: tempRestau2.web_path,
				lat: tempRestau2.latitude,
				long: tempRestau2.longitude,
				distance: '5',
				provider: 'foodora'
			}
			//console.log(JSON.stringify(customTempRestau2));
			restaurants.push(customTempRestau2);
		}
		
		console.log(JSON.stringify(restaurants));
	});
	casper.run(function () {
		casper.done();
	});
}
getRestaurants();



