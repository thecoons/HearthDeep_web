(function () {
  'use strict';

  angular
    .module('hearthlogs')
    .controller('HearthlogsListController', HearthlogsListController);

  HearthlogsListController.$inject = ['HearthlogsService'];

  function HearthlogsListController(HearthlogsService) {
    var vm = this;

    vm.hearthlogs = HearthlogsService.query();
  }
}());
