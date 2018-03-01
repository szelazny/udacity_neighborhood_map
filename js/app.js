// Location Class completely builds everything needed for each location marker.
var Location = function(title, lng, lat, venueId, cat) {
	var self = this;
	this.title = title;
	this.lng = lng;
	this.lat = lat;
	this.venueId = venueId;
	this.cat = cat;

// getConetent function retrieves 5 most recent tips from foursquare for the marker location.
	this.getContent = function() {
		var topTips = [];
		var venueUrl = 'https://api.foursquare.com/v2/venues/' + self.venueId + '/tips?sort=recent&limit=5&v=20150609&client_id=4EPS21I4V4MVCYXWDT4QNZZG1JETWZ2LIJMYQ34FNBWZ1RMV&client_secret=U3P1XLU204VMYO4BHGIWPDOY130Z1AFTT1OQTI2TY0HW0T43';

		$.getJSON(venueUrl,
			function(data) {
				$.each(data.response.tips.items, function(i, tips){
					topTips.push('<li>' + tips.text + '</li>');
				});

			}).done(function(){

				self.content = '<h2>' + self.title + '</h2>' + '<h3>5 Most Recent Comments</h3>' + '<ol class="tips">' + topTips.join('') + '</ol>';
			}).fail(function(jqXHR, textStatus, errorThrown) {
				self.content = '<h2>' + self.title + '</h2>' + '<h3>5 Most Recent Comments</h3>' + '<h4>Oops. There was a problem retrieving this location\'s comments.</h4>';				
				console.log('getJSON request failed! ' + textStatus);
			});
		}();

		this.infowindow = new google.maps.InfoWindow();

		// Assigns a marker icon color based on the category of the location.
		switch (this.cat) {
			case "Shopping":
			this.icon = 'http://www.googlemapsmarkers.com/v1/009900/';
			break;
			case "Food":
			this.icon = 'http://www.googlemapsmarkers.com/v1/0099FF/';
			break;
			default:
			this.icon = 'http://www.googlemapsmarkers.com/v1/990000/';
		}
		this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(self.lng, self.lat),
			map: map,
			title: self.title,
			icon: self.icon
		});

		// Opens the info window for the location marker.
		this.openInfowindow = function() {
			for (var i=0; i < locationsModel.locations.length; i++) {
   			locationsModel.locations[i].infowindow.close();
  		}
			map.panTo(self.marker.getPosition())
			self.infowindow.setContent(self.content);
			self.infowindow.open(map,self.marker);
		};

		// Assigns a click event listener to the marker to open the info window.
		this.addListener = google.maps.event.addListener(self.marker,'click', (this.openInfowindow));
	};

	// Contains all the locations and search function.
	var locationsModel = {

		locations:[
		new Location('Aldi', 39.258251, -76.662604, '4ccf44466200b1f78260cd28', 'Shopping'),
		new Location('Walmart', 39.251022, -76.669294, '4b08e3eff964a520261323e3', 'Shopping'),
		new Location('Ace Hardware', 39.2755, -76.612297, '4b2c0331j964a52093bf23e3', 'Shopping'),
		new Location('Home Depot', 39.248026, -76.674238, '4b2c2021f964a52033c224e3', 'Shopping'),
		new Location('Giant Food', 39.265803, -76.698629, '4b9970d1f964a520b37b35e3', 'Shopping'),
		new Location('Weis', 39.261015, -76.69614, '57a4f566498e74340d2dc7f5', 'Shopping'),
		new Location('Standard Auto Parts', 39.268236, -76.647487, '4be7f6b4947820a1d045b4db', 'Shopping'),
		new Location('Cloos\' Coney Island', 35.77770, -78.67485, '4afee1fdf964a520333122e3', 'Food'),
		new Location('Mikes Pizza', 39.251017, -76.693744, '4b92f04bf964a520972834e3', 'Food'),
		new Location('Snoopy\'s Hot Dogs & More', 35.80719, -78.62499, '4bf6c03013aed13a6823eaf7', 'Food'),
		new Location('Clyde Cooper\'s Barbecue', 35.77630, -78.63831, '4b63170ef964a52039622ae3', 'Food'),
		],
		query: ko.observable(''),
	};


	// Search function for filtering through the list of locations based on the name of the location.
	locationsModel.search = ko.dependentObservable(function() {
		var self = this;
		var search = this.query().toLowerCase();
		return ko.utils.arrayFilter(self.locations, function(location) {
			return location.title.toLowerCase().indexOf(search) >= 0;
		});
	}, locationsModel);

ko.applyBindings(locationsModel);
