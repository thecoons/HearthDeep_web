'use strict';

describe('Hearthlogs E2E Tests:', function () {
  describe('Test Hearthlogs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/hearthlogs');
      expect(element.all(by.repeater('hearthlog in hearthlogs')).count()).toEqual(0);
    });
  });
});
