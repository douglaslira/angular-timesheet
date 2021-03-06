describe('App', function() {

  var expect = chai.expect;
  var controller, scope;
 
  describe('Controllers', function() {
      
    beforeEach(
      module( 
        'ui.router',
        'app.resources',
        'ngResource',
        'security.services',
        'authentication.services',
        'notifications.services',
        'app.controllers'
      ));

    describe('MainCtrl', function() {
      beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        controller = $controller("MainCtrl", {
          $scope: scope
        });
      }));

      describe('setup', function () {
        it('should be able to instantiate the controller', function () { 
          expect(controller).to.be.ok;
        });
      }); 
    });

    describe('AppCtrl', function() {

      beforeEach(inject(function($controller) {
        controller = $controller("AppCtrl");
      }));

      describe('setup', function () {
        it('should be able to instantiate the controller', function () { 
          expect(controller).to.be.ok;
        });
      }); 
    });

    describe('NavCtrl', function() {

      beforeEach(inject(function($controller) {
        controller = $controller("NavCtrl");
      }));

      describe('setup', function () {
        it('should be able to instantiate the controller', function () { 
          expect(controller).to.be.ok;
        });
      }); 
    });

  });
});
