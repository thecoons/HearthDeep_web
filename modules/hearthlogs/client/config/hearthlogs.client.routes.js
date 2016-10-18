(function () {
  'use strict';

  angular
    .module('hearthlogs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('hearthlogs', {
        abstract: true,
        url: '/hearthlogs',
        template: '<ui-view/>'
      })
      .state('hearthlogs.list', {
        url: '',
        templateUrl: 'modules/hearthlogs/client/views/list-hearthlogs.client.view.html',
        controller: 'HearthlogsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Hearthlogs List'
        }
      })
      .state('hearthlogs.create', {
        url: '/create',
        templateUrl: 'modules/hearthlogs/client/views/form-hearthlog.client.view.html',
        controller: 'HearthlogsController',
        controllerAs: 'vm',
        resolve: {
          hearthlogResolve: newHearthlog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Hearthlogs Create'
        }
      })
      .state('hearthlogs.edit', {
        url: '/:hearthlogId/edit',
        templateUrl: 'modules/hearthlogs/client/views/form-hearthlog.client.view.html',
        controller: 'HearthlogsController',
        controllerAs: 'vm',
        resolve: {
          hearthlogResolve: getHearthlog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Hearthlog {{ hearthlogResolve.name }}'
        }
      })
      .state('hearthlogs.view', {
        url: '/:hearthlogId',
        templateUrl: 'modules/hearthlogs/client/views/view-hearthlog.client.view.html',
        controller: 'HearthlogsController',
        controllerAs: 'vm',
        resolve: {
          hearthlogResolve: getHearthlog
        },
        data: {
          pageTitle: 'Hearthlog {{ hearthlogResolve.name }}'
        }
      });
  }

  getHearthlog.$inject = ['$stateParams', 'HearthlogsService'];

  function getHearthlog($stateParams, HearthlogsService) {
    return HearthlogsService.get({
      hearthlogId: $stateParams.hearthlogId
    }).$promise;
  }

  newHearthlog.$inject = ['HearthlogsService'];

  function newHearthlog(HearthlogsService) {
    return new HearthlogsService();
  }
}());
