/*jshint unused: vars */
define(['angular', 'angular-mocks', 'app'], function(angular, mocks, app) {
    'use strict';

    describe('Controller: taskSlayerCtrl: addTask()', function () {
        var taskSlayerCtrl, scope, rootScope;

        // load the controller's module
        beforeEach(module('taskSlayerApp'));

        // Initialize the controller and a mock scope
        beforeEach(inject(function ($controller, $rootScope) {
            rootScope = $rootScope;
            scope = $rootScope.$new();

            taskSlayerCtrl = $controller('taskSlayerCtrl', {
                $scope: scope
            });

        }));

        it('can add tasks', function() {
            var category = {
                tasks: {
                    list: []
                }
            };

            spyOn(rootScope, '$broadcast').and.callThrough();

            scope.addTask(category, undefined, false);
            expect(category.tasks.list.length).toEqual(1);
            expect(scope.$broadcast).not.toHaveBeenCalled();

            scope.addTask(category);
            expect(category.tasks.list.length).toEqual(2);
            expect(scope.$broadcast).toHaveBeenCalled();

            var testTask = {description: 'test', done: true};
            scope.addTask(category, testTask);
            expect(category.tasks.list.length).toEqual(3);
            expect(category.tasks.list[2]).toEqual(testTask);
        });
    });
});
