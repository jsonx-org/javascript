var {StringBuilder} = require("./StringBuilder");
var Base32 = require("./Base32");

function memberToXml(member, sb) {
  if (member === null) {
    sb.append("<z/>");
  } else {
    var type = typeof member;
    var ch0 = type.charAt(0);
    sb.append("<" + ch0 + ">" + member + "</" + ch0 + ">");
  }
}

function _jsonToXml(obj, sb) {
  if (obj.constructor === Array) {
    sb.append("<a>");
    for (var i = 0; i < obj.length; ++i) {
      var member = obj[i];
      var type = typeof member;
      if (member !== null && type === "object")
        _jsonToXml(member, sb);
      else
        memberToXml(member, sb);
    }

    sb.append("</a>");
  } else {
    var type = typeof obj;
    if (type === "object") {
      sb.append("<o>");
      for (var key in obj) {
        const name = "_" + Base32.encode(key);
        sb.append("<" + name + ">");
        _jsonToXml(obj[key], sb);
        sb.append("</" + name + ">");
      }

      sb.append("</o>");
    } else if (type === "string") {
      sb.append("\"" + obj + "\"");
    } else {
      sb.append(obj);
    }
  }
};

function jsonToXml(json) {
  var sb = new StringBuilder();
  var obj = JSON.parse(json);
  _jsonToXml(obj, sb);
  return sb.toString();
}

function xmlToJson(xml) {
  xml = xml.replace(/<o>/g, "{");
  xml = xml.replace(/,?<\/o>/g, "},");
  xml = xml.replace(/<a>/g, "[");
  xml = xml.replace(/,?<\/a>/g, "],");
  xml = xml.replace(/<_([^>]*)>/g, function (m1) {
    return "\"" + Base32.decode(m1) + "\":";
  });
  xml = xml.replace(/,?<\/_[^>]*>/g, ",");
  xml = xml.replace(/,+([}\]])/g, "$1");
  return xml.substring(0, xml.length - 1);
}

exports.jsonToXml = jsonToXml;
exports.xmlToJson = xmlToJson;