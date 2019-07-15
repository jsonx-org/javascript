var XML = require("xml-js");

function parseElement(element, parent) {
  var member = {
    "jx:type": element.name === "property" ? element.attributes["xsi:type"] : element.name
  };

  if (element.attributes.name)
    parent[element.attributes.name] = member;
  else
    parent.push(member);

  for (var key in element.attributes)
    if (key !== "xsi:type" && key !== "name")
      member[key] = element.attributes[key];

  if (!element.elements)
    return;
  
  if (member["jx:type"] === "array")
    member = member.elements = [];
  else if (member["jx:type"] === "object")
    member = member.properties = {};

  for (var i = 0; i < element.elements.length; ++i)
    parseElement(element.elements[i], member);
}

function parseSchema(element) {
  if (element.name !== "schema")
    throw Error("Unexpected element: " + JSON.stringify(element));

  var schema = {
    "jx:ns": "http://www.jsonx.org/schema-0.3.1.jsd",
    "jx:schemaLocation": "http://www.jsonx.org/schema-0.3.1.jsd http://www.jsonx.org/schema-0.3.1.jsd"
  };
  
  for (var i = 0; i < element.elements.length; ++i)
    parseElement(element.elements[i], schema);

  return schema;
}

function jsdxToJsd(jsdx) {
  var json = XML.xml2json(jsdx, {compact: false, spaces: 2});
  var object = JSON.parse(json);
  if (!object.elements[0])
    throw Error("Unexpected JSDx: " + jsdx);

  return parseSchema(object.elements[0]);
}

exports.jsdxToJsd = jsdxToJsd;