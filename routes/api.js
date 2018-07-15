var express = require('express');
var router = express.Router();
var request = require('request');

var apikey = 'e73a5382d2811498f12064fd21776ed6';
var password = '49f059ffbc61914323fc084ccb7665a4';
var shopname = 'torungshop';
var baseurl = 'https://' + apikey + ':' + password + '@' + shopname + '.myharavan.com';

router.get('/customers', (req, res) => {
    // const customers = [
    //     { id: 1, firstName: 'John', lastName: 'Doe' },
    //     { id: 2, firstName: 'Brad', lastName: 'Traversy' },
    //     { id: 3, firstName: 'Mary', lastName: 'Swanson' },
    // ];

    //res.json(customers);

    request(baseurl + '/admin/customers.json', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var cus = JSON.parse(body)
            res.json(cus.customers);
        } else {
            console.log(error);
        }
    })
});

module.exports = router;