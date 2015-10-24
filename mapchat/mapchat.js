var request = new XMLHttpRequest();
var mylat = 0;
var mylong = 0;
var me = new google.maps.LatLng(mylat, mylong);
var myOptions = {
	zoom: 13,
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();

function init() {
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	getMyLocation();
}

function getMyLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			mylat = position.coords.latitude;
			mylong = position.coords.longitude;
			renderMap();
		});
	} else {
		alert("Geolocation is not supported by your web browser. What a shame!")
	}
}

function renderMap() {
	me = new google.maps.LatLng(mylat, mylong);
	map.panTo(me);
	marker = new google.maps.Marker({
		position: me,
		title: "RichRumfelt",
		icon: 'chimp.png'
	});
	marker.setMap(map);
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
	post(mylat, mylong, "RichRumfelt")
}

function post(lat, lng, login) {
	var url = "https://secret-about-box.herokuapp.com/sendLocation";
	var params = "login=" + login + "&lat=" + lat + "&lng=" + lng;
	request.open("POST", url, true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(params);
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			data = JSON.parse(request.responsText);
			for (i = 0; i < data.length; i++) {
				new_marker(data[i], login);
			}
		}
	}
}

function new_marker(data, myname) {
	username = data["login"];
	console.log(username, data)
	if (username != myname) {	
		lat = data["lat"];
		lng = data["lng"];
		pos = new google.maps.LatLng(lat, lng);
		marker = new google.maps.Marker({
			position: pos,
			title: username,
			map: map
		});
	}
	var distance = dist(mylat, mylong, lat, lng);
	var distance_string = '<h1>' + username + '</h1>' + '<p>' + distance + ' miles from me.</p>';
	marker.content = distance_string;
	infowindow = new google.maps.InfoWindow();
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(this.content);
		infowindow.open(map, this);
	});
}

function dist(mylat, mylong, lat, lng) {
	Number.prototype.toRad = function() {
		return this * Math.PI / 180;
	}
	var R = 6371;
	var x1 = lat - mylat;
	var dlat = x1.toRad();
	var x2 = lng - mylong;
	var dlon = x2.toRad();
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; 
	alert(d);
	return d;
}