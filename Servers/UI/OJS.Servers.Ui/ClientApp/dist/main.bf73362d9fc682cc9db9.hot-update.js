webpackHotUpdate("main",{

/***/ "./src/components/contests/submission-box/SubmissionBox.tsx":
/*!******************************************************************!*\
  !*** ./src/components/contests/submission-box/SubmissionBox.tsx ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator/index.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../guidelines/headings/Heading */ "./src/components/guidelines/headings/Heading.tsx");
/* harmony import */ var _code_editor_CodeEditor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../code-editor/CodeEditor */ "./src/components/code-editor/CodeEditor.tsx");
/* harmony import */ var _guidelines_lists_List__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../guidelines/lists/List */ "./src/components/guidelines/lists/List.tsx");
/* harmony import */ var _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../guidelines/buttons/Button */ "./src/components/guidelines/buttons/Button.tsx");
/* harmony import */ var _execution_type_selector_ExecutionTypeSelector__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../execution-type-selector/ExecutionTypeSelector */ "./src/components/contests/execution-type-selector/ExecutionTypeSelector.tsx");
/* harmony import */ var _hooks_submissions_use_submissions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../hooks/submissions/use-submissions */ "./src/hooks/submissions/use-submissions.tsx");
/* harmony import */ var _hooks_use_problems__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../hooks/use-problems */ "./src/hooks/use-problems.tsx");
/* harmony import */ var _SubmissionBox_module_scss__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./SubmissionBox.module.scss */ "./src/components/contests/submission-box/SubmissionBox.module.scss");
/* harmony import */ var _SubmissionBox_module_scss__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_SubmissionBox_module_scss__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _utils_class_names__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../utils/class-names */ "./src/utils/class-names.ts");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_13__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);



var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\contests\\submission-box\\SubmissionBox.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature();
















var SubmissionBox = function SubmissionBox() {
  _s();

  var _useSubmissions = Object(_hooks_submissions_use_submissions__WEBPACK_IMPORTED_MODULE_9__["useSubmissions"])(),
      selectSubmissionTypeById = _useSubmissions.actions.selectSubmissionTypeById;

  var _useSubmissions2 = Object(_hooks_submissions_use_submissions__WEBPACK_IMPORTED_MODULE_9__["useSubmissions"])(),
      _useSubmissions2$stat = _useSubmissions2.state,
      submissionCode = _useSubmissions2$stat.submissionCode,
      selectedSubmissionType = _useSubmissions2$stat.selectedSubmissionType,
      _useSubmissions2$acti = _useSubmissions2.actions,
      submit = _useSubmissions2$acti.submit,
      updateSubmissionCode = _useSubmissions2$acti.updateSubmissionCode;

  var _useProblems = Object(_hooks_use_problems__WEBPACK_IMPORTED_MODULE_10__["useProblems"])(),
      currentProblem = _useProblems.state.currentProblem;

  var _ref = currentProblem || {},
      allowedSubmissionTypes = _ref.allowedSubmissionTypes;

  var handleCodeChanged = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (newValue) {
    updateSubmissionCode(newValue);
  }, [updateSubmissionCode]);
  var handleSelectExecutionType = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (id) {
    selectSubmissionTypeById(id);
  }, [selectSubmissionTypeById]);
  var renderSubmissionTypesSelectors = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (submissionType) {
    var id = submissionType.id,
        name = submissionType.name;
    var isSelected = allowedSubmissionTypes && allowedSubmissionTypes.length === 1 ? true : submissionType.isSelectedByDefault;
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_13__["jsxDEV"])(_execution_type_selector_ExecutionTypeSelector__WEBPACK_IMPORTED_MODULE_8__["default"], {
      id: id,
      value: name,
      isSelected: isSelected,
      onSelect: function onSelect() {
        return handleSelectExecutionType(id);
      }
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 57,
      columnNumber: 17
    }, _this);
  }, [allowedSubmissionTypes, handleSelectExecutionType]);
  var renderSubmissionTypesSelectorsList = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function () {
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_3__["isNil"])(currentProblem)) {
      return null;
    }

    if (Object(lodash__WEBPACK_IMPORTED_MODULE_3__["isNil"])(allowedSubmissionTypes)) {
      return null;
    }

    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_13__["jsxDEV"])(_guidelines_lists_List__WEBPACK_IMPORTED_MODULE_6__["default"], {
      className: _SubmissionBox_module_scss__WEBPACK_IMPORTED_MODULE_11___default.a.submissionTypesList,
      values: allowedSubmissionTypes,
      itemFunc: renderSubmissionTypesSelectors,
      orientation: _guidelines_lists_List__WEBPACK_IMPORTED_MODULE_6__["Orientation"].horizontal,
      wrap: true
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 79,
      columnNumber: 17
    }, _this);
  }, [allowedSubmissionTypes, currentProblem, renderSubmissionTypesSelectors]);
  var handleOnSubmit = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])( /*#__PURE__*/Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee() {
    return C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return submit();

          case 2:
            updateSubmissionCode('');

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })), [submit, updateSubmissionCode]);
  var taskText = 'Task: ';
  var executionTypeListClass = 'executionTypeLis';
  var executionTypeListClassName = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_12__["default"])(_SubmissionBox_module_scss__WEBPACK_IMPORTED_MODULE_11___default.a.executionTypeSelectors, executionTypeListClass);
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_13__["jsxDEV"])("div", {
    className: _SubmissionBox_module_scss__WEBPACK_IMPORTED_MODULE_11___default.a.contestMainWrapper,
    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_13__["jsxDEV"])(_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_4__["default"], {
      type: _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_4__["HeadingType"].secondary,
      className: _SubmissionBox_module_scss__WEBPACK_IMPORTED_MODULE_11___default.a.heading,
      children: [taskText, /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_13__["jsxDEV"])("span", {
        className: _SubmissionBox_module_scss__WEBPACK_IMPORTED_MODULE_11___default.a.taskName,
        children: currentProblem === null || currentProblem === void 0 ? void 0 : currentProblem.name
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 110,
        columnNumber: 17
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 105,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_13__["jsxDEV"])("div", {
      className: _SubmissionBox_module_scss__WEBPACK_IMPORTED_MODULE_11___default.a.contestInnerLayout,
      children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_13__["jsxDEV"])("div", {
        className: _SubmissionBox_module_scss__WEBPACK_IMPORTED_MODULE_11___default.a.editorAndProblemControlsWrapper,
        children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_13__["jsxDEV"])(_code_editor_CodeEditor__WEBPACK_IMPORTED_MODULE_5__["default"], {
          selectedSubmissionType: selectedSubmissionType,
          code: submissionCode,
          onCodeChange: handleCodeChanged
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 116,
          columnNumber: 21
        }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_13__["jsxDEV"])("div", {
          className: _SubmissionBox_module_scss__WEBPACK_IMPORTED_MODULE_11___default.a.contestSubmitControlsWrapper,
          children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_13__["jsxDEV"])("div", {
            className: executionTypeListClassName,
            children: renderSubmissionTypesSelectorsList()
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 122,
            columnNumber: 25
          }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_13__["jsxDEV"])("div", {
            className: _SubmissionBox_module_scss__WEBPACK_IMPORTED_MODULE_11___default.a.submitButtonContainer,
            children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_13__["jsxDEV"])(_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_7__["Button"], {
              text: "Submit",
              onClick: handleOnSubmit
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 126,
              columnNumber: 29
            }, _this)
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 125,
            columnNumber: 25
          }, _this)]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 121,
          columnNumber: 21
        }, _this)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 115,
        columnNumber: 17
      }, _this)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 114,
      columnNumber: 13
    }, _this)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 104,
    columnNumber: 9
  }, _this);
};

_s(SubmissionBox, "+I2VWH9DwGBENd+VS6ODehMpa7Q=", false, function () {
  return [_hooks_submissions_use_submissions__WEBPACK_IMPORTED_MODULE_9__["useSubmissions"], _hooks_submissions_use_submissions__WEBPACK_IMPORTED_MODULE_9__["useSubmissions"], _hooks_use_problems__WEBPACK_IMPORTED_MODULE_10__["useProblems"]];
});

_c = SubmissionBox;
/* harmony default export */ __webpack_exports__["default"] = (SubmissionBox);

var _c;

__webpack_require__.$Refresh$.register(_c, "SubmissionBox");

const currentExports = __react_refresh_utils__.getModuleExports(module.i);
__react_refresh_utils__.registerExportsForReactRefresh(currentExports, module.i);

if (true) {
  const isHotUpdate = !!module.hot.data;
  const prevExports = isHotUpdate ? module.hot.data.prevExports : null;

  if (__react_refresh_utils__.isReactRefreshBoundary(currentExports)) {
    module.hot.dispose(
      /**
       * A callback to performs a full refresh if React has unrecoverable errors,
       * and also caches the to-be-disposed module.
       * @param {*} data A hot module data object from Webpack HMR.
       * @returns {void}
       */
      function hotDisposeCallback(data) {
        // We have to mutate the data object to get data registered and cached
        data.prevExports = currentExports;
      }
    );
    module.hot.accept(
      /**
       * An error handler to allow self-recovering behaviours.
       * @param {Error} error An error occurred during evaluation of a module.
       * @returns {void}
       */
      function hotErrorHandler(error) {
        if (
          typeof __react_refresh_error_overlay__ !== 'undefined' &&
          __react_refresh_error_overlay__
        ) {
          __react_refresh_error_overlay__.handleRuntimeError(error);
        }

        if (typeof __react_refresh_test__ !== 'undefined' && __react_refresh_test__) {
          if (window.onHotAcceptError) {
            window.onHotAcceptError(error.message);
          }
        }

        __webpack_require__.c[module.i].hot.accept(hotErrorHandler);
      }
    );

    if (isHotUpdate) {
      if (
        __react_refresh_utils__.isReactRefreshBoundary(prevExports) &&
        __react_refresh_utils__.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)
      ) {
        module.hot.invalidate();
      } else {
        __react_refresh_utils__.enqueueUpdate(
          /**
           * A function to dismiss the error overlay after performing React refresh.
           * @returns {void}
           */
          function updateCallback() {
            if (
              typeof __react_refresh_error_overlay__ !== 'undefined' &&
              __react_refresh_error_overlay__
            ) {
              __react_refresh_error_overlay__.clearRuntimeErrors();
            }
          }
        );
      }
    }
  } else {
    if (isHotUpdate && __react_refresh_utils__.isReactRefreshBoundary(prevExports)) {
      module.hot.invalidate();
    }
  }
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js"), __webpack_require__(/*! ./node_modules/react-dev-utils/refreshOverlayInterop.js */ "./node_modules/react-dev-utils/refreshOverlayInterop.js")))

/***/ })

})
//# sourceMappingURL=main.bf73362d9fc682cc9db9.hot-update.js.map