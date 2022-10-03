(this["webpackJsonpjudge.servers.ui"] = this["webpackJsonpjudge.servers.ui"] || []).push([[7],{

/***/ "./node_modules/monaco-editor/esm/vs/basic-languages/python/python.js":
/*!****************************************************************************!*\
  !*** ./node_modules/monaco-editor/esm/vs/basic-languages/python/python.js ***!
  \****************************************************************************/
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

 // src/basic-languages/python/python.ts

var conf = {
  comments: {
    lineComment: "#",
    blockComment: ["'''", "'''"]
  },
  brackets: [["{", "}"], ["[", "]"], ["(", ")"]],
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
  }],
  surroundingPairs: [{
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
    close: '"'
  }, {
    open: "'",
    close: "'"
  }],
  onEnterRules: [{
    beforeText: new RegExp("^\\s*(?:def|class|for|if|elif|else|while|try|with|finally|except|async).*?:\\s*$"),
    action: {
      indentAction: monaco_editor_core_exports.languages.IndentAction.Indent
    }
  }],
  folding: {
    offSide: true,
    markers: {
      start: new RegExp("^\\s*#region\\b"),
      end: new RegExp("^\\s*#endregion\\b")
    }
  }
};
var language = {
  defaultToken: "",
  tokenPostfix: ".python",
  keywords: ["False", "None", "True", "and", "as", "assert", "async", "await", "break", "class", "continue", "def", "del", "elif", "else", "except", "exec", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal", "not", "or", "pass", "print", "raise", "return", "try", "while", "with", "yield", "int", "float", "long", "complex", "hex", "abs", "all", "any", "apply", "basestring", "bin", "bool", "buffer", "bytearray", "callable", "chr", "classmethod", "cmp", "coerce", "compile", "complex", "delattr", "dict", "dir", "divmod", "enumerate", "eval", "execfile", "file", "filter", "format", "frozenset", "getattr", "globals", "hasattr", "hash", "help", "id", "input", "intern", "isinstance", "issubclass", "iter", "len", "locals", "list", "map", "max", "memoryview", "min", "next", "object", "oct", "open", "ord", "pow", "print", "property", "reversed", "range", "raw_input", "reduce", "reload", "repr", "reversed", "round", "self", "set", "setattr", "slice", "sorted", "staticmethod", "str", "sum", "super", "tuple", "type", "unichr", "unicode", "vars", "xrange", "zip", "__dict__", "__methods__", "__members__", "__class__", "__bases__", "__name__", "__mro__", "__subclasses__", "__init__", "__import__"],
  brackets: [{
    open: "{",
    close: "}",
    token: "delimiter.curly"
  }, {
    open: "[",
    close: "]",
    token: "delimiter.bracket"
  }, {
    open: "(",
    close: ")",
    token: "delimiter.parenthesis"
  }],
  tokenizer: {
    root: [{
      include: "@whitespace"
    }, {
      include: "@numbers"
    }, {
      include: "@strings"
    }, [/[,:;]/, "delimiter"], [/[{}\[\]()]/, "@brackets"], [/@[a-zA-Z_]\w*/, "tag"], [/[a-zA-Z_]\w*/, {
      cases: {
        "@keywords": "keyword",
        "@default": "identifier"
      }
    }]],
    whitespace: [[/\s+/, "white"], [/(^#.*$)/, "comment"], [/'''/, "string", "@endDocString"], [/"""/, "string", "@endDblDocString"]],
    endDocString: [[/[^']+/, "string"], [/\\'/, "string"], [/'''/, "string", "@popall"], [/'/, "string"]],
    endDblDocString: [[/[^"]+/, "string"], [/\\"/, "string"], [/"""/, "string", "@popall"], [/"/, "string"]],
    numbers: [[/-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, "number.hex"], [/-?(\d*\.)?\d+([eE][+\-]?\d+)?[jJ]?[lL]?/, "number"]],
    strings: [[/'$/, "string.escape", "@popall"], [/'/, "string.escape", "@stringBody"], [/"$/, "string.escape", "@popall"], [/"/, "string.escape", "@dblStringBody"]],
    stringBody: [[/[^\\']+$/, "string", "@popall"], [/[^\\']+/, "string"], [/\\./, "string"], [/'/, "string.escape", "@popall"], [/\\$/, "string"]],
    dblStringBody: [[/[^\\"]+$/, "string", "@popall"], [/[^\\"]+/, "string"], [/\\./, "string"], [/"/, "string.escape", "@popall"], [/\\$/, "string"]]
  }
};


/***/ })

}]);
//# sourceMappingURL=7.chunk.js.map