webpackHotUpdate("main",{

/***/ "./src/components/contests/contest-password-form/ContestPasswordForm.tsx":
/*!*******************************************************************************!*\
  !*** ./src/components/contests/contest-password-form/ContestPasswordForm.tsx ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator/index.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _hooks_use_current_contest__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../hooks/use-current-contest */ "./src/hooks/use-current-contest.tsx");
/* harmony import */ var _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../guidelines/headings/Heading */ "./src/components/guidelines/headings/Heading.tsx");
/* harmony import */ var _guidelines_forms_FormControl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../guidelines/forms/FormControl */ "./src/components/guidelines/forms/FormControl.tsx");
/* harmony import */ var _guidelines_forms_Form__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../guidelines/forms/Form */ "./src/components/guidelines/forms/Form.tsx");
/* harmony import */ var _ContestPasswordForm_module_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ContestPasswordForm.module.scss */ "./src/components/contests/contest-password-form/ContestPasswordForm.module.scss");
/* harmony import */ var _ContestPasswordForm_module_scss__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_ContestPasswordForm_module_scss__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);




var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\contests\\contest-password-form\\ContestPasswordForm.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature();












var ContestPasswordForm = function ContestPasswordForm(_ref) {
  _s();

  var id = _ref.id,
      isOfficial = _ref.isOfficial;

  var _useCurrentContest = Object(_hooks_use_current_contest__WEBPACK_IMPORTED_MODULE_5__["useCurrentContest"])(),
      _useCurrentContest$st = _useCurrentContest.state,
      contest = _useCurrentContest$st.contest,
      submitContestPasswordErrorMessage = _useCurrentContest$st.submitContestPasswordErrorMessage,
      submitPassword = _useCurrentContest.actions.submitPassword;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(''),
      _useState2 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState, 2),
      passwordValue = _useState2[0],
      setPasswordValue = _useState2[1];

  var passwordFieldName = 'contestPassword';
  var handleOnSubmitPassword = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])( /*#__PURE__*/Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee() {
    return C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return submitPassword({
              id: id,
              isOfficial: isOfficial,
              password: passwordValue
            });

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })), [id, isOfficial, passwordValue, submitPassword]);
  var handleOnChangeUpdatePassword = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (value) {
    setPasswordValue(value);
  }, [setPasswordValue]);
  var renderErrorMessage = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function () {
    return !Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(submitContestPasswordErrorMessage) ? /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__["jsxDEV"])("span", {
      className: _ContestPasswordForm_module_scss__WEBPACK_IMPORTED_MODULE_9___default.a.errorMessage,
      children: submitContestPasswordErrorMessage
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 37,
      columnNumber: 15
    }, _this) : null;
  }, [submitContestPasswordErrorMessage]);
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__["jsxDEV"])(_guidelines_forms_Form__WEBPACK_IMPORTED_MODULE_8__["default"], {
    className: _ContestPasswordForm_module_scss__WEBPACK_IMPORTED_MODULE_9___default.a.contestPasswordForm,
    onSubmit: function onSubmit() {
      handleOnSubmitPassword();
    },
    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__["jsxDEV"])("header", {
      className: _ContestPasswordForm_module_scss__WEBPACK_IMPORTED_MODULE_9___default.a.formHeader,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__["jsxDEV"])(_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_6__["default"], {
        type: _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_6__["HeadingType"].primary,
        children: "Enter contest password"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 50,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__["jsxDEV"])(_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_6__["default"], {
        type: _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_6__["HeadingType"].secondary,
        children: contest === null || contest === void 0 ? void 0 : contest.name
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 51,
        columnNumber: 17
      }, _this), renderErrorMessage()]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 49,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__["jsxDEV"])(_guidelines_forms_FormControl__WEBPACK_IMPORTED_MODULE_7__["default"], {
      id: passwordFieldName.toLowerCase(),
      name: passwordFieldName,
      labelText: "Password",
      type: _guidelines_forms_FormControl__WEBPACK_IMPORTED_MODULE_7__["FormControlType"].password,
      onChange: function onChange(value) {
        return handleOnChangeUpdatePassword(Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(value) ? '' : value.toString());
      },
      value: ""
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 54,
      columnNumber: 13
    }, _this)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 43,
    columnNumber: 9
  }, _this);
};

_s(ContestPasswordForm, "ZibEwTMaMbbnucCGiu4z3VUtoZw=", false, function () {
  return [_hooks_use_current_contest__WEBPACK_IMPORTED_MODULE_5__["useCurrentContest"]];
});

_c = ContestPasswordForm;
/* harmony default export */ __webpack_exports__["default"] = (ContestPasswordForm);

var _c;

__webpack_require__.$Refresh$.register(_c, "ContestPasswordForm");

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
//# sourceMappingURL=main.1da6021ac5645703bf38.hot-update.js.map