var i18n = require("i18n");
i18n.configure({
    locales:['en', 'de','tr'],
    register:global,
    directory:'./locales',
    extension:'.json',
    debug:false,
    verbose:false
});

module.exports = function (app) {

    app.configure(function () {
        app.use(i18n.init)
    })
    app.locals({
        __i: i18n.__,
        __n: i18n.__n
    });

    console.log(i18n.getLocale() + ' is using now')
    i18n.setLocale ('tr')
    console.log(i18n.getLocale() + ' is selected now')
}