angular.module('app.timesheets', [
  'app.timesheets.controllers',
  'ui.router'
])

  .config(function ($stateProvider) {

    $stateProvider
      .state('app.timesheets', {
        url: '/users/:user_id/timesheets',
        controller: 'TimesheetCtrl',
        controllerAs: 'timesheetCtrl',
        templateUrl: 'assets/templates/app/timesheets/index.html',
        data: {
          section: 'Timesheets'
        }
      })

      .state('app.timesheets.detail', {
        url: '/detail/:_id',
        controller: 'TimesheetDetailCtrl',
        controllerAs: 'timesheetDetailCtrl',
        templateUrl: 'assets/templates/app/timesheets/detail.html',
        data: {
          section: 'Timesheet Details'
        },
        resolve : {
          timesheet : [
            'data', 
            '$stateParams', 
            function (data, $stateParams) {
              return data.get('timesheets', $stateParams);
            }
          ],
          timeunits : [
            'data',
            '$stateParams',
            function (data, $stateParams) {
              return data.list('timeunits', {timesheet_id: $stateParams._id, user_id: $stateParams.user_id});
            }
          ]
        }
      })

      .state('app.timesheets.detail.edit', {
        url: '/edit',
        controller: 'TimesheetEditCtrl',
        controllerAs: 'timesheetFormCtrl',
        templateUrl: 'assets/templates/app/timesheets/form.html',
        data: {
          section: 'Edit Timesheet',
          saveText: 'Update'
        }
      })

      .state('app.timesheets.create', {
        url: '/create',
        controller: 'TimesheetCreateCtrl',
        controllerAs: 'timesheetFormCtrl',
        templateUrl: 'assets/templates/app/timesheets/form.html',
        data: {
          section: 'Create Timesheet',
          saveText: 'Create'
        }
      });
  })

  .run(function (api) {
    api.add({
      resource: 'timesheets',
      url: '/users/:user_id/timesheets',
      params: {
        user_id: '@user_id'
      }
    });
  }); 
