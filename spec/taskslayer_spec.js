'use strict';

describe('TaskSlayer', function() {
    it('should have a title', function() {
        browser.get('http://localhost/tasks');

        var now = element.all(by.binding('category.description')).get(0);

        expect(now.getText()).toBe('Now');
    });

});
