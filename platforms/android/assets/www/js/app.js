

(function(){
	'use strict';
angular.module('Dagcentrum', [
	'ngRoute',
	//'Dagcentrum.Controllers.routeProvider',
	'mobile-angular-ui.gestures',
	'mobile-angular-ui',
	'firebase',
	'ngTable'
	
	//'Dagcentrum.Controllers.firebaseAuth'
	]);
var app = angular.module('Dagcentrum');

	//.config(["$routeProvider", fctRouteProvider])
	app.constant('FirebaseDatabaseUrl', 'https://terranova-d6cd4.firebaseio.com/');
	app.run(["$rootScope", "$location", fctRootScope]);
	app.config(["$routeProvider", fctRouteProvider]);


// app.controller('MainController', ['$scope','$location','currentAuth',function($scope,$location,currentAuth) {
// 	// any time auth state changes, add the user data to scope

// 		else {
//     // No user is signed in.
//     $location.path("/SignIn");
// }
// })
// }]);

app.controller('MainCtrl',['$scope','$location','Auth',fctMainCtrl]);
app.controller('firebaseAuthCtrl', ['currentAuth','$scope','$location','Auth', fctFirebaseAuthCtrl]);
//app.controller("navbarCtrl", ['$scope','$location',fctNavbarCtrl]);
app.controller("kamersCtrl", ['$scope','$location','$firebaseArray','currentAuth', fctUserHomeCtrl]);
//app.controller("kamersCtrl", ['$scope','$location','currentAuth', fctKamersCtrl]);
app.controller("patientsCtrl", ['$scope','$location','$firebaseArray','currentAuth','NgTableParams', fctpatientsCtrl]);
app.factory('Auth', ["$firebaseAuth", fctFirebaseAuth]);



//Main Functions


// 	$scope.auth = Auth;
// 	$scope.auth.$onAuthStateChanged(function(firebaseUser) {
// 		if (firebaseUser) {
//     console.log(firebaseUser.email);
// 			}
function fctRootScope($rootScope, $location) {
	$rootScope.$on("$routeChangeError", function (event, next, previous, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
    	$location.path("/SignIn");
    }
});
}

function fctRouteProvider($routeProvider) {
	$routeProvider
	.when('/SignIn', {
		templateUrl:'SignIn.html',
		controller: 'firebaseAuthCtrl',
		resolve: {
			"currentAuth": ["Auth", fctWaitForSignIn]
		}

		//reloadOnSearch: false
	})
	.when('/kamers', {
		templateUrl:'kamers.html',
		controller: 'kamersCtrl',
		resolve: {
			"currentAuth": ["Auth", fctRequireSignIn]
		}

		//reloadOnSearch: false
	}).when('/patienten', {
		templateUrl:'patients.html',
		controller: 'patientsCtrl',
		resolve: {
			"currentAuth": ["Auth", fctRequireSignIn]
		}

		//reloadOnSearch: false
	}).when('/', {
		templateUrl:'kamers.html',
		controller: 'kamersCtrl',
		resolve: {
			"currentAuth": ["Auth", fctRequireSignIn]
		}

		//reloadOnSearch: false
	}).otherwise({
			redirectTo: '/'
		});
	;
}

function fctFirebaseAuth($firebaseAuth) {
		//var ref = new Firebase("https://terranova-d6cd4.firebaseio.com/");
		return $firebaseAuth();
	}

function fctMainCtrl($scope,$location,Auth) {
  //console.log($scope.auth);
  	$scope.auth = Auth;

$scope.isActive = function(viewLocation) {
    return viewLocation === $location.path();
};

$scope.goTo = function(goToLocation) {
    return $location.path(goToLocation);
};


   /*$scope.auth.$onAuthStateChanged( function (firebaseUser) {
    	if (firebaseUser) {
    		//console.log(firebaseUser.email);
    	}

    	else {
    // No user is signed in.
    $location.path("/SignIn");
}
});*/

}


/*function fctNavbarCtrl($scope,$location) {
  $scope.isActive = function(viewLocation) {
    return viewLocation === $location.path();
};
}*/


	function fctUserHomeCtrl($scope,$location,$firebaseArray,currentAuth) {
  		var roomsRef = firebase.database().ref().child("rooms");
  		var floorsRef = firebase.database().ref().child("floors");
  		var roomsFloorRef = floorsRef.child('id').child('rooms');
  		// create a synchronized array
  		// click on `index.html` above to see it used in the DOM!
  		$scope.floors = $firebaseArray(floorsRef);
  		$scope.roomsFloor = $firebaseArray(roomsFloorRef);
  		//console.log($scope.roomsFloor);
  		//console.log($scope.floors);
  		//console.log($scope.rooms);

}

function fctKamersCtrl($scope,$location,currentAuth) {

}

function fctpatientsCtrl($scope,$location,$firebaseArray,currentAuth,NgTableParams) {
	var patientsRef = firebase.database().ref().child("patients");
	$scope.patients = $firebaseArray(patientsRef);
	//var ApiPatients = $scope.patients;
	//console.log($scope.patients);

	var self = this;
    self.tableParams = new NgTableParams({
    	sorting: { Date: "asc" } 
    }, {
      dataset: $scope.patients
    });

}

function fctFirebaseAuthCtrl(currentAuth,$scope,$location,Auth) {
	$scope.auth = Auth;
	$scope.user = {
		username: "",
		password: ""
	};


	$scope.signin = function () {
	var email = $scope.user.username;
	var password = $scope.user.password;
	$scope.firebaseUser = null;
	$scope.error = null;
	firebase.auth().signInWithEmailAndPassword(email, password).then(function(firebaseUser){
        		//console.log(firebaseUser);
        		$scope.firebaseUser = firebaseUser;
        		$location.path("/kamers");
        	}).catch(function(error) {
  			// Handle Errors here.
  			var errorCode = error.code;
  			var errorMessage = error.message;
			  // ...
			});


        }

}

//Sub-Functions



function fctWaitForSignIn(Auth) {
        // $waitForSignIn returns a promise so the resolve waits for it to complete
        return Auth.$waitForSignIn();
    }

function fctRequireSignIn(Auth) {
					// $requireSignIn returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $routeChangeError (see above)
        return Auth.$requireSignIn();
    }


//     function fctCheckFirebaseUser(firebaseUser) {
//     	if (firebaseUser) {
//     		console.log(firebaseUser.email);
//     	}

//     	else {
//     // No user is signed in.
//     $location.path("/SignIn");
// }
// }

})();

