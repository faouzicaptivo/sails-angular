angular.module('hfApp')

  .config(['$stateProvider', '$locationProvider', '$routeProvider',
      function ($stateProvider, $locationProvider, $routeProvider) {

          $stateProvider
            .state('app', {
                templateUrl: 'app/layout.html',
                controller: 'AppCtrl'
            })
            .state('app.home', {
                url: '/',
                templateUrl: 'home/home.html',
                controller: 'HomeCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'login/login.html',
                controller: 'LoginCtrl'
            })
            .state('logout', {
              url: '/logout'
          }).state('app.contacts', {
              url: '/contacts',
              templateUrl: 'contacts/contacts.html',
              controller: 'ContactsCtrl'
          });

          $routeProvider.otherwise({redirectTo: '/'});

          if (window.history && window.history.pushState) {
              $locationProvider.html5Mode(true);
          }
      }])

  .factory('tokenInjector', ['$q', '$injector', function ($q, $injector) {

          var tokenInjector = {
              request: function (config) {
                  var stateService = $injector.get('$state');
                  config = config || {};
                  if (stateService.current.name !== 'login') {
                      config.headers.Authorization = "Bearer " + localStorage.authToken;
                  }

                  return config;
              },
              'responseError': function (rejection) {

                  var stateService = $injector.get('$state');
                  var defer = $q.defer();

                  switch (rejection.status) {
                      case (401):
                          if (stateService.current.name !== 'login') {
                              localStorage.authToken = "";
                              localStorage.isAuthenticated = false;
                              localStorage.user = "";
                              stateService.go('login');
                          }
                          break;
                      case(404):
                          //stateService.go('404');
                          break;
                      case (500):
                          stateService.go('500');
                          break;
                  }
                  defer.reject(rejection);
                  return defer.promise;
              }
          };
          return tokenInjector;
      }])

  .config(['$httpProvider', function ($httpProvider) {
          $httpProvider.interceptors.push('tokenInjector');
      }])

  .run(['$rootScope', '$state', '$window', '$timeout',
      function ($rootScope, $state, $window) {

          $rootScope.$on('$stateChangeStart', function (event, toState, fromState) {

              var isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated'));
              var user = localStorage.getItem('user');

              if (user && user.length > 0) {
                  $rootScope.user = JSON.parse(user);
              }

              if (toState.name !== "login" && toState.name !== "resseting" && !isAuthenticated) {
                  event.preventDefault();
                  $state.go('login');
              }

              if (toState.name === "logout") {
                  localStorage.clear();
                  event.preventDefault();
                  $state.go('login');
              }

              if (toState.name === "login" && isAuthenticated) {
                  event.preventDefault();
                  $state.go('app.home');
              }

          });

      }]);