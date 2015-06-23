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

  NewMealController.$inject = ['$rootScope', '$scope', '$timeout', 'Authentication', 'Snackbar', 'Meals'];

  /**
  * @namespace NewMealController
  */
  function NewMealController($rootScope, $scope, $timeout, Authentication, Snackbar, Meals) {
    var vm = this;

    vm.submit = submit;

      /*
      vm.dateOptions = {
          startingDay: 1,
          "year-range": 10
    };
        vm.dateTimeNow = function() {
    vm.date = new Date();
  };
      vm.datePickerOptions = {
          'max-mode': 'day',
          'datepicker-append-to-body': 'datepicker-append-to-body'
      };
  vm.dateTimeNow();
  */
      vm.date = new Date();
      vm.today = function() {
          vm.date = new Date();
      };
      vm.today();

      vm.clear = function () {
          vm.date = null;
      };

      vm.toggleMin = function() {
          vm.minDate = ( vm.minDate ) ? null : new Date();
      };
      vm.toggleMin();

      vm.open = function() {
          $timeout(function() {
              vm.opened = true;
          });
      };

      vm.dateOptions = {
          'year-format': "'yy'",
          'starting-day': 1,
          'show-weaks': false
      };

      vm.time = new Date();

      vm.hstep = 1;
      vm.mstep = 15;

      vm.timeOptions = {
          hstep: [1, 2, 3],
          mstep: [1, 5, 10, 15, 25, 30]
      };

      vm.ismeridian = true;


      vm.changed = function () {
          console.log('Time changed to: ' + vm.time);
      };

      vm.clear = function() {
          vm.time = null;
      };

      /**
       * @name submit
       * @desc Create a new Meal
       * @memberOf mealTracker.meals.controllers.NewMealController
       */
      function submit() {


          $scope.closeThisDialog();
          // both the date and time pickers return a full Date object with both date and time parts.
          // We want to keep the date from the date and the time from the time
          // date strings have a nice format so string manipulation is actually a simpler way to combine them while
          // preserving timezone info than trying to work with Date objects would be.
          var formattedDate = moment(vm.date).format().split("T")[0];
          var formattedTime = moment(vm.time).format().split("T")[1];
          var mealTime = formattedDate + "T" + formattedTime;
          console.log(mealTime);

          Meals.create(vm.name, vm.description, vm.calories, mealTime).then(createMealSuccessFn, createMealErrorFn);


      /**
      * @name createMealSuccessFn
      * @desc Show snackbar with success message
      */
      function createMealSuccessFn(data, status, headers, config) {
          Snackbar.show('Success! Meal created.');
          var meal = data.data;
          $rootScope.$broadcast('meal.created', {
              description: meal.description,
              calories: meal.calories,
              meal_date: formattedDate,
              meal_time: meal.time,
              name: meal.name,
              eater: meal.eater,
              id: meal.id
          });
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
  }
})();