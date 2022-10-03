webpackHotUpdate("main",{

/***/ "./src/components/submissions/details/SubmissionDetails.tsx":
/*!******************************************************************!*\
  !*** ./src/components/submissions/details/SubmissionDetails.tsx ***!
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
/* harmony import */ var _hooks_submissions_use_submissions_details__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../hooks/submissions/use-submissions-details */ "./src/hooks/submissions/use-submissions-details.tsx");
/* harmony import */ var _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../guidelines/headings/Heading */ "./src/components/guidelines/headings/Heading.tsx");
/* harmony import */ var _code_editor_CodeEditor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../code-editor/CodeEditor */ "./src/components/code-editor/CodeEditor.tsx");
/* harmony import */ var _submission_results_SubmissionResults__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../submission-results/SubmissionResults */ "./src/components/submissions/submission-results/SubmissionResults.tsx");
/* harmony import */ var _utils_class_names__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../utils/class-names */ "./src/utils/class-names.ts");
/* harmony import */ var _submissions_list_RefreshableSubmissionsList__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../submissions-list/RefreshableSubmissionsList */ "./src/components/submissions/submissions-list/RefreshableSubmissionsList.tsx");
/* harmony import */ var _SubmissionDetails_module_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./SubmissionDetails.module.scss */ "./src/components/submissions/details/SubmissionDetails.module.scss");
/* harmony import */ var _SubmissionDetails_module_scss__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_SubmissionDetails_module_scss__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);



var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\submissions\\details\\SubmissionDetails.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature();














var SubmissionDetails = function SubmissionDetails() {
  _s();

  var _useSubmissionsDetail = Object(_hooks_submissions_use_submissions_details__WEBPACK_IMPORTED_MODULE_4__["useSubmissionsDetails"])(),
      _useSubmissionsDetail2 = _useSubmissionsDetail.state,
      currentSubmission = _useSubmissionsDetail2.currentSubmission,
      currentProblemSubmissionResults = _useSubmissionsDetail2.currentProblemSubmissionResults,
      getSubmissionResults = _useSubmissionsDetail.actions.getSubmissionResults;

  var problemNameHeadingText = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(function () {
    return "".concat(currentSubmission === null || currentSubmission === void 0 ? void 0 : currentSubmission.problem.name, " - ").concat(currentSubmission === null || currentSubmission === void 0 ? void 0 : currentSubmission.problem.id);
  }, [currentSubmission === null || currentSubmission === void 0 ? void 0 : currentSubmission.problem.id, currentSubmission === null || currentSubmission === void 0 ? void 0 : currentSubmission.problem.name]);
  var detailsHeadingText = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(function () {
    return "Details #".concat(currentSubmission === null || currentSubmission === void 0 ? void 0 : currentSubmission.id);
  }, [currentSubmission === null || currentSubmission === void 0 ? void 0 : currentSubmission.id]);

  var _ref = currentSubmission || {},
      submissionType = _ref.submissionType;

  var submissionsNavigationClassName = 'submissionsNavigation';
  var submissionsDetails = 'submissionDetails';
  var submissionDetailsClassName = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_8__["default"])(_SubmissionDetails_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.navigation, _SubmissionDetails_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.submissionDetails, submissionsDetails);
  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_3__["isNil"])(currentSubmission)) {
      return;
    }

    var problemId = currentSubmission.problem.id,
        isOfficial = currentSubmission.isOfficial;

    Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee() {
      return C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return getSubmissionResults(problemId, isOfficial);

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }, [currentSubmission, getSubmissionResults]);

  if (Object(lodash__WEBPACK_IMPORTED_MODULE_3__["isNil"])(currentSubmission)) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
      children: "No details fetched."
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 51,
      columnNumber: 16
    }, _this);
  }

  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
    className: _SubmissionDetails_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.detailsWrapper,
    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
      className: _SubmissionDetails_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.navigation,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
        className: submissionsNavigationClassName,
        children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_5__["default"], {
          type: _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_5__["HeadingType"].secondary,
          children: "Submissions"
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 58,
          columnNumber: 21
        }, _this)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 57,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_submissions_list_RefreshableSubmissionsList__WEBPACK_IMPORTED_MODULE_9__["default"], {
        items: currentProblemSubmissionResults,
        selectedSubmission: currentSubmission,
        className: _SubmissionDetails_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.submissionsList
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 60,
        columnNumber: 17
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 56,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
      className: _SubmissionDetails_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.code,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_5__["default"], {
        type: _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_5__["HeadingType"].secondary,
        className: _SubmissionDetails_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.taskHeading,
        children: problemNameHeadingText
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 67,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_code_editor_CodeEditor__WEBPACK_IMPORTED_MODULE_6__["default"], {
        readOnly: true,
        code: currentSubmission === null || currentSubmission === void 0 ? void 0 : currentSubmission.content,
        selectedSubmissionType: submissionType
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 73,
        columnNumber: 17
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 66,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
      className: submissionDetailsClassName,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_5__["default"], {
        type: _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_5__["HeadingType"].secondary,
        children: detailsHeadingText
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 80,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_submission_results_SubmissionResults__WEBPACK_IMPORTED_MODULE_7__["default"], {
        testRuns: currentSubmission.testRuns
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 81,
        columnNumber: 17
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 79,
      columnNumber: 13
    }, _this)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 55,
    columnNumber: 9
  }, _this);
};

_s(SubmissionDetails, "2qZTATtsTnZmwTf5RHyIUROHQlQ=", false, function () {
  return [_hooks_submissions_use_submissions_details__WEBPACK_IMPORTED_MODULE_4__["useSubmissionsDetails"]];
});

_c = SubmissionDetails;
/* harmony default export */ __webpack_exports__["default"] = (SubmissionDetails);

var _c;

__webpack_require__.$Refresh$.register(_c, "SubmissionDetails");

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
//# sourceMappingURL=main.a93fec69bf8d47a2ebb4.hot-update.js.map