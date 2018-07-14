var express = require('express');
var router = express.Router();
var config = require('config');
var HaravanAPI = require('../HRVAPI');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Cài đặt App' });
});

router.get('/auth', function(req, res) {
    var shop = req.query.shop || '';
    var timestamp = req.query.timestamp || '';
    var signature = req.query.signature || '';

    var haravanApi = new HaravanAPI({
        shop: shop,
        haravan_api_key: config.Apps.apikey,
        haravan_shared_secret: config.Apps.apisecret,
        haravan_scope: config.Apps.scope,
        redirect_uri: config.Apps.redirect_uri,
        timestamp: timestamp,
        signature: signature,
        protocol: config.Apps.protocol
    });

    res.redirect(haravanApi.buildAuthURL());
});

router.get('/finalize', function(req, res) {
    var shop = req.query.shop || '';
    var timestamp = req.query.timestamp || '';
    var signature = req.query.signature || '';
    var code = req.query.code || '';

    var haravanApi = new HaravanAPI({
        shop: shop,
        haravan_api_key: config.Apps.apikey,
        haravan_shared_secret: config.Apps.apisecret,
        haravan_scope: config.Apps.scope,
        redirect_uri: config.Apps.redirect_uri,
        timestamp: timestamp,
        signature: signature,
        code: code,
        protocol: config.Apps.protocol
    });

    if (!haravanApi.check_security()) {
        return res.sendStatus(401);
    }

    haravanApi.getNewAccessToken(function(err, data) {
        if (err) {
            console.log(err);
            console.trace();

            return res.json({
                error: 'Something went wrong'
            });
        } else if (data && data.access_token) {
            haravanApi.config.access_token = data.access_token;
            //console.log(data.access_token);
            haravanApi.get('/admin/products.json?limit=10', function(err, data) {
                if (err) {
                    console.log(err);
                    console.trace();

                    return res.json({
                        error: 'Something went wrong'
                    });
                } else if (data && data.products && data.products.length) {
                    return res.json(data.products);
                } else {
                    return res.json({
                        error: 'None products'
                    });
                }
            });
        } else {
            return res.json({
                error: 'No access token'
            });
        }
    });
});

module.exports = router;