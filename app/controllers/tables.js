'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const only = require('only');
const { respond, respondOrRedirect } = require('../utils');
const Table = mongoose.model('Table');
const assign = Object.assign;

/**
 * Load
 */

exports.load = async(function* (req, res, next, id) {
    try {
        req.table = yield Table.load(id);
        if (!req.table) return next(new Error('Table not found'));
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
    
    const tables = yield Table.list(options);
    const count = yield Table.count();
    
    respond(res, 'tables/index', {
        title: 'Tables',
        tables: tables,
        page: page + 1,
        pages: Math.ceil(count / limit)
    });
});

/**
 * New table
 */

exports.new = function (req, res){
    res.render('tables/new', {
        title: 'New Table',
        table: new Table()
    });
};

/**
 * Create an table
 *
 * Upload an image
 */

exports.create = async(function* (req, res) {
    const table = new Table(only(req.body, 'clientFirstName clientMiddleName clientLastName'));
    table.user = req.user;
    try {
        yield table.uploadAndSave(req.file);
        respondOrRedirect({ req, res }, `/tables/${table._id}`, table, {
            type: 'success',
            text: 'Successfully created table!'
        });
    } catch (err) {
        respond(res, 'tables/new', {
            title: table.clientFirstName || 'New Table',
            errors: [err.toString()],
            table
        }, 422);
    }
});

/**
 * Edit an article
 */

exports.edit = function (req, res) {
    res.render('tables/edit', {
        title: 'Edit ' + req.table.clientFirstName,
        table: req.table
    });
};

/**
 * Update article
 */

exports.update = async(function* (req, res){
    const table = req.table;
    assign(table, only(req.body, 'clientFirstName clientMiddleName clientLastName'));
    try {
        //yield table.uploadAndSave(req.file);
        respondOrRedirect({ res }, `/tables/${table._id}`, table);
    } catch (err) {
        respond(res, 'tables/edit', {
            title: 'Edit ' + table.clientFirstName,
            errors: [err.toString()],
            table
        }, 422);
    }
});

/**
 * Show
 */

exports.show = function (req, res){
    respond(res, 'tables/show', {
        title: req.table.clientFirstName,
        table: req.table
    });
};

/**
 * Delete an article
 */

exports.destroy = async(function* (req, res) {
    yield req.table.remove();
    respondOrRedirect({ req, res }, '/tables', {}, {
        type: 'info',
        text: 'Deleted successfully'
    });
});
