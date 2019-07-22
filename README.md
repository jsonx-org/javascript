# JSONx Framework for JavaScript

## Abstract

The <ins>JSONx Framework</ins> is a collection of specifications and reference implementations that provide <ins>structural</ins> and <ins>functional</ins> patterns intended to help developers work with JSON. The <ins>JSONx Framework</ins> defines the [<ins>JSON Schema Definition Language</ins>][schema], which is a <ins>schema language</ins> designed in close resemblance to the [XMLSchema][xmlschema] specification.

This document introduces the <ins>JSONx Framework</ins>, and presents a directory of links to its constituent parts and related resources.

### Note

_The <ins>JSONx Framework for JavaScript</ins> is work in progress, and does not yet have a functional implementation. The [<ins>JSONx Framework for Java</ins>][java], however, is fully implemented, offering a complete solution for the full spec of the [<ins>JSON Schema Definition Language</ins>][schema]._

## Table of Contents

<samp>&nbsp;&nbsp;</samp>1 [Introduction](#1-introduction)<br>
<samp>&nbsp;&nbsp;&nbsp;&nbsp;</samp>1.1 [Conventions Used in This Document](#11-conventions-used-in-this-document)<br>
<samp>&nbsp;&nbsp;</samp>2 [<ins>JSON Schema Definition Language</ins>][#jsd]<br>
<samp>&nbsp;&nbsp;&nbsp;&nbsp;</samp>2.1 [Purpose](#21-purpose)<br>
<samp>&nbsp;&nbsp;&nbsp;&nbsp;</samp>2.2 [Requirements](#22-requirements)<br>
<samp>&nbsp;&nbsp;&nbsp;&nbsp;</samp>2.3 [Getting Started](#23-getting-started)<br>
<samp>&nbsp;&nbsp;&nbsp;&nbsp;</samp>2.4 [Specification](#24-specification)<br>
<samp>&nbsp;&nbsp;</samp>3 [<ins>Document Validation</ins>](#3-document-validation)<br>
<samp>&nbsp;&nbsp;&nbsp;&nbsp;</samp>3.1 [Purpose](#31-purpose)<br>
<samp>&nbsp;&nbsp;&nbsp;&nbsp;</samp>3.2 [Requirements](#32-requirements)<br>
<samp>&nbsp;&nbsp;&nbsp;&nbsp;</samp>3.3 [Getting Started](#33-getting-started)<br>
<samp>&nbsp;&nbsp;&nbsp;&nbsp;</samp>3.4 [Specification](#34-specification)<br>
<samp>&nbsp;&nbsp;</samp>4 [Contributing](#4-contributing)<br>
<samp>&nbsp;&nbsp;</samp>5 [License](#5-license)

## 1 Introduction

The <ins>JSONx Framework</ins> was created to help developers address common problems and use-cases when working with JSON. The <ins>JSONx Framework</ins> offers <ins>structural</ins> and <ins>functional</ins> patterns that systematically reduce errors and pain-points commonly encountered when developing software that interfaces with JSON. The <ins>structural</ins> patterns are defined in the [<ins>JSON Schema Definition Language</ins>][schema], which is a programming-language-agnostic <ins>schema language</ins> to describe constraints and document the meaning, usage and relationships of the constituent parts of JSON documents. The <ins>functional</ins> patterns are reference implementations (on the Java platform) of the specification of the <ins>schema language</ins>, providing utilities that address common use-cases for applications that use JSON in one way or another. Common use-cases include:

1. Definition of a normative contract between a producer and consumer of JSON documents.
1. Validation of JSON documents conforming to a respective <ins>schema document</ins>.
1. Java class binding capabilities for JSON documents conforming to a respective <ins>schema document</ins>.

### 1.1 Conventions Used in This Document

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119](https://www.ietf.org/rfc/rfc2119.txt).

## 2 <ins>JSON Schema Definition Language</ins>

Describes JSON documents using schema components to constrain and document the meaning, usage and relationships of their constituent parts: value types and their content.

### 2.1 Purpose

Provide a <ins>schema language</ins> to describe normative contracts between producer and consumer ends of a protocol exchanging JSON documents.

### 2.2 Requirements

1. The <ins>schema language</ins> MUST constrain and document the meaning, usage, constraints and relationships of the constituent parts of a JSON document.

1. The <ins>schema language</ins> MUST provide meaningful and useful constraint rules for the 5 JSON value types:

   `boolean`, `number`, `string`, `object`, `array`.

1. The <ins>schema language</ins> MUST support schema descriptions for any and all legal JSON documents, as specified by [RFC2119](https://www.ietf.org/rfc/rfc2119.txt).

1. The <ins>schema language</ins> MUST be free-of and agnostic-to patterns specific to any particular programming language.

1. The <ins>schema language</ins> MUST be able to describe itself.

### 2.3 Getting Started

The <ins>JSON Schema Definition Language</ins> can be expressed in 2 forms: <ins>JSD (Json Schema Document)</ins>, and <ins>JSDx (JSD in XML semantics)</ins>.

1. Create `schema.jsd` with the following content:

   ```json
   {
     "jx:ns": "http://www.jsonx.org/schema-0.3.jsd",
     "jx:schemaLocation": "http://www.jsonx.org/schema-0.3.jsd http://www.jsonx.org/schema.jsd",

     "myNumber": { "jx:type": "number", "range": "[-1,1)" },
     "myString": { "jx:type": "string", "pattern": "[a-z]+" },
     "myObject": {
       "jx:type": "object", "properties": {
         "myArray": {
           "jx:type": "array", "elements": [
             { "jx:type": "boolean" },
             { "jx:type": "reference", "type": "myNumber" },
             { "jx:type": "reference", "type": "myString" },
             { "jx:type": "array", "elements": [
               { "jx:type": "boolean" },
               { "jx:type": "number", "form": "integer", "range": "[0,100]" },
               { "jx:type": "string", "pattern": "[0-9]+" },
               { "jx:type": "any", "types": "myNumber myString" } ]},
           { "jx:type": "reference", "type": "myObject" },
           { "jx:type": "any", "types": "myString myObject" }]
         }
       }
     }
   }
   ```

   This example defines a schema with 3 types that express the following structure:

   1. Type **`myNumber`**: A `number` between the range -1 (inclusive) and 1 (exclusive).
   1. Type **`myString`**: A `string` with the regex patter "[a-z]+".
   1. Type **`myObject`**: An `object` that has one property:
      1. "myArray": An `array` that defines a sequence of elements:
         1. `boolean`
         1. **`myNumber`**
         1. **`myString`**
         1. An `array` with the following elements:
            1. `boolean`
            1. An integer `number` between 0 and 100.
            1. A `string` of pattern "[0-9]+"
            1. Either **`myNumber`** or **`myString`**.
         1. `myObject`
         1. Either **`myString`** or **`myObject`**.

1. **(Alternatively)** Can create an equivalent `schema.jsdx`:

   <sub>_**Note:** You can use the [Converter][#converter] utility to automatically convert between <ins>JSD</ins> and <ins>JSDx</ins>._</sub>

   ```xml
   <schema
     xmlns="http://www.jsonx.org/schema-0.3.xsd"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.jsonx.org/schema-0.3.xsd http://www.jsonx.org/schema.xsd">

     <number name="myNumber" range="[-1,1)"/>
     <string name="myString" pattern="[a-z]+"/>
     <object name="myObject">
       <property name="myArray" xsi:type="array">
         <boolean/>
         <reference type="myNumber"/>
         <reference type="myString"/>
         <array>
           <boolean/>
           <number form="integer" range="[0,100]"/>
           <string pattern="[0-9]+"/>
           <any types="myNumber myString"/>
         </array>
         <reference type="myObject"/>
         <any types="myString myObject"/>
       </property>
     </object>

   </schema>
   ```

   The <ins>JSDx</ins> format offers XML validation, and using [oXygen XML Editor][oxygenxml] offers edit-time XML validation, such as:

   <img src="https://user-images.githubusercontent.com/1258414/57699744-b8bb6800-7658-11e9-93bb-8d606c9727cf.png" width="75%">

   When using the <ins>JSDx</ins> format with the [oXygen XML Editor][oxygenxml], the auto-completion features of the editor will guide you in writing the schema. With the <ins>JSDx</ins> format, the XML editor will also validate keys and keyrefs to ensure that declared types are referenced correctly.

### 2.4 Specification

_For a detailed specification of the <ins>schema language</ins>, see **[<ins>JSON Schema Definition Language</ins>][schema]**._

## 3 <ins>Document Validation</ins>

Provide a way for JSON documents whose structure is expressed in the [<ins>JSON Schema Definition Language</ins>][schema] to be <ins>validated</ins>.

### 3.1 Purpose

Provide a <ins>Validator</ins> for the validation of JSON documents against a JSD or JSDx.

### 3.2 Requirements

1. The <ins>Validator</ins> MUST support the full scope of the [<ins>JSON Schema Definition Language</ins>][schema].

1. The <ins>Validator</ins> MUST produce clear and useful error messages that identify the exact location of the error when validation errors are encountered.

1. The <ins>Validator</ins> MUST be interoperable in Node.js and the browser.

1. The <ins>Validator</ins> MUST be straightforward, intuitive, and resilient to human error.

### 3.3 Getting Started

Coming soon.

### 3.4 Specification

Coming soon.

## 4 Contributing

Pull requests are welcome. For major changes, please [open an issue](../../issues) first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## 5 License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.

[#converter]: #532-converter
[#jsd]: #3-json-schema-definition-language

[java]: ../../../java
[oxygenxml]: https://www.oxygenxml.com/xml_editor/download_oxygenxml_editor.html
[schema]: ../../../schema
[xmlschema]: http://www.w3.org/2001/XMLSchema