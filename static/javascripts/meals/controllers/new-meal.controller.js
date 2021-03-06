/**
 * Created by rogueleaderr on 6/21/15.
 */

/**
 * NewMealController
 * @namespace mealTracker.meals.controllers
 */
(function () {
    'use strict';

    angular
        .module('mealTracker.meals.controllers')
        .controller('NewMealController', NewMealController);

    NewMealController.$inject = ['$rootScope', '$scope', '$timeout', 'Snackbar', 'Meals', "Helpers"];

    /**
     * @namespace NewMealController
     */
    function NewMealController($rootScope, $scope, $timeout, Snackbar, Meals, Helpers) {
        var vm = this;

        vm.form_type = "New";
        vm.submit = submit;
        vm.submitMealToServer = submitMealToServer;

        configureDatePicker();
        configureTimePicker();

        /**
         * @name submit
         * @desc Create a new Meal
         * @memberOf mealTracker.meals.controllers.NewMealController
         */
        function submit() {
            $scope.closeThisDialog();
            vm.submitMealToServer();
        }

        function submitMealToServer() {
            var mealTime = Helpers.mergeDateAndTime(vm.date, vm.time);
            Meals.create(vm.name, vm.description, vm.calories, mealTime).then(createMealSuccessFn, createMealErrorFn);

            /**
             * @name createMealSuccessFn
             * @desc Show snackbar with success message
             */
            function createMealSuccessFn(data, status, headers, config) {
                Snackbar.show('Success! Meal created.');
                var meal = data.data;
                var mealData = {
                    description: meal.description,
                    calories: meal.calories,
                    meal_time: mealTime,
                    name: meal.name,
                    eater: meal.eater,
                    id: meal.id
                };
                $rootScope.$broadcast('meal.created', mealData);
            }

            /**
             * @name createMealErrorFn
             * @desc Propogate error event and show snackbar with error message
             */
            function createMealErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('meal.created.error');
                Snackbar.error(data.error);
            }
        }

        function configureDatePicker() {
            vm.date = new Date();
            vm.today = function () {
                vm.date = new Date();
            };
            vm.today();
            vm.clear = function () {
                vm.date = null;
            };
            vm.toggleMin = function () {
                vm.minDate = ( vm.minDate ) ? null : new Date();
            };
            vm.toggleMin();
            vm.open = function () {
                $timeout(function () {
                    vm.opened = true;
                });
            };
            vm.dateOptions = {
                'year-format': "'yy'",
                'starting-day': 1,
                'show-weaks': false
            };
        }

        function configureTimePicker() {
            vm.time = new Date();
            vm.hstep = 1;
            vm.mstep = 15;
            vm.timeOptions = {
                hstep: [1, 2, 3],
                mstep: [1, 5, 10, 15, 25, 30]
            };
            vm.ismeridian = true;
            vm.changed = function () {
                vm.time_invalid = vm.time == null;
            };
        }
    }
})();