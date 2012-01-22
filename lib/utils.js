

exports.cloneObject = function cloneObject(obj) {
  var clone = {};
  for(var i in obj) {
    if(typeof(obj[i])=="object")
      clone[i] = this.cloneObject(obj[i]);
    else
      clone[i] = obj[i];
  }
  return clone;
}


exports.mergeRecursive = function (obj1, obj2) {
  for (var p in obj2)
    try {
      // Property in destination object set; update its value.
      if ( obj2[p].constructor==Object )
        obj1[p] = MergeRecursive(obj1[p], obj2[p]);
      else
        obj1[p] = obj2[p];
    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];
    }
  return obj1;
}


exports.capitalize = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.mongooseErrorHandler = function (err, req) {
  var errors = err.errors;
  for (var error in errors) {
    req.flash('error', errors[error].type);
  }
}

exports.sizeOfObject = function sizeOfObject(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
