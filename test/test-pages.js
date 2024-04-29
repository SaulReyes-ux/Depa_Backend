var expect  = require('chai').expect;
var request = require('request');

it('Main page content', function(done) {
    request('tu-depa-47047.firebaseapp.com' , function(error, response, body) {
        done();
    });
});
