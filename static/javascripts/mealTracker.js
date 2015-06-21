(function () {

    angular
        .module('mealTracker', [
            'mealTracker.routes',
            'mealTracker.config',

            'mealTracker.authentication'
            ]);

    angular.module('mealTracker.config', []);

    angular.module('mealTracker.routes', ['ngRoute']);

    angular.module('mealTracker').run(run);

    run.$inject = ['$http'];

    function run($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }

})();
