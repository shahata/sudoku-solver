/// <reference path="../../reference.ts" />
'use strict';

describe('Controller: MainController', () => {
  let main: MainController;
  let scope: ng.IScope;

  beforeEach(() => {
    module('sodukuAppInternal');
  });

  beforeEach(inject(($controller: ng.IControllerService, $rootScope: ng.IRootScopeService) => {
    scope = $rootScope.$new();
    main = $controller('MainController', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the controller', () => {
    // expect(main.awesomeThings.length).toBe(7);
  });
});
