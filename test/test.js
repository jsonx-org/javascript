var assert = require('assert');
var fs = require("fs");

var paypalJson = String(fs.readFileSync("./test/paypal.json"));
var paypalJsdx = String(fs.readFileSync("./test/paypal.jsdx"));

var JsonXml = require('../src/JsonXml');
var JsdxToJsd = require('../src/JsdxToJsd');

describe('Array', function() {
  // describe('JsonToXml', function() {
  //   const expected = JSON.stringify(JSON.parse(paypalJson));
  //   it ('', function() {
  //     var xml = JsonXml.jsonToXml(expected);
  //     console.log(xml);
  //     var json = JsonXml.xmlToJson(xml);
  //     console.log(expected);
  //     assert.equal(expected, json);
  //   });
  // });
  describe('JsdxToJsd', function() {
    it ('', function() {
      var foo = JsdxToJsd.jsdxToJsd(paypalJsdx);
      console.log(JSON.stringify(foo, null, 2));
    });
  });
});