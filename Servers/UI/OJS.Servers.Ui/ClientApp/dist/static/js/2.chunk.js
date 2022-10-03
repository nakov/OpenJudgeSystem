(this["webpackJsonpjudge.servers.ui"] = this["webpackJsonpjudge.servers.ui"] || []).push([[2],{

/***/ "./node_modules/monaco-editor/esm/vs/basic-languages/javascript/javascript.js":
/*!************************************************************************************!*\
  !*** ./node_modules/monaco-editor/esm/vs/basic-languages/javascript/javascript.js ***!
  \************************************************************************************/
/*! exports provided: conf, language */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "conf", function() { return conf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "language", function() { return language; });
/* harmony import */ var _typescript_typescript_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../typescript/typescript.js */ "./node_modules/monaco-editor/esm/vs/basic-languages/typescript/typescript.js");
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.32.1(29a273516805a852aa8edc5e05059f119b13eff0)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
// src/basic-languages/javascript/javascript.ts

var conf = _typescript_typescript_js__WEBPACK_IMPORTED_MODULE_0__["conf"];
var language = {
  defaultToken: "invalid",
  tokenPostfix: ".js",
  keywords: ["break", "case", "catch", "class", "continue", "const", "constructor", "debugger", "default", "delete", "do", "else", "export", "extends", "false", "finally", "for", "from", "function", "get", "if", "import", "in", "instanceof", "let", "new", "null", "return", "set", "super", "switch", "symbol", "this", "throw", "true", "try", "typeof", "undefined", "var", "void", "while", "with", "yield", "async", "await", "of"],
  typeKeywords: [],
  operators: _typescript_typescript_js__WEBPACK_IMPORTED_MODULE_0__["language"].operators,
  symbols: _typescript_typescript_js__WEBPACK_IMPORTED_MODULE_0__["language"].symbols,
  escapes: _typescript_typescript_js__WEBPACK_IMPORTED_MODULE_0__["language"].escapes,
  digits: _typescript_typescript_js__WEBPACK_IMPORTED_MODULE_0__["language"].digits,
  octaldigits: _typescript_typescript_js__WEBPACK_IMPORTED_MODULE_0__["language"].octaldigits,
  binarydigits: _typescript_typescript_js__WEBPACK_IMPORTED_MODULE_0__["language"].binarydigits,
  hexdigits: _typescript_typescript_js__WEBPACK_IMPORTED_MODULE_0__["language"].hexdigits,
  regexpctl: _typescript_typescript_js__WEBPACK_IMPORTED_MODULE_0__["language"].regexpctl,
  regexpesc: _typescript_typescript_js__WEBPACK_IMPORTED_MODULE_0__["language"].regexpesc,
  tokenizer: _typescript_typescript_js__WEBPACK_IMPORTED_MODULE_0__["language"].tokenizer
};


/***/ }),

/***/ "./node_modules/monaco-editor/esm/vs/basic-languages/typescript/typescript.js":
/*!************************************************************************************!*\
  !*** ./node_modules/monaco-editor/esm/vs/basic-languages/typescript/typescript.js ***!
  \************************************************************************************/
/*! exports provided: conf, language */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "conf", function() { return conf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "language", function() { return language; });
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_createForOfIteratorHelper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/createForOfIteratorHelper.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/createForOfIteratorHelper.js");
/* harmony import */ var _editor_editor_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../editor/editor.api.js */ "./include-loader!./node_modules/monaco-editor/esm/vs/editor/editor.api.js");
/* harmony import */ var _editor_editor_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_1__);


/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.32.1(29a273516805a852aa8edc5e05059f119b13eff0)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;

var __reExport = function __reExport(target, module, copyDefault, desc) {
  if (module && typeof module === "object" || typeof module === "function") {
    var _iterator = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_createForOfIteratorHelper_js__WEBPACK_IMPORTED_MODULE_0__["default"])(__getOwnPropNames(module)),
        _step;

    try {
      var _loop = function _loop() {
        var key = _step.value;
        if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default")) __defProp(target, key, {
          get: function get() {
            return module[key];
          },
          enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable
        });
      };

      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  return target;
}; // src/fillers/monaco-editor-core.ts


var monaco_editor_core_exports = {};

__reExport(monaco_editor_core_exports, _editor_editor_api_js__WEBPACK_IMPORTED_MODULE_1__);

 // src/basic-languages/typescript/typescript.ts

var conf = {
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"]
  },
  brackets: [["{", "}"], ["[", "]"], ["(", ")"]],
  onEnterRules: [{
    beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
    afterText: /^\s*\*\/$/,
    action: {
      indentAction: monaco_editor_core_exports.languages.IndentAction.IndentOutdent,
      appendText: " * "
    }
  }, {
    beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
    action: {
      indentAction: monaco_editor_core_exports.languages.IndentAction.None,
      appendText: " * "
    }
  }, {
    beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
    action: {
      indentAction: monaco_editor_core_exports.languages.IndentAction.None,
      appendText: "* "
    }
  }, {
    beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
    action: {
      indentAction: monaco_editor_core_exports.languages.IndentAction.None,
      removeText: 1
    }
  }],
  autoClosingPairs: [{
    open: "{",
    close: "}"
  }, {
    open: "[",
    close: "]"
  }, {
    open: "(",
    close: ")"
  }, {
    open: '"',
    close: '"',
    notIn: ["string"]
  }, {
    open: "'",
    close: "'",
    notIn: ["string", "comment"]
  }, {
    open: "`",
    close: "`",
    notIn: ["string", "comment"]
  }, {
    open: "/**",
    close: " */",
    notIn: ["string"]
  }],
  folding: {
    markers: {
      start: new RegExp("^\\s*//\\s*#?region\\b"),
      end: new RegExp("^\\s*//\\s*#?endregion\\b")
    }
  }
};
var language = {
  defaultToken: "invalid",
  tokenPostfix: ".ts",
  keywords: ["abstract", "any", "as", "asserts", "bigint", "boolean", "break", "case", "catch", "class", "continue", "const", "constructor", "debugger", "declare", "default", "delete", "do", "else", "enum", "export", "extends", "false", "finally", "for", "from", "function", "get", "if", "implements", "import", "in", "infer", "instanceof", "interface", "is", "keyof", "let", "module", "namespace", "never", "new", "null", "number", "object", "package", "private", "protected", "public", "override", "readonly", "require", "global", "return", "set", "static", "string", "super", "switch", "symbol", "this", "throw", "true", "try", "type", "typeof", "undefined", "unique", "unknown", "var", "void", "while", "with", "yield", "async", "await", "of"],
  operators: ["<=", ">=", "==", "!=", "===", "!==", "=>", "+", "-", "**", "*", "/", "%", "++", "--", "<<", "</", ">>", ">>>", "&", "|", "^", "!", "~", "&&", "||", "??", "?", ":", "=", "+=", "-=", "*=", "**=", "/=", "%=", "<<=", ">>=", ">>>=", "&=", "|=", "^=", "@"],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
  regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
  regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,
  tokenizer: {
    root: [[/[{}]/, "delimiter.bracket"], {
      include: "common"
    }],
    common: [[/[a-z_$][\w$]*/, {
      cases: {
        "@keywords": "keyword",
        "@default": "identifier"
      }
    }], [/[A-Z][\w\$]*/, "type.identifier"], {
      include: "@whitespace"
    }, [/\/(?=([^\\\/]|\\.)+\/([dgimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/, {
      token: "regexp",
      bracket: "@open",
      next: "@regexp"
    }], [/[()\[\]]/, "@brackets"], [/[<>](?!@symbols)/, "@brackets"], [/!(?=([^=]|$))/, "delimiter"], [/@symbols/, {
      cases: {
        "@operators": "delimiter",
        "@default": ""
      }
    }], [/(@digits)[eE]([\-+]?(@digits))?/, "number.float"], [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, "number.float"], [/0[xX](@hexdigits)n?/, "number.hex"], [/0[oO]?(@octaldigits)n?/, "number.octal"], [/0[bB](@binarydigits)n?/, "number.binary"], [/(@digits)n?/, "number"], [/[;,.]/, "delimiter"], [/"([^"\\]|\\.)*$/, "string.invalid"], [/'([^'\\]|\\.)*$/, "string.invalid"], [/"/, "string", "@string_double"], [/'/, "string", "@string_single"], [/`/, "string", "@string_backtick"]],
    whitespace: [[/[ \t\r\n]+/, ""], [/\/\*\*(?!\/)/, "comment.doc", "@jsdoc"], [/\/\*/, "comment", "@comment"], [/\/\/.*$/, "comment"]],
    comment: [[/[^\/*]+/, "comment"], [/\*\//, "comment", "@pop"], [/[\/*]/, "comment"]],
    jsdoc: [[/[^\/*]+/, "comment.doc"], [/\*\//, "comment.doc", "@pop"], [/[\/*]/, "comment.doc"]],
    regexp: [[/(\{)(\d+(?:,\d*)?)(\})/, ["regexp.escape.control", "regexp.escape.control", "regexp.escape.control"]], [/(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/, ["regexp.escape.control", {
      token: "regexp.escape.control",
      next: "@regexrange"
    }]], [/(\()(\?:|\?=|\?!)/, ["regexp.escape.control", "regexp.escape.control"]], [/[()]/, "regexp.escape.control"], [/@regexpctl/, "regexp.escape.control"], [/[^\\\/]/, "regexp"], [/@regexpesc/, "regexp.escape"], [/\\\./, "regexp.invalid"], [/(\/)([dgimsuy]*)/, [{
      token: "regexp",
      bracket: "@close",
      next: "@pop"
    }, "keyword.other"]]],
    regexrange: [[/-/, "regexp.escape.control"], [/\^/, "regexp.invalid"], [/@regexpesc/, "regexp.escape"], [/[^\]]/, "regexp"], [/\]/, {
      token: "regexp.escape.control",
      next: "@pop",
      bracket: "@close"
    }]],
    string_double: [[/[^\\"]+/, "string"], [/@escapes/, "string.escape"], [/\\./, "string.escape.invalid"], [/"/, "string", "@pop"]],
    string_single: [[/[^\\']+/, "string"], [/@escapes/, "string.escape"], [/\\./, "string.escape.invalid"], [/'/, "string", "@pop"]],
    string_backtick: [[/\$\{/, {
      token: "delimiter.bracket",
      next: "@bracketCounting"
    }], [/[^\\`$]+/, "string"], [/@escapes/, "string.escape"], [/\\./, "string.escape.invalid"], [/`/, "string", "@pop"]],
    bracketCounting: [[/\{/, "delimiter.bracket", "@bracketCounting"], [/\}/, "delimiter.bracket", "@pop"], {
      include: "common"
    }]
  }
};


/***/ })

}]);
//# sourceMappingURL=2.chunk.js.map