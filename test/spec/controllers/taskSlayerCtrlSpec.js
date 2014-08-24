/*jshint unused: vars */
define(['angular', 'angular-mocks', 'app'], function(angular, mocks, app) {
    'use strict';

    describe('Controller: taskSlayerCtrl', function () {

        // load the controller's module
        beforeEach(module('taskSlayerApp'));

        var taskSlayerCtrl, scope;

        // Initialize the controller and a mock scope
        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();

            taskSlayerCtrl = $controller('taskSlayerCtrl', {
                $scope: scope
            });

        }));

        it('should have an empty $scope.message', function () {
            expect(scope.message).toBe('');
        });

        it('can add tasks', function() {
            var category = {
                tasks: {
                    list: []
                }
            };

            scope.addTask(category);
            expect(category.tasks.list.length).toEqual(1);

            scope.addTask(category);
            expect(category.tasks.list.length).toEqual(2);


            var testTask = {description: 'test', done: true};
            console.log('============== in spec');
            console.log(scope);
            console.log(scope.dataModelService);
            spyOn(scope.dataModelService, 'SaveState').and.callThrough();
            scope.addTask(category, testTask);
            expect(category.tasks.list.length).toEqual(3);
            expect(category.tasks.list[2]).toEqual(testTask);
            expect(scope.dataModelService.SaveState).toHaveBeenCalled();
        });
  });
});
