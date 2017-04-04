'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const notify = require('../mailer');

const Schema = mongoose.Schema;

/**
 * Article Schema
 */

const electricityPaymentRowSchema = new Schema({
    areaNum: { type : String, default : '' },
    clientFirstName: { type : String, default : '', trim : true },
    clientMiddleName: { type : String, default : '', trim : true },
    clientLastName: { type : String, default : '', trim : true },
    phoneNum: { type : String, default : '' },
    counterModel: { type : String, default : '' },
    cost: { type : String, default : '' },
    periodRatesFrom: { type : String, default : '' },
    kvFrom: { type : String, default : '' },
    sumFrom: { type : String, default : '' },
    paidFrom: { type : String, default : '' },
    paymentDateFrom: { type : String, default : '' },
    debtFrom: { type : String, default : '' },
    periodRatesTo: { type : String, default : '' },
    kvTo: { type : String, default : '' },
    sumTo: { type : String, default : '' },
    paidTo: { type : String, default : '' },
    paymentDateTo: { type : String, default : '' },
    debtTo: { type : String, default : '' },
    user: { type : Schema.ObjectId, ref : 'User' },
    createdAt  : { type : Date, default : Date.now }
});

// areaNum clientFirstName clientMiddleName clientLastName phoneNum counterModel cost periodRatesFrom kvFrom sumFrom paidFrom paymentDateFrom debtFrom periodRatesTo kvTo sumTo paidTo paymentDateTo debtTo user createdAt
// for(var p in electricityPaymentRowSchema.paths){
//     electricityPaymentRowSchema.path(p).required(true);
// }


/**
 * Validations
 */

electricityPaymentRowSchema.path('clientFirstName').required(true, 'electricityPaymentRow clientFirstName cannot be blank');
electricityPaymentRowSchema.path('clientMiddleName').required(true, 'electricityPaymentRow clientMiddleName cannot be blank');
electricityPaymentRowSchema.path('clientLastName').required(true, 'electricityPaymentRow clientLastName cannot be blank');

/**
 * Pre-remove hook
 */

electricityPaymentRowSchema.pre('remove', function (next) {
    next();
});

/**
 * Methods
 */

electricityPaymentRowSchema.methods = {
    
    /**
     * Save article and upload image
     *
     * @param {Object} images
     * @api private
     */
    
    uploadAndSave: function (image) {
        const err = this.validateSync();
        if (err && err.toString()) throw new Error(err.toString());
        return this.save();
    }
    
};

/**
 * Statics
 */

electricityPaymentRowSchema.statics = {
    
    /**
     * Find article by id
     *
     * @param {ObjectId} id
     * @api private
     */
    
    load: function (_id) {
        return this.findOne({ _id })
            .populate('user', 'name email username')
            .populate('comments.user')
            .exec();
    },
    
    /**
     * List articles
     *
     * @param {Object} options
     * @api private
     */
    
    list: function (options) {
        const criteria = options.criteria || {};
        const page = options.page || 0;
        const limit = options.limit || 30;
        return this.find(criteria)
            .populate('user', 'name username')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * page)
            .exec();
    }
};

mongoose.model('ElectricityPaymentRow', electricityPaymentRowSchema);
