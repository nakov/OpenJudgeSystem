webpackHotUpdate("main",{

/***/ "./src/hooks/common/use-url-params.tsx":
/*!*********************************************!*\
  !*** ./src/hooks/common/use-url-params.tsx ***!
  \*********************************************/
/*! exports provided: default, useUrlParams */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useUrlParams", function() { return useUrlParams; });
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/index.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);



var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\hooks\\common\\use-url-params.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature(),
    _s2 = __webpack_require__.$Refresh$.signature();




var defaultState = {
  state: {}
};
var UrlParamsContext = /*#__PURE__*/Object(react__WEBPACK_IMPORTED_MODULE_1__["createContext"])(defaultState);

var searchParamsToParams = function searchParamsToParams(searchParams) {
  var params = {};
  searchParams.forEach(function (value, key) {
    if (!params[key]) {
      params[key] = [];
    }

    params[key].push(value);
  });
  return Object.keys(params).map(function (key) {
    var value = params[key].length === 1 ? params[key][0] : params[key];
    return {
      key: key,
      value: value
    };
  });
};

var UrlParamsProvider = function UrlParamsProvider(_ref) {
  _s();

  var children = _ref.children;

  var _useSearchParams = Object(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["useSearchParams"])(),
      _useSearchParams2 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_useSearchParams, 2),
      searchParams = _useSearchParams2[0],
      setSearchParams = _useSearchParams2[1];

  var params = Object(react__WEBPACK_IMPORTED_MODULE_1__["useMemo"])(function () {
    return searchParamsToParams(searchParams);
  }, [searchParams]);
  var setParam = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function (key, value) {
    var keyToLower = key.toLowerCase();

    if (searchParams.has(keyToLower) || searchParams.has(key)) {
      searchParams.delete(key);
      searchParams.delete(keyToLower);
    }

    searchParams.append(keyToLower, value);
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);
  var unsetParam = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function (key) {
    searchParams.delete(key);
    searchParams.delete(key.toLowerCase());
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);
  var clearParams = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function () {
    setSearchParams({});
  }, [setSearchParams]);
  var value = {
    state: {
      params: params
    },
    actions: {
      setParam: setParam,
      unsetParam: unsetParam,
      clearParams: clearParams
    }
  };
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__["jsxDEV"])(UrlParamsContext.Provider, {
    value: value,
    children: children
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 95,
    columnNumber: 9
  }, _this);
};

_s(UrlParamsProvider, "R/1C6VUGL7yLxlwREGEooi7qD24=", false, function () {
  return [react_router_dom__WEBPACK_IMPORTED_MODULE_2__["useSearchParams"]];
});

_c = UrlParamsProvider;

var useUrlParams = function useUrlParams() {
  _s2();

  return Object(react__WEBPACK_IMPORTED_MODULE_1__["useContext"])(UrlParamsContext);
};

_s2(useUrlParams, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");

/* harmony default export */ __webpack_exports__["default"] = (UrlParamsProvider);


var _c;

__webpack_require__.$Refresh$.register(_c, "UrlParamsProvider");

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
//# sourceMappingURL=main.bed6f6604db628d204bd.hot-update.js.map