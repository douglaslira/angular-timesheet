describe('Timeunits', function() {

  var expect = chai.expect;
  var $controller,
    $httpBackend,
    $state,
    $stateParams,
    controller, 
    timeunit,
    timesheet,
    projects,
    spies,
    api;

  describe('Controllers', function() {
      
    beforeEach(
      module(
        'ui.router',
        'app.resources',
        'ngResource',
        'security.services',
        'app.timesheets.timeunits',
        'app.timesheets.timeunits.controllers'
      ));

    beforeEach(inject(function (_$httpBackend_, _$controller_, _$state_, _$stateParams_){
      $httpBackend = _$httpBackend_;
      $controller = _$controller_;
      $state = _$state_;
      $stateParams = _$stateParams_;
    }));

    beforeEach(inject(function ($injector) {
      api = $injector.get('api');
      $stateParams.user_id = "1234567890";
      $stateParams._id = "asdfghjklqwerty";

      projects = [{
        "_id": "creative_proj_id",
        "name": "Project1", 
        "description": "This is your first project"
      }];

      timesheet = {"_id": "asdfghjklqwerty", beginDate: '2014-05-12'};
      timeunit = {
        "_id": "aaaaaaaaaa", 
        "dateWorked": "2013-11-18", 
        "hoursWorked": 8, 
        "project": "Project1",
        "timesheet_id": timesheet._id,
        "project_id": projects[0]._id,
        "user_id": $stateParams.user_id
      };

      spies = {
        state: sinon.stub($state)
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('TimeunitCtrl', function() {

      beforeEach(inject(function($controller) {
        controller = $controller("TimeunitCtrl", { 
          projects: projects,
          $stateParams: $stateParams
        });
      }));

      describe('setup', function () {
        it('should be able to instantiate the controller', function () { 
          expect(controller).to.be.ok;
        });
        it('should set the resolved list of projects on scope', function () {
          expect(controller.projects).to.equal(projects);
        });
      }); 

      describe('cancel', function () {
        it('should return back to the timesheet detail', function () {
          controller.cancel();
          expect(spies.state.go).to.have.been.calledWith('app.timesheets.detail');
        });
      });
    });

    describe('TimeunitEditCtrl', function() {

      beforeEach(inject(function($controller) {
        controller = $controller("TimeunitEditCtrl", {
          $state: spies.state,
          $stateParams: $stateParams,
          timeunit: new api.timeunits(timeunit)
        });
      }));

      describe('setup', function () {
        it('should be able to instantiate the controller', function () {
          expect(controller).to.be.ok;
        });
        it('should attach the resolved timeunit onto scope', function () {
          expect(controller.timeunit._id).to.equal(timeunit._id);
        });
      });

      describe('Saving an edited timeunit', function () {
        var updatedTimeunit;

        beforeEach(function () {
          updatedTimeunit = angular.extend(timeunit, {hoursWorked: 12});
          $httpBackend.expect('PUT', '/users/1234567890/timesheets/asdfghjklqwerty/timeunits/aaaaaaaaaa');
        });

        describe('with success', function () {

          beforeEach(function () {
            $httpBackend.when('PUT', '/users/1234567890/timesheets/asdfghjklqwerty/timeunits/aaaaaaaaaa').respond(200, updatedTimeunit);
          });

          it('should set the timeunit on scope to be the updated timeunit', function () {
            controller.save();
            $httpBackend.flush();
            expect(controller.timeunit.name).to.equal(updatedTimeunit.name);
          });
        });

      });
    });

    describe('TimeunitCreateCtrl', function() {

      beforeEach(inject(function($controller) {
        controller = $controller("TimeunitCreateCtrl", {
          $stateParams: $stateParams,
          timesheet: timesheet
        });
      }));

      describe('setup', function () {
        it('should be able to instantiate the controller', function () {
          expect(controller).to.be.ok;
        });
        it('should initialize a new timeunit with user and timesheet ids', function () {
          expect(controller.timeunit.user_id).to.equal($stateParams.user_id);
          expect(controller.timeunit.timesheet_id).to.equal($stateParams._id);
        });
      }); 

      describe('Saving a new timeunit', function () {
        var updatedTimeunit;

        beforeEach(function () {
          updatedTimeunit = angular.extend(timeunit, {hoursWorked: 12});
          $httpBackend.expect('POST', '/users/1234567890/timesheets/asdfghjklqwerty/timeunits');
        });

        describe('with success', function () {

          beforeEach(function () {
            $httpBackend.when('POST', '/users/1234567890/timesheets/asdfghjklqwerty/timeunits').respond(200, updatedTimeunit);
          });

          it('should set the timeunit on scope to be the updated timeunit', function () {
            controller.save();
            $httpBackend.flush();
            expect(controller.timeunit.name).to.equal(updatedTimeunit.name);
          });
        });

      });
    });

  });
});