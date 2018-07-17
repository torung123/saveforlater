var express = require('express');
var request = require('request');
var router = express.Router();
//load Modal customer
var customerModel = require('../modal/customers');

//get private key from myharavan website
var apikey = 'e73a5382d2811498f12064fd21776ed6';
var password = '49f059ffbc61914323fc084ccb7665a4';
var shopname = 'torungshop';
var baseurl = 'https://' + apikey + ':' + password + '@' + shopname + '.myharavan.com';

//hrv themes.json
router.get('/theme', (req, res) => {
        const createScriptTagUrl = baseurl + '/admin/themes.json';
        request.get({
            url: createScriptTagUrl,
            json: true
        }, function(error, response, body) {
            res.json(body.themes);
        });
    })
    //cài đặt snippet vào theme
router.get('/snippet', (req, res) => {
        const createthemeUrl = baseurl + '/admin/themes.json';
        request.get({
            url: createthemeUrl,
            json: true
        }, function(error, response, body) {
            var theme = body.themes;
            var themeid = '';
            for (var i = 0; i < theme.length; i++) {
                if (theme[i].role === 'main')
                    themeid = parseInt(theme[i].id);
            }
            if (themeid !== '') {
                const createAssetUrl = baseurl + '/admin/themes/' + themeid + '/assets.json';
                var shopRequestHeaders = {}
                const assetsBody = {
                    "asset": {
                        "key": "snippets/dokeapp1.liquid",
                        "value": "<div class='doke__app'></div>"
                    }
                }
                request.put({
                    url: createAssetUrl,
                    body: assetsBody,
                    headers: shopRequestHeaders,
                    json: true
                }, function(error, response, body) {
                    //res.send('Install snippet OK');
                    res.json(body);
                });
            } else {
                res.send('Lỗi cài snippet')
            }
        });
    })
    //cài đặt script xử lý phía front-end haravan
router.get('/loadscript', (req, res) => {
        const createScriptTagUrl = baseurl + '/admin/script_tags.json';
        var shopRequestHeaders = {}
        const scriptTagBody = {
            "script_tag": {
                "event": "onload",
                "src": "http:\/\/localhost:5001\/app\/scripts\/dokeapp.js"
            }
        }
        request.post({
            url: createScriptTagUrl,
            body: scriptTagBody,
            headers: shopRequestHeaders,
            json: true
        }, function(error, response, body) {
            res.send('Load script OK');
        });
    })
    // Xóa script tag
router.get('/deletescript', (req, res) => {
        const deleteScriptTagUrl = baseurl + '/admin/script_tags/1000038141.json';
        var shopRequestHeaders = {}
        request.delete({
            url: deleteScriptTagUrl,
            headers: shopRequestHeaders,
            json: true
        }, function(error, response, body) {
            res.send('Delete script OK');
        });
    })
    //get api from hrv to mongoDB
function fetchAPI_ToMongo(res) {
    request(baseurl + '/admin/customers.json', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var cus = JSON.parse(body);
            cus = cus.customers;
            //res.json(cus.customers);
            var customers = [];
            for (var i = 0; i < cus.length; i++) {
                var item = {};
                item.id = cus[i].id;
                item.first_name = cus[i].first_name;
                item.last_name = cus[i].last_name;
                item.email = cus[i].email;
                customers.push(item);
            }
        } else {
            console.log(error);
        }
    })
}
// load API customer into MongoDB - Run Once
router.get('/get-customers', (req, res) => {
    fetchAPI_ToMongo(res);
    res.redirect('/customers');
});

//API customer view from mongoDB -> /api/customers
router.get('/customers', (req, res) => {
    customerModel.find({}, function(err, data) {
        res.json(data);
    })
});
//POST customer from web to Mongo
router.post('/add', (req, res) => {
    var newCustomer = {
        'id': req.body.id,
        'first_name': req.body.first_name,
        'last_name': req.body.last_name,
        'products_wishlist': {
            'id': req.body.id,
            'handle': req.body.handle,
            'variant_id': req.body.handle
        }
    }
    var data = new customerModel(newCustomer);
    data.save();
});

//Update API
router.post('/update/:id', (req, res) => {
    var cus_id = req.params.id;
    var product_wishlist = req.body;
    //console.log(products_wishlist);

    // var query = { id: cus_id, products_wishlist: { $elemMatch: { id: { $ne: product_wishlist.id } } } };
    // customerModel.findOneAndUpdate(query, { $push: { products_wishlist: product_wishlist } }, { upsert: true },
    //     function(err, doc) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             res.send(doc);
    //         }
    //     }
    // );


    customerModel.findOne({ id: cus_id }, function(err, customer) {
        if (err) return console.error(err);

        if (!customer) {
            obj = {
                id: cus_id,
                products_wishlist: product_wishlist
            }
            var cusNew = new customerModel(obj)
            cusNew.save(function(err, data) {
                res.send({ method: 'create', error: err, data: data })
            })
        } else {
            var check = false;
            for (var i = 0; i < customer.products_wishlist.length; i++) {
                if (customer.products_wishlist[i] === product_wishlist.id) {
                    check = true;
                }
            }
            if (check === false) {
                customer.products_wishlist.push(product_wishlist);
                customer.save();
            }
        }
    });

})
module.exports = router;