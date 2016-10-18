(function () {
  'use strict';

  angular
    .module('hearthlogs')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Hearthlogs',
      state: 'hearthlogs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'hearthlogs', {
      title: 'List Hearthlogs',
      state: 'hearthlogs.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'hearthlogs', {
      title: 'Create Hearthlog',
      state: 'hearthlogs.create',
      roles: ['user']
    });
  }
}());
