describe('Projects', function() {

  var expect = chai.expect;
  var $controller,
    $httpBackend,
    $state,
    $stateParams,
    controller, 
    project,
    spies;
 
  describe('Controllers:', function() {
      
    beforeEach(
      module(
        'app.resources',
        'ngResource',
        'app.projects',
        'app.projects.controllers'
      ));

    beforeEach(inject(function (_$httpBackend_, _$controller_){
      $httpBackend = _$httpBackend_;
      $controller = _$controller_;
    }));

    beforeEach(inject(function ($injector) {

      project = {
        "_id": "abcdefghijklmnop",
        "name": "Project2", 
        "description": "This is your second project"
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('ProjectCtrl', function() {

      beforeEach(function() {
        controller = $controller("ProjectCtrl");
        
        $httpBackend.when('GET', '/projects').respond(200, [{name: 'project1'}]);
      });

      describe('during setup', function () {
        it('should be able to instantiate the controller and request a page of projects', function () { 
          expect(controller).to.be.ok; 
          $httpBackend.expect('GET', '/projects');
          $httpBackend.flush();
        });
      }); 

      describe('requesting projects', function () {
        it('should set the result to the projects', function () {
          $httpBackend.expect('GET', '/projects');
          controller.requestProjects();
          $httpBackend.flush();
          expect(controller.projects[0].name).to.equal("project1");
        }); 
      });

      describe('removing a project', function () {

        it('should send a remove request for the specified project', function () {
          $httpBackend.flush();
          $httpBackend.expect('PUT', '/projects/' + project._id).respond(200);
          controller.remove(project);
          $httpBackend.flush();
        });

        describe('successfully', function () {
          beforeEach(function () {
            $httpBackend.flush();
            $httpBackend.when('PUT', '/projects/' + project._id).respond(200);
          });

          it('should set the project to deleted for the ui', function () {
            controller.remove(project);
            $httpBackend.flush();
            expect(project.deleted).to.be.true;
          });
        });

        describe('in error', function () {
          beforeEach(function () {
            $httpBackend.flush();
            $httpBackend.when('PUT', '/projects/' + project._id).respond(500);
          });

          it('should set deleted to false for the project in the ui', function () {
            controller.remove(project);
            $httpBackend.flush();
            expect(project.deleted).to.be.false;
          });
        });

      });

      describe('restore', function () {
        beforeEach(function () {
          project.deleted = true;
        });

        it('should send a restore request for the specified project', function () {
          $httpBackend.flush();
          $httpBackend.expect('PUT', '/projects/' + project._id).respond(200);
          controller.restore(project);
          $httpBackend.flush();
        });

        describe('successfully', function () {
          beforeEach(function () {
            $httpBackend.flush();
            $httpBackend.when('PUT', '/projects/' + project._id).respond(200);
          });

          it('should set the project to not deleted for the ui', function () {
            controller.restore(project);
            $httpBackend.flush();
            expect(project.deleted).to.be.false;
          });
        });

        describe('in error', function () {
          beforeEach(function () {
            $httpBackend.flush();
            $httpBackend.when('PUT', '/projects/' + project._id).respond(500);
          });

          it('should set deleted to true for the project in the ui', function () {
            controller.restore(project);
            $httpBackend.flush();
            expect(project.deleted).to.be.true;
          });
        });
      });
    });
  });
});