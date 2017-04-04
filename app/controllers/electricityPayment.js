'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const only = require('only');
const { respond, respondOrRedirect } = require('../utils');
const ElectricityPaymentRow = mongoose.model('ElectricityPaymentRow');
const assign = Object.assign;

/**
 * Load
 */

exports.load = async(function* (req, res, next, electricityPaymentId) {
    try {
        req.electricityPaymentRow = yield ElectricityPaymentRow.load(electricityPaymentId);
        if (!req.electricityPaymentRow) return next(new Error('electricityPaymentRow not found'));
    } catch (err) {
        return next(err);
    }
    next();
});

/**
 * List
 */

exports.index = async(function* (req, res) {
    const page = (req.query.page > 0 ? req.query.page : 1) - 1;
    const _id = req.query.item;
    const limit = 30;
    const options = {
        limit: limit,
        page: page
    };
    
    if (_id) options.criteria = { _id };
    
    const electricityPayment = yield ElectricityPaymentRow.list(options);
    const count = yield ElectricityPaymentRow.count();
    
    respond(res, 'electricityPayment/index', {
        title: 'Облік використання та оплати електроенергії',
        electricityPayment: electricityPayment,
        page: page + 1,
        pages: Math.ceil(count / limit)
    });
});

/**
 * New electricityPaymentRow
 */

exports.new = function (req, res){
    res.render('electricityPayment/new', {
        title: 'New electricityPaymentRow',
        electricityPaymentRow: new ElectricityPaymentRow()
    });
};

/**
 * Create an electricityPaymentRow
 *
 * Upload an image
 */

exports.create = async(function* (req, res) {
    const electricityPaymentRow = new ElectricityPaymentRow(only(req.body, 'areaNum clientFirstName clientMiddleName clientLastName phoneNum counterModel cost periodRatesFrom kvFrom sumFrom paidFrom paymentDateFrom debtFrom periodRatesTo kvTo sumTo paidTo paymentDateTo debtTo user createdAt'));
    electricityPaymentRow.user = req.user;
    try {
        yield electricityPaymentRow.uploadAndSave(req.file);
        respondOrRedirect({ req, res }, `/electricityPayment/${electricityPaymentRow._id}`, electricityPaymentRow, {
            type: 'success',
            text: 'Successfully created electricityPaymentRow!'
        });
    } catch (err) {
        respond(res, 'electricityPayment/new', {
            title: electricityPaymentRow.clientFirstName || 'New electricityPaymentRow',
            errors: [err.toString()],
            electricityPaymentRow
        }, 422);
    }
});

/**
 * Edit an electricityPaymentRow
 */

exports.edit = function (req, res) {
    res.render('electricityPayment/edit', {
        title: 'Edit ' + req.electricityPaymentRow.clientFirstName,
        electricityPaymentRow: req.electricityPaymentRow
    });
};

/**
 * Update electricityPaymentRow
 */

exports.update = async(function* (req, res){
    const electricityPaymentRow = req.electricityPaymentRow;
    assign(electricityPaymentRow, only(req.body, 'areaNum clientFirstName clientMiddleName clientLastName phoneNum counterModel cost periodRatesFrom kvFrom sumFrom paidFrom paymentDateFrom debtFrom periodRatesTo kvTo sumTo paidTo paymentDateTo debtTo user createdAt'));
    try {
        yield electricityPaymentRow.uploadAndSave(req.file);
        respondOrRedirect({ res }, `/electricityPayment/${electricityPaymentRow._id}`, electricityPaymentRow);
    } catch (err) {
        respond(res, 'electricityPayment/edit', {
            title: 'Edit ' + electricityPaymentRow.clientFirstName,
            errors: [err.toString()],
            electricityPaymentRow
        }, 422);
    }
});

/**
 * Show electricityPaymentRow
 */

exports.show = function (req, res){
    respond(res, 'electricityPayment/show', {
        title: req.electricityPaymentRow.clientFirstName,
        electricityPaymentRow: req.electricityPaymentRow
    });
};

/**
 * Delete an electricityPaymentRow
 */

exports.destroy = async(function* (req, res) {
    yield req.electricityPaymentRow.remove();
    respondOrRedirect({ req, res }, '/electricityPayment', {}, {
        type: 'info',
        text: 'Deleted successfully'
    });
});
