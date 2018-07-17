var mongoose = require('mongoose');

var customer = new mongoose.Schema({
    id: 'number',
    first_name: 'string',
    last_name: 'string',
    email: 'string',
    savelater_count: 'number',
    wishlist_count: 'number',
    products_savelater: [{
        id: 'number',
        handle: 'string',
        url: 'string',
        variant: [{
            variant_title: 'string',
            variant_id: 'number'
        }],
        image: 'string',
        date: {
            type: Date,
            default: Date.now
        }
    }],
    products_wishlist: [{
        id: 'number',
        handle: 'string',
        url: 'string',
        variant: [{
            variant_title: 'string',
            variant_id: 'number'
        }],
        image: 'string',
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    collection: 'customers'
});
module.exports = mongoose.model('customer', customer);