function assert(condition, message) {
  if (!condition)
    if (message)
      throw "Assertion failed: " + message;
    else
      throw "Assertion failed";
}


// analog of python dict.setdefault
function setDefault(obj, key, default_value) {
  if (!(key in obj)) {
    console.log('setDefault', key, default_value);
    obj[key] = default_value;
  }
  return obj[key];
}
