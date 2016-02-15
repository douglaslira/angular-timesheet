angular.module('app.timesheets.timeunits', [
    'app.timesheets.timeunits.controllers',
    'ui.router'
  ])
  
  .config(function ($stateProvider) {

    $stateProvider
      .state('app.timesheets.detail.timeunits', {
        abstract: true,
        url: '/timeunits',
        controller: 'TimeunitCtrl',
        controllerAs: 'timeunitCtrl',
        template: '<div ui-view></div>',
        resolve: {
          projects: [
            'data', 
            function (data) {
              return data.list('projects');
            }]
        }
      })

      .state('app.timesheets.detail.timeunits.create', {
        url: '/create',
        controller: 'TimeunitCreateCtrl',
        controllerAs: 'timeunitFormCtrl',
        templateUrl: 'assets/templates/app/timesheets/timeunits/form.html',
        data: {
          section: 'Log Time'
        }
      })

      .state('app.timesheets.detail.timeunits.edit', {
        url: '/edit/:timeunit_id',
        controller: 'TimeunitEditCtrl',
        controllerAs: 'timeunitFormCtrl',
        templateUrl: 'assets/templates/app/timesheets/timeunits/form.html',
        data: {
          section: 'Edit Time'
        },
        resolve : {
          timeunit : [
            'data', 
            '$stateParams', 
            function (data, $stateParams) {
              return data.get('timeunits', {_id: $stateParams.timeunit_id, user_id: $stateParams.user_id, timesheet_id: $stateParams._id});
            }]
        }
      });
  })

  .run(function (api) {

    api.add({
      resource: 'timeunits',
      url: '/users/:user_id/timesheets/:timesheet_id/timeunits',
      params: {
        user_id: '@user_id',
        timesheet_id: '@timesheet_id'
      }
    });
  });
