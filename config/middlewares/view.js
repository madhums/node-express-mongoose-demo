
/**
 * Pagination helper
 *
 * @param {Number} pages
 * @param {Number} page
 * @return {String}
 * @api private
 */

function createPagination (req) {
  return function createPagination (pages, page) {
    var url = require('url')
      , qs = require('querystring')
      , params = qs.parse(url.parse(req.url).query)
      , str = ''

    params.page = 0
    var clas = page == 0 ? "active" : "no"
    str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">First</a></li>'
    for (var p = 1; p < pages; p++) {
      params.page = p
      clas = page == p ? "active" : "no"
      str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">'+ p +'</a></li>'
    }
    params.page = --p
    clas = page == params.page ? "active" : "no"
    str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">Last</a></li>'

    return str
  }
}

/**
 * Format date helper
 *
 * @param {Date} date
 * @return {String}
 * @api private
 */

function formatDate (date) {
  var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec" ]
  return monthNames[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear()
}

/**
 * Strip script tags
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function stripScript (str) {
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}


module.exports = function (config) {
  return function (req, res, next) {
    res.locals.appName = config.app.name
    res.locals.title = 'Nodejs Express Mongoose Demo'
    res.locals.req = req
    res.locals.isActive = function (link) {
      return req.url === link ? 'active' : ''
    }
    res.locals.formatDate = formatDate
    res.locals.stripScript = stripScript
    res.locals.createPagination = createPagination(req)
    next()
  }
}
