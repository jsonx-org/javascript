var {StringBuilder} = require("./StringBuilder");
var XML = require('xml-js');

function parseString(element, sb) {
  if (element.name !== "string" && (element.name !== "property" || element.attributes["xsi:type"] !== "string"))
    throw Error("This is not a string");

  sb.append('<xs:simpleType name="' + elem.attributes.name + '"><xs:restriction base="xs:string">');
  if (elem.attributes.pattern)
    sb.append('<xs:pattern value="&quot;' + elem.attributes.pattern + '&quot;"/>');

  sb.append('</xs:restriction></xs:simpleType>');
}

function parseElement(elem, sb) {
  if (elem.name === "schema") {
    sb.append('<xs:schema elementFormDefault="qualified" targetNamespace="foo" xmlns="foo" xmlns:xs="http://www.w3.org/2001/XMLSchema">');
    for (var i = 0; i < elem.elements.length; ++i)
      parseElement(elem.elements[i], sb);

    sb.append("</schema>");
  } else if (elem.name === "string") {
    if (elem.attributes.name) {
    }
    else {
      throw Error("this is an array.. finish this");
    }
  } else if (elem.name === "number") {
    if (elem.attributes.name) {
      sb.append('<xs:simpleType name="' + elem.attributes.name + '"><xs:restriction base="xs:decimal">');
      if (elem.attributes.range) {
        var minType = elem.attributes.range.charAt(0) === '[' ? "Inclusive" : "Exclusive";
        var maxType = elem.attributes.range.charAt(elem.attributes.range.length - 1) === ']' ? "Inclusive" : "Exclusive";
        var comma = elem.attributes.range.indexOf(",");
        var min = elem.attributes.range.substring(1, comma);
        var max = elem.attributes.range.substring(comma + 1, elem.attributes.range.length - 1);
        if (min.length() > 0)
          sb.append('<xs:min' + minType + ' value="' + parseFloat(min) + '"/>');
        if (max.length() > 0)
          sb.append('<xs:max' + maxType + ' value="' + parseFloat(max) + '"/>');
      }

      if (elem.attributes.scale) {
        sb.append('<xs:fractionDigits value="' + elem.attributes.scale + '"/>');
      }

      sb.append('</xs:restriction></xs:simpleType>');
    }
    else {
      throw Error("this is an array.. finish this");
    }
  } else if (elem.name === "boolean") {
    if (elem.attributes.name) {
      sb.append('<xs:simpleType name="' + elem.attributes.name + '"><xs:restriction base="xs:string"/></xs:simpleType>');
    }
    else {
      throw Error("this is an array.. finish this");
    }
  } else if (elem.name === "object") {
    if (elem.attributes.name) {
      sb.append('<xs:complexType name="' + elem.attributes.name + '"><xs:sequence>');
      for (var i = 0; i < elem.elements.length; ++i)
        parseElement(elem.elements[i], sb);

      if (elem.attributes.abstract !== "true")
        sb.append('<xs:element name="o" type="' + elem.attributes.name + '"/>');

      sb.append('</xs:sequence></xs:complexType>');
    }
    else {
      throw Error("this is an array.. finish this");
    }
  }
}

function jsdxToXsd(jsdx) {
  var data = XML.xml2json(jsdx, {compact: false, spaces: 2});
  var sb = new StringBuilder();
  parseElement(JSON.parse(data), sb);
  return sb.toString();
}

exports.jsdxToXsd = jsdxToXsd;