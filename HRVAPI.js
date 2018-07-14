/**
 * Haravan OAuth2 node.js API
 *
 *
 *
 */
config = {
    haravan_api_key: '32b258ebca71c3b706d7e0ef37853b6d',
    haravan_shared_secret: 'e08d604dc658fcbc3f5aa2d628a2f151',
    haravan_scope: 'read_customers',
    redirect_uri: 'http://localhost:3000/finalize',
    code: 'di389so32hwh28923823dh3289329hdd',
    shop: 'torungshop.myharavan.com',
    timestamp: '1402539839',
    signature: '0132e77d7fb358ecd4645d86cfc39d27',
    access_token: "xsOvZ4JczVO4ODEVnZd66AGZlOa6eEqiCsT1KjIilOWcuOMaML-p0GDgqtWwEJaetbnytMBbr2MZi0RNjOUJYYxQ4sWTHoBIVW88qoyrq1yaED6KkCEAV3HtrW5fDCpxKL9xP25Rt-6CrNeMIqBUTMh2gBBHNEnPxXCpKByH52FQRZl0c3lF5vbD-c1x99JoYoM6rmNF42BSMqscsHW_8S4wItHz2u_lil01AJn-dU_ITY_kIRRAVYs_32QxB-TPXQJu04nkgrqXioslRGEgyPo_gKRKXdNiXmhm5jAF-BTOZCZHUDiakA6FvyIVvCizTUn4C4vfpdQOtXmntpuWmVh_ariBz4vDnnPuUm4ADoAIoDP4ucRIYK_fKP4m7QaG9bAspvvJEqKct3hMlKDwpYf4NloLwa-77p7JI9Ljp_11mdnSi1i-ILIZmFdv1ehkx4L9CpBYx6PU53obz3y5Y7_VCi0",
    verbose: true,
    port: 443,
    protocol: "https://"
};


var crypto = require('crypto');
var md5 = require('MD5');
var request = require('request');

function HaravanAPI(config) {

    if (!(this instanceof HaravanAPI)) return new HaravanAPI(config);

    if (config == null) { // == checks for null and undefined
        var msg = "HaravanAPI module expects a config object";
        throw new Error(msg);
    }

    this.config = config;

    //show console.log
    if (this.config.verbose !== false) {
        this.config.verbose = true;
    }

}

HaravanAPI.prototype.buildAuthURL = function() {
    var auth_url = this.config.protocol + this.config.shop;
    auth_url += "/admin/oauth/authorize?";
    auth_url += "client_id=" + this.config.haravan_api_key;
    auth_url += "&scope=" + this.config.haravan_scope;
    auth_url += "&redirect_uri=" + this.config.redirect_uri;
    auth_url += "&response_type=code";
    return auth_url;
};

HaravanAPI.prototype.set_access_token = function(token) {
    this.config.access_token = token;
};

HaravanAPI.prototype.conditional_console_log = function(msg) {
    if (this.config.verbose) {
        console.log(msg);
    }
};

HaravanAPI.prototype.check_security = function() {
    var shop = this.config.shop;
    var timestamp = this.config.timestamp;
    var signature = this.config.signature;
    var code = this.config.code;
    var secret = this.config.haravan_shared_secret;

    var signer = crypto.createHmac('sha256', secret);
    var str = '';
    if (code) str = 'code=' + code;

    str += 'shop=' + shop + 'timestamp=' + timestamp;

    var result = signer.update(str).digest('hex');

    if (result != signature) {
        return false;
    }
    return true;
};

//get access_token
HaravanAPI.prototype.exchange_temporary_token = function(query_params, callback) {
    var data = {
            client_id: this.config.haravan_api_key,
            client_secret: this.config.haravan_shared_secret,
            code: query_params['code']
        },
        self = this;
    this.makeRequest('/admin/oauth/access_token', 'POST', data, function(err, body) {

        if (err) return callback(new Error(err));

        self.set_access_token(body['access_token']);
        callback(null, body);

    });
};

HaravanAPI.prototype.hostname = function() {
    var host_name = this.config.shop;
    return host_name;
};

HaravanAPI.prototype.port = function() {
    if (this.config.port) {
        return this.config.port;
    }
    return 443;
};

HaravanAPI.prototype.makeRequest = function(endpoint, method, data, callback, retry) {
    var dataString = "";
    if (data) dataString = JSON.stringify(data);
    var self = this;
    var methodCall = method.toLowerCase();
    var options = {
        host: self.hostname(),
        path: endpoint,
        method: methodCall,
        headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + self.config.access_token
        },
        agent: false
    };

    if (self.config.protocol == "http://") {
        var protocol = require('http');
    } else {
        var protocol = require('https');
        options.port = self.port();
    }


    if (options.method === 'post' || options.method === 'put' || options.method === 'delete') {
        options.headers['Content-Length'] = new Buffer(dataString).length;
    }

    //self.logtime("start call api");
    var request = protocol.request(options, function(response) {
        self.conditional_console_log('STATUS: ' + response.statusCode);
        //self.conditional_console_log( 'HEADERS: ' + JSON.stringify(response.headers) );

        if (response.headers && response.headers.http_x_haravan_shop_api_call_limit) {
            self.conditional_console_log('API_LIMIT: ' + response.headers.http_x_haravan_shop_api_call_limit);
        }

        response.setEncoding('utf8');

        var body = '';

        response.on('data', function(chunk) {
            //self.conditional_console_log( 'BODY: ' + chunk );
            body += chunk;
        });

        response.on('end', function() {

            var delay = 0;

            // If the request is being rate limited by Haravan, try again after a delay
            if (response.statusCode === 429) {
                return setTimeout(function() {
                    self.makeRequest(endpoint, method, data, callback);
                }, self.config.rate_limit_delay || 10000);
            } else if (response.statusCode === 500 || response.statusCode === 404) {
                return callback({
                    error: 'HEADERS: ' + JSON.stringify(response.headers),
                    code: response.statusCode
                });
            } else {
                if (response.statusCode === 200 && self.has_header(response, 'http_x_haravan_shop_api_call_limit')) {
                    // If the backoff limit is reached, add a delay before executing callback function
                    var api_limit = parseInt(response.headers['http_x_haravan_shop_api_call_limit'].split('/')[0], 10);
                    if (api_limit >= (self.config.backoff || 35)) delay = self.config.backoff_delay || 1000; // in ms
                }
                setTimeout(function() {
                    try {
                        var json = {};
                        if (body.trim() != '') { //on some requests, Haravan retuns an empty body (several spaces)
                            json = JSON.parse(body);
                            if (json.hasOwnProperty('error') || json.hasOwnProperty('errors')) {
                                return callback({
                                    error: (json.error || json.errors),
                                    code: response.statusCode
                                });
                            }
                        }
                        //self.logtime("  response  at");
                        return callback(null, json, response.headers);
                    } catch (e) {
                        return callback({
                            error: 'HEADERS: ' + JSON.stringify(response.headers),
                            code: response.statusCode,
                            message: body
                        });
                    }
                }, delay); // Delay the callback if we reached the backoff limit
            }

        });

    });

    request.on('error', function(e) {
        self.conditional_console_log("Request Error: ", e);
        if (self.config.retry_errors && !retry) {
            var delay = self.config.error_retry_delay || 10000;
            self.conditional_console_log("retrying once in " + delay + " milliseconds");
            setTimeout(function() {
                self.makeRequest(endpoint, method, data, callback, true);
            }, delay);
        } else if ((e.code == 'ECONNREFUSED' || e.code == 'ECONNRESET') && !retry) {
            var delay = self.config.error_retry_delay || 3000;
            self.conditional_console_log("retrying once in " + delay + " milliseconds");
            setTimeout(function() {
                self.makeRequest(endpoint, method, data, callback, true);
            }, delay);
        } else {
            return callback(e);
        }
    });

    if (options.method === 'post' || options.method === 'put' || options.method === 'delete') {
        request.write(dataString);
    }

    request.end();
};

HaravanAPI.prototype.get = function(endpoint, callback) {
    data = null;
    this.makeRequest(endpoint, 'GET', data, callback);
};

HaravanAPI.prototype.post = function(endpoint, data, callback) {
    this.makeRequest(endpoint, 'POST', data, callback);
};

HaravanAPI.prototype.put = function(endpoint, data, callback) {
    this.makeRequest(endpoint, 'PUT', data, callback);
};

HaravanAPI.prototype.delete = function(endpoint, data, callback) {
    if (arguments.length < 3) {
        if (typeof data === 'function') {
            callback = data;
            data = null;
        } else {
            callback = new Function;
            data = typeof data === 'undefined' ? null : data;
        }
    }
    this.makeRequest(endpoint, 'DELETE', data, callback);
};

HaravanAPI.prototype.has_header = function(response, header) {
    return response.headers.hasOwnProperty(header) ? true : false;
};

HaravanAPI.prototype.logtime = function(logtext) {
    var logtime = Date.now();
    var dateEx = new Date(logtime);
    var time_gmt = dateEx.toLocaleString();
    logtext += ": " + logtime + " GMT: " + time_gmt;
    console.log(logtext);
    return;
};

//security v2 for user
HaravanAPI.prototype.generate_security_user = function(shop) {
    str = 'shop=' + shop + 'secret=' + this.config.haravan_shared_secret;
    var result = md5(str);
    return result;
};

HaravanAPI.prototype.check_security_user = function(shop, signature) {
    var result = this.generate_security_user(shop);
    if (result != signature) {
        return false;
    }
    return true;
};

//remove app
HaravanAPI.prototype.check_security_webhook = function(originalData, signature) {
    var secret = this.config.haravan_shared_secret;
    var signer = crypto.createHmac('sha256', secret);
    var result = signer.update(new Buffer(originalData, 'utf8')).digest('base64');

    if (result != signature) {
        return false;
    }
    return true;
};

//access_token
HaravanAPI.prototype.getNewAccessToken = function(callback) {
    var self = this;
    var url = self.config.protocol + self.hostname() + "/admin/oauth/access_token";
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var options = {
        url: url,
        method: 'POST',
        headers: headers,
        form: {
            'redirect_uri': self.config.redirect_uri,
            'client_id': self.config.haravan_api_key,
            'client_secret': self.config.haravan_shared_secret,
            'code': self.config.code,
            'grant_type': 'authorization_code'
        }
    };
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                var rs = JSON.parse(body);
                if (rs.access_token) {
                    callback(null, rs);
                } else {
                    callback(null);
                }
            } catch (e) {
                callback(e);
            }
        } else {
            callback(error);
        }
    });
};

//get new access_token by refresh_token
HaravanAPI.prototype.refreshAccessToken = function(refresh_token, callback) {
    var self = this;
    var url = self.config.protocol + self.hostname() + "/admin/oauth/access_token";
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var options = {
        url: url,
        method: 'POST',
        headers: headers,
        form: {
            'client_id': self.config.haravan_api_key,
            'client_secret': self.config.haravan_shared_secret,
            'refresh_token': refresh_token,
            'grant_type': 'refresh_token'
        }
    };
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                var rs = JSON.parse(body);
                if (rs.access_token) {
                    callback(null, rs);
                } else {
                    callback(null);
                }
            } catch (e) {
                callback(e);
            }
        } else {
            callback(error);
        }
    });
};

module.exports = HaravanAPI;