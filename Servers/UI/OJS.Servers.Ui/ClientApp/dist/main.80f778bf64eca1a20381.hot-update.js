webpackHotUpdate("main",{

/***/ "./src/hooks/contests/use-current-contest-results.tsx":
/*!************************************************************!*\
  !*** ./src/hooks/contests/use-current-contest-results.tsx ***!
  \************************************************************/
/*! exports provided: default, useCurrentContestResults */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useCurrentContestResults", function() { return useCurrentContestResults; });
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator/index.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _use_loading__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../use-loading */ "./src/hooks/use-loading.tsx");
/* harmony import */ var _use_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../use-http */ "./src/hooks/use-http.tsx");
/* harmony import */ var _use_urls__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../use-urls */ "./src/hooks/use-urls.tsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);




var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\hooks\\contests\\use-current-contest-results.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature(),
    _s2 = __webpack_require__.$Refresh$.signature();








var defaultState = {
  state: {
    contestResults: {
      results: []
    }
  }
};
var ContestResultsContext = /*#__PURE__*/Object(react__WEBPACK_IMPORTED_MODULE_3__["createContext"])(defaultState);

var CurrentContestResultsProvider = function CurrentContestResultsProvider(_ref) {
  _s();

  var children = _ref.children;

  var _useUrls = Object(_use_urls__WEBPACK_IMPORTED_MODULE_7__["useUrls"])(),
      getContestResultsUrl = _useUrls.getContestResultsUrl;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(defaultState.state.contestResults),
      _useState2 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState, 2),
      contestResults = _useState2[0],
      setContestResults = _useState2[1];

  var _useLoading = Object(_use_loading__WEBPACK_IMPORTED_MODULE_5__["useLoading"])(),
      startLoading = _useLoading.startLoading,
      stopLoading = _useLoading.stopLoading;

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(),
      _useState4 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState3, 2),
      getContestResultsParams = _useState4[0],
      setGetContestResultsParams = _useState4[1];

  var _useHttp = Object(_use_http__WEBPACK_IMPORTED_MODULE_6__["useHttp"])(getContestResultsUrl, getContestResultsParams),
      getContestResults = _useHttp.get,
      apiContestResults = _useHttp.data;

  var load = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])( /*#__PURE__*/function () {
    var _ref2 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee(id, official, full) {
      return C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(id)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              setGetContestResultsParams({
                id: id,
                official: official,
                full: full
              });

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  }(), []);
  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(apiContestResults)) {
      return;
    }

    setContestResults(apiContestResults);
  }, [apiContestResults]);
  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(getContestResultsParams)) {
      return;
    }

    Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee2() {
      return C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              startLoading();
              _context2.next = 3;
              return getContestResults();

            case 3:
              stopLoading();

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  }, [getContestResults, getContestResultsParams, startLoading, stopLoading]);
  var value = {
    state: {
      contestResults: contestResults
    },
    actions: {
      load: load
    }
  };
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(ContestResultsContext.Provider, {
    value: value,
    children: children
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 78,
    columnNumber: 9
  }, _this);
};

_s(CurrentContestResultsProvider, "KtI4443FClUnGtmRncMkPPIDeyI=", false, function () {
  return [_use_urls__WEBPACK_IMPORTED_MODULE_7__["useUrls"], _use_loading__WEBPACK_IMPORTED_MODULE_5__["useLoading"], _use_http__WEBPACK_IMPORTED_MODULE_6__["useHttp"]];
});

_c = CurrentContestResultsProvider;

var useCurrentContestResults = function useCurrentContestResults() {
  _s2();

  return Object(react__WEBPACK_IMPORTED_MODULE_3__["useContext"])(ContestResultsContext);
};

_s2(useCurrentContestResults, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");

/* harmony default export */ __webpack_exports__["default"] = (CurrentContestResultsProvider);


var _c;

__webpack_require__.$Refresh$.register(_c, "CurrentContestResultsProvider");

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
//# sourceMappingURL=main.80f778bf64eca1a20381.hot-update.js.map