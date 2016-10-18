(function () {
  'use strict';

  // Hearthlogs controller
  angular
    .module('hearthlogs')
    .controller('HearthlogsController', HearthlogsController);

  HearthlogsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'hearthlogResolve'];

  function HearthlogsController ($scope, $state, $window, Authentication, hearthlog) {
    var vm = this;

    vm.authentication = Authentication;
    vm.hearthlog = hearthlog;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Hearthlog
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.hearthlog.$remove($state.go('hearthlogs.list'));
      }
    }

    // Save Hearthlog
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.hearthlogForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.hearthlog._id) {
        vm.hearthlog.$update(successCallback, errorCallback);
      } else {
        vm.hearthlog.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('hearthlogs.view', {
          hearthlogId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
