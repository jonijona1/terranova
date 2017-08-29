angular
	.module('Dagcentrum.Controllers.routeProvider',['ngRoute'])
angular
	.module('Dagcentrum.Controllers.routeProvider')
	.config('routeProvider',["$routeProvider", fctRouteProvider]);

	function fctRouteProvider($routeProvider) {
	$routeProvider.when('/SignIn', {
		templateUrl:'SignIn.html',
		controller: 'firebaseAuthCtrl',
		resolve: {
			"currentAuth": ["Auth", fctWaitForSignIn]
		},

		reloadOnSearch: false
	}).when('/userHome', {
		templateUrl:'userHome.html',
		controller: 'userHomeCtrl',
		resolve: {
			"currentAuth": ["Auth", fctRequireSignIn]
		},

		reloadOnSearch: false
	})
	;
}