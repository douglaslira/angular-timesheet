describe('Employees', function() {

  var expect = chai.expect;
  var $controller,
    $httpBackend,
    $state,
    $stateParams,
    controller,
    employee,
    spies;

  describe('Controllers:', function() {

    beforeEach(
      module(
        'ngResource',
        'app.resources',
        'app.employees',
        'app.employees.controllers'
      ));

    beforeEach(inject(function (_$httpBackend_, _$controller_){
      $httpBackend = _$httpBackend_;
      $controller = _$controller_;
    }));

    beforeEach(inject(function ($injector) {

      employee = {
        "_id": "1234567890",
        "username": "test",
        "email": "test@test.com",
        "password": "password",
        "admin": true,
        "firstName": "Test",
        "lastName": "User"
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('EmployeeCtrl', function() {

      beforeEach(function() {
        controller = $controller("EmployeeCtrl");
        $httpBackend.when('GET', '/users').respond(200, [{username: 'testUser'}]);
      });

      describe('during setup', function () {
        it('should be able to instantiate the controller and request a page of employees', function () {
          expect(controller).to.be.ok;
          $httpBackend.expect('GET', '/users');
          $httpBackend.flush();
        });
      });

      describe('requesting employees', function () {

        it('should set the result to the employees', function () {
          $httpBackend.expect('GET', '/users');
          controller.requestEmployees();
          $httpBackend.flush();
          expect(controller.employees[0].username).to.equal("testUser");
        });

      });

      describe('removing a employee', function () {

        it('should send a remove request for the specified employee', function () {
          $httpBackend.flush();
          $httpBackend.expect('PUT', '/users/' + employee._id).respond(200);
          controller.remove(employee);
          $httpBackend.flush();
        });

        describe('successfully', function () {
          beforeEach(function () {
            $httpBackend.flush();
            $httpBackend.when('PUT', '/users/' + employee._id).respond(200);
          });

          it('should set the employee to deleted for the ui', function () {
            controller.remove(employee);
            $httpBackend.flush();
            expect(employee.deleted).to.be.true;
          });
        });

        describe('in error', function () {
          beforeEach(function () {
            $httpBackend.flush();
            $httpBackend.when('PUT', '/users/' + employee._id).respond(500);
          });

          it('should set deleted to false for the employee in the ui', function () {
            controller.remove(employee);
            $httpBackend.flush();
            expect(employee.deleted).to.be.false;
          });
        });

      });

      describe('restore', function () {
        beforeEach(function () {
          employee.deleted = true;
        });

        it('should send a restore request for the specified employee', function () {
          $httpBackend.flush();
          $httpBackend.expect('PUT', '/users/' + employee._id).respond(200);
          controller.restore(employee);
          $httpBackend.flush();
        });

        describe('successfully', function () {
          beforeEach(function () {
            $httpBackend.flush();
            $httpBackend.when('PUT', '/users/' + employee._id).respond(200);
          });

          it('should set the employee to not deleted for the ui', function () {
            controller.restore(employee);
            $httpBackend.flush();
            expect(employee.deleted).to.be.false;
          });
        });

        describe('in error', function () {
          beforeEach(function () {
            $httpBackend.flush();
            $httpBackend.when('PUT', '/users/' + employee._id).respond(500);
          });

          it('should set deleted to true for the employee in the ui', function () {
            controller.restore(employee);
            $httpBackend.flush();
            expect(employee.deleted).to.be.true;
          });
        });
      });

    });

  });
});
