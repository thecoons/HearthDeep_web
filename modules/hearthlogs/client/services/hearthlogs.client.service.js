// Hearthlogs service used to communicate Hearthlogs REST endpoints
(function () {
  'use strict';

  angular
    .module('hearthlogs')
    .factory('HearthlogsService', HearthlogsService);

  HearthlogsService.$inject = ['$resource'];

  function HearthlogsService($resource) {
    return $resource('api/hearthlogs/:hearthlogId', {
      hearthlogId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
