function StringBuilder() {
  var length = 0;
  const strings = [];

  this.append = function (string) {
    string = verify(string);
    if (string.length > 0) {
      strings[strings.length] = string;
      length += string.length;
    }

    return this;
  };

  this.clear = function () {
    strings.length = 0;
    length = 0;
  };

  this.length = function () {
    return length;
  };

  this.toString = function () {
    return strings.join("");
  };

  var verify = function (string) {
    if (!defined(string))
      return "";

    if (getType(string) != getType(new String()))
      return String(string);

    return string;
  };

  var defined = function (el) {
    return el != null && typeof(el) != "undefined";
  };

  var getType = function (instance) {
    if (!defined(instance.constructor))
      throw Error("Unexpected object type");

    const type = String(instance.constructor).match(/function\s+(\w+)/);
    return defined(type) ? type[1] : "undefined";
  };
};

exports.StringBuilder = StringBuilder;