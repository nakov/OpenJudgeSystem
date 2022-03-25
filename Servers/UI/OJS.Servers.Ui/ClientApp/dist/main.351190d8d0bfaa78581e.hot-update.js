webpackHotUpdate("main",{

/***/ "./src/App.tsx":
/*!*********************!*\
  !*** ./src/App.tsx ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var _hooks_use_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./hooks/use-auth */ "./src/hooks/use-auth.tsx");
/* harmony import */ var _layout_header_PageHeader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./layout/header/PageHeader */ "./src/layout/header/PageHeader.tsx");
/* harmony import */ var _layout_content_PageContent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./layout/content/PageContent */ "./src/layout/content/PageContent.tsx");
/* harmony import */ var _layout_footer_PageFooter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./layout/footer/PageFooter */ "./src/layout/footer/PageFooter.tsx");
/* harmony import */ var _hooks_use_loading__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./hooks/use-loading */ "./src/hooks/use-loading.tsx");
/* harmony import */ var _hooks_use_services__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./hooks/use-services */ "./src/hooks/use-services.tsx");
/* harmony import */ var _hooks_use_notifications__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./hooks/use-notifications */ "./src/hooks/use-notifications.tsx");
/* harmony import */ var _hooks_contests_use_contests__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./hooks/contests/use-contests */ "./src/hooks/contests/use-contests.tsx");
/* harmony import */ var _hooks_use_users__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./hooks/use-users */ "./src/hooks/use-users.tsx");
/* harmony import */ var _hooks_submissions_use_submissions__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./hooks/submissions/use-submissions */ "./src/hooks/submissions/use-submissions.tsx");
/* harmony import */ var _hooks_submissions_use_submissions_details__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./hooks/submissions/use-submissions-details */ "./src/hooks/submissions/use-submissions-details.tsx");
/* harmony import */ var _hooks_use_participations__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./hooks/use-participations */ "./src/hooks/use-participations.tsx");
/* harmony import */ var _styles_global_scss__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./styles/global.scss */ "./src/styles/global.scss");
/* harmony import */ var _styles_global_scss__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_styles_global_scss__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);

var _jsxFileName = "/Users/doncho/repos/OpenJudgeSystem2/Servers/UI/OJS.Servers.Ui/ClientApp/src/App.tsx",
    _this = undefined;



















var InitProviders = function InitProviders(_ref) {
  var providers = _ref.providers,
      children = _ref.children;

  var initial = /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["Fragment"], {
    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])("h1", {
      children: "Yep, Hot reload works!"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 22,
      columnNumber: 13
    }, _this), children]
  }, void 0, true);

  return providers.reverse().reduce(function (current, Provider) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(Provider, {
      children: current
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 29,
      columnNumber: 13
    }, _this);
  }, initial);
};

_c = InitProviders;

var App = function App() {
  var providers = [_hooks_use_services__WEBPACK_IMPORTED_MODULE_7__["default"], _hooks_use_loading__WEBPACK_IMPORTED_MODULE_6__["default"], _hooks_use_notifications__WEBPACK_IMPORTED_MODULE_8__["default"], _hooks_use_auth__WEBPACK_IMPORTED_MODULE_2__["default"], _hooks_use_users__WEBPACK_IMPORTED_MODULE_10__["default"], _hooks_contests_use_contests__WEBPACK_IMPORTED_MODULE_9__["default"], _hooks_use_participations__WEBPACK_IMPORTED_MODULE_13__["default"], _hooks_submissions_use_submissions__WEBPACK_IMPORTED_MODULE_11__["default"], _hooks_submissions_use_submissions_details__WEBPACK_IMPORTED_MODULE_12__["default"]];
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(InitProviders, {
    providers: providers,
    children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["BrowserRouter"], {
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(_layout_header_PageHeader__WEBPACK_IMPORTED_MODULE_3__["default"], {}, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 50,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(_layout_content_PageContent__WEBPACK_IMPORTED_MODULE_4__["default"], {}, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 51,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(_layout_footer_PageFooter__WEBPACK_IMPORTED_MODULE_5__["default"], {}, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 52,
        columnNumber: 17
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 49,
      columnNumber: 13
    }, _this)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 48,
    columnNumber: 9
  }, _this);
};

_c2 = App;
/* harmony default export */ __webpack_exports__["default"] = (App);

var _c, _c2;

__webpack_require__.$Refresh$.register(_c, "InitProviders");
__webpack_require__.$Refresh$.register(_c2, "App");

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
//# sourceMappingURL=main.351190d8d0bfaa78581e.hot-update.js.map