app.module('Dagcentrum.Controllers.firebaseAuth')
	app.factory('firebaseAuth', ["$firebaseAuth", fctFirebaseAuth]);

	function fctFirebaseAuth($firebaseAuth) {
		//var ref = new Firebase("https://terranova-d6cd4.firebaseio.com/");
		return $firebaseAuth();
	}
