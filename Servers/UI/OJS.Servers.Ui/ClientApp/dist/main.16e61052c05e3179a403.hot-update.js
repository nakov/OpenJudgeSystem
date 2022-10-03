webpackHotUpdate("main",{

/***/ "./src/components/auth/LoginForm.tsx":
/*!*******************************************!*\
  !*** ./src/components/auth/LoginForm.tsx ***!
  \*******************************************/
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
/* harmony import */ var _hooks_use_auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/use-auth */ "./src/hooks/use-auth.tsx");
/* harmony import */ var _guidelines_forms_FormControl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../guidelines/forms/FormControl */ "./src/components/guidelines/forms/FormControl.tsx");
/* harmony import */ var _guidelines_forms_Form__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../guidelines/forms/Form */ "./src/components/guidelines/forms/Form.tsx");
/* harmony import */ var _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../guidelines/headings/Heading */ "./src/components/guidelines/headings/Heading.tsx");
/* harmony import */ var _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../guidelines/buttons/Button */ "./src/components/guidelines/buttons/Button.tsx");
/* harmony import */ var _identity_config__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../identity-config */ "./src/identity-config.ts");
/* harmony import */ var _LoginForm_module_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./LoginForm.module.scss */ "./src/components/auth/LoginForm.module.scss");
/* harmony import */ var _LoginForm_module_scss__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_LoginForm_module_scss__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);



var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\auth\\LoginForm.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature();














var LoginPage = function LoginPage() {
  _s();

  var _useAuth = Object(_hooks_use_auth__WEBPACK_IMPORTED_MODULE_4__["useAuth"])(),
      loginErrorMessage = _useAuth.state.loginErrorMessage,
      _useAuth$actions = _useAuth.actions,
      setUsername = _useAuth$actions.setUsername,
      setPassword = _useAuth$actions.setPassword,
      signIn = _useAuth$actions.signIn;

  var usernameFieldName = 'Username';
  var passwordFieldName = 'Password';
  var handleOnChangeUpdateUsername = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (value) {
    setUsername(value);
  }, [setUsername]);
  var handleOnChangeUpdatePassword = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (value) {
    setPassword(value);
  }, [setPassword]);
  var handleLoginClick = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])( /*#__PURE__*/Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee() {
    return C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return signIn();

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })), [signIn]);
  var renderLoginErrorMessage = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function () {
    return !Object(lodash__WEBPACK_IMPORTED_MODULE_3__["isNil"])(loginErrorMessage) ? /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("span", {
      className: _LoginForm_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.errorMessage,
      children: loginErrorMessage
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 34,
      columnNumber: 15
    }, _this) : null;
  }, [loginErrorMessage]);
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_forms_Form__WEBPACK_IMPORTED_MODULE_6__["default"], {
    className: _LoginForm_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.loginForm,
    onSubmit: function onSubmit() {
      handleLoginClick();
    },
    submitText: "Login",
    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("header", {
      className: _LoginForm_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.loginFormHeader,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_7__["default"], {
        type: _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_7__["HeadingType"].primary,
        children: "Login"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 48,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("span", {
        className: _LoginForm_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.registerHeader,
        children: ['You don\'t have an account yet? ', /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_8__["LinkButton"], {
          to: _identity_config__WEBPACK_IMPORTED_MODULE_9__["IDENTITY_CONFIG"].register,
          type: _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_8__["LinkButtonType"].plain,
          className: _LoginForm_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.loginFormLink,
          children: "Register"
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 51,
          columnNumber: 21
        }, _this)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 49,
        columnNumber: 17
      }, _this), renderLoginErrorMessage()]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 47,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_forms_FormControl__WEBPACK_IMPORTED_MODULE_5__["default"], {
      id: usernameFieldName.toLowerCase(),
      name: usernameFieldName,
      labelText: usernameFieldName,
      type: _guidelines_forms_FormControl__WEBPACK_IMPORTED_MODULE_5__["FormControlType"].input,
      onChange: function onChange(value) {
        return handleOnChangeUpdateUsername(value);
      },
      value: ""
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 61,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_forms_FormControl__WEBPACK_IMPORTED_MODULE_5__["default"], {
      id: passwordFieldName.toLowerCase(),
      name: passwordFieldName,
      labelText: passwordFieldName,
      labelClassName: _LoginForm_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.floatingLabel,
      type: _guidelines_forms_FormControl__WEBPACK_IMPORTED_MODULE_5__["FormControlType"].password,
      onChange: function onChange(value) {
        return handleOnChangeUpdatePassword(Object(lodash__WEBPACK_IMPORTED_MODULE_3__["isNil"])(value) ? '' : value.toString());
      },
      value: ""
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 69,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
      className: _LoginForm_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.loginFormControls,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_forms_FormControl__WEBPACK_IMPORTED_MODULE_5__["default"], {
        id: "auth-password-checkbox",
        name: "RememberMe",
        labelText: "Remember Me",
        containerClassName: _LoginForm_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.flexDirectionRow,
        labelClassName: _LoginForm_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.rememberMeLabel,
        type: _guidelines_forms_FormControl__WEBPACK_IMPORTED_MODULE_5__["FormControlType"].checkbox
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 81,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
        children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_8__["LinkButton"], {
          type: _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_8__["LinkButtonType"].plain,
          to: "/Account/ExternalNotify",
          className: _LoginForm_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.loginFormLink,
          children: "Forgotten password"
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 90,
          columnNumber: 21
        }, _this)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 89,
        columnNumber: 17
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 80,
      columnNumber: 13
    }, _this)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 40,
    columnNumber: 9
  }, _this);
};

_s(LoginPage, "WsvCSFKfgjIhtnlzYSc7kgLKRDw=", false, function () {
  return [_hooks_use_auth__WEBPACK_IMPORTED_MODULE_4__["useAuth"]];
});

_c = LoginPage;
/* harmony default export */ __webpack_exports__["default"] = (LoginPage);

var _c;

__webpack_require__.$Refresh$.register(_c, "LoginPage");

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
//# sourceMappingURL=main.16e61052c05e3179a403.hot-update.js.map