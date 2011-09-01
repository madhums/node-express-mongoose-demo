// strftime for CommonJS
//
// Based heavily on Philip S Tellis' version for client side javascript
// Copyright (c) 2008, Philip S Tellis <philip@bluesmoon.info>
// Copyright (c) 2010, James Smith <james@loopj.com>
//

function xPad(x, pad, r) {
  if(typeof(r) == 'undefined') {
    r=10;
  }

  for( ; parseInt(x, 10)<r && r>1; r/=10) 
    x = pad.toString() + x;

  return x.toString();
};

// Localised strings for English
var locales = {};
locales.en = {
  a: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  b: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  B: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  c: '%a %d %b %Y %T %Z',
  p: ['AM', 'PM'],
  P: ['am', 'pm'],
  x: '%d/%m/%y',
  X: '%T'
};

// Localised strings for US English
locales['en-US'] = locales.en;
locales['en-US'].c = '%a %d %b %Y %r %Z';
locales['en-US'].x = '%D';
locales['en-US'].X = '%r';

// Localised strings for British English
locales['en-GB'] = locales.en;

// Localised strings for Australian English
locales['en-AU'] = locales['en-GB'];

// List of supported format specifiers.
var formats = {
  a: function(d) { return locales[d.locale].a[d.getDay()]; },
  A: function(d) { return locales[d.locale].A[d.getDay()]; },
  b: function(d) { return locales[d.locale].b[d.getMonth()]; },
  B: function(d) { return locales[d.locale].B[d.getMonth()]; },
  c: 'toLocaleString',
  C: function(d) { return xPad(parseInt(d.getFullYear()/100, 10), 0); },
  d: ['getDate', '0'],
  e: ['getDate', ' '],
  g: function(d) { return xPad(parseInt(formats.G(d)/100, 10), 0); },
  G: function(d) {
      var y = d.getFullYear();
      var V = parseInt(formats.V(d), 10);
      var W = parseInt(formats.W(d), 10);

      if(W > V) {
        y++;
      } else if(W===0 && V>=52) {
        y--;
      }

      return y;
    },
  H: ['getHours', '0'],
  I: function(d) { var I=d.getHours()%12; return xPad(I===0?12:I, 0); },
  j: function(d) {
      var ms = d - new Date('' + d.getFullYear() + '/1/1 GMT');
      ms += d.getTimezoneOffset()*60000;
      var doy = parseInt(ms/60000/60/24, 10)+1;
      return xPad(doy, 0, 100);
    },
  l: function (d) { var l=d.getHours()%12; return xPad(l==0?12:l,' ')},
  m: function(d) { return xPad(d.getMonth()+1, 0); },
  M: ['getMinutes', '0'],
  p: function(d) { return locales[d.locale].p[d.getHours() >= 12 ? 1 : 0 ]; },
  P: function(d) { return locales[d.locale].P[d.getHours() >= 12 ? 1 : 0 ]; },
  S: ['getSeconds', '0'],
  u: function(d) { var dow = d.getDay(); return dow===0?7:dow; },
  U: function(d) {
      var doy = parseInt(formats.j(d), 10);
      var rdow = 6-d.getDay();
      var woy = parseInt((doy+rdow)/7, 10);
      return xPad(woy, 0);
    },
  V: function(d) {
      var woy = parseInt(formats.W(d), 10);
      var dow1_1 = (new Date('' + d.getFullYear() + '/1/1')).getDay();
      var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);
      if(idow == 53 && (new Date('' + d.getFullYear() + '/12/31')).getDay() < 4)
      {
        idow = 1;
      }
      else if(idow === 0)
      {
        idow = formats.V(new Date('' + (d.getFullYear()-1) + '/12/31'));
      }

      return xPad(idow, 0);
    },
  w: 'getDay',
  W: function(d) {
      var doy = parseInt(formats.j(d), 10);
      var rdow = 7-formats.u(d);
      var woy = parseInt((doy+rdow)/7, 10);
      return xPad(woy, 0, 10);
    },
  y: function(d) { return xPad(d.getFullYear()%100, 0); },
  Y: 'getFullYear',
  z: function(d) {
      var o = d.getTimezoneOffset();
      var H = xPad(parseInt(Math.abs(o/60), 10), 0);
      var M = xPad(o%60, 0);
      return (o>0?'-':'+') + H + M;
    },
  Z: function(d) { return d.toString().replace(/^.*\(([^)]+)\)$/, '$1'); },
  '%': function(d) { return '%'; }
};

// List of aggregate format specifiers.
var aggregates = {
  c: 'locale',
  D: '%m/%d/%y',
  h: '%b',
  n: '\n',
  r: '%I:%M:%S %p',
  R: '%H:%M',
  t: '\t',
  T: '%H:%M:%S',
  x: 'locale',
  X: 'locale'
};

// Formats the date according to the specified format
exports.strftime = function (d, fmt, locale) {
  d.locale = locale = locales[locale] ? locale : "en-US";

  // First replace aggregates
  while(fmt.match(/%[cDhnrRtTxXzZ]/)) {
    fmt = fmt.replace(/%([cDhnrRtTxXzZ])/g, function(m0, m1) {
      var f = aggregates[m1];
      return (f == 'locale' ? locales[locale][m1] : f);
    });
  }

  // Now replace formats - we need a closure so that the date object gets passed through
  var str = fmt.replace(/%([aAbBCdegGHIjlmMpPSuUVwWyY%])/g, function(m0, m1) {
    var f = formats[m1];
    if(typeof(f) == 'string') {
      return d[f]();
    } else if(typeof(f) == 'function') {
      return f.call(d, d);
    } else if(typeof(f) == 'object' && typeof(f[0]) == 'string') {
      return xPad(d[f[0]](), f[1]);
    } else {
      return m1;
    }
  });

  return str;
};