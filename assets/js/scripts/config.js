var naps = angular.module('hfApp',
    [
        'ngRoute',
        'ui.router',
        'ui.bootstrap'
    ])
.constant('HOST_NAME', 'http://napsbo.pyxicom.com/')
.constant('LOGIN_HOST', 'https://wsdev.coachtv.fr/');