webpackHotUpdate("main",{

/***/ "./src/hooks/contests/contest-filter-utils.ts":
/*!****************************************************!*\
  !*** ./src/hooks/contests/contest-filter-utils.ts ***!
  \****************************************************/
/*! exports provided: generateCategoryFilters, generateStrategyFilters, generateStatusFilters */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateCategoryFilters", function() { return generateCategoryFilters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateStrategyFilters", function() { return generateStrategyFilters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateStatusFilters", function() { return generateStatusFilters; });
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _common_contest_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/contest-types */ "./src/common/contest-types.ts");
/* harmony import */ var _common_filter_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/filter-utils */ "./src/common/filter-utils.ts");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);





var addCategoryLeafFilters = function addCategoryLeafFilters(_ref, arr, cache) {
  var id = _ref.id,
      name = _ref.name,
      treeChildren = _ref.children;
  treeChildren === null || treeChildren === void 0 ? void 0 : treeChildren.forEach(function (c) {
    addCategoryLeafFilters(c, arr, cache);
  });

  if (!cache.has(id)) {
    cache.set(id, {
      name: name,
      value: id.toString()
    });
  }

  arr.push(cache.get(id));
};

var generateCategoryFilters = function () {
  var categoriesCache = new Map();
  return function (categories) {
    var categoryFilters = [];
    categories === null || categories === void 0 ? void 0 : categories.forEach(function (c) {
      return addCategoryLeafFilters(c, categoryFilters, categoriesCache);
    });
    return _common_filter_utils__WEBPACK_IMPORTED_MODULE_2__["generateFilterItems"].apply(void 0, [_common_contest_types__WEBPACK_IMPORTED_MODULE_1__["FilterType"].Category].concat(categoryFilters));
  };
}();

var generateStatusFilters = function () {
  var result = Object(_common_filter_utils__WEBPACK_IMPORTED_MODULE_2__["generateFilterItems"])(_common_contest_types__WEBPACK_IMPORTED_MODULE_1__["FilterType"].Status, {
    name: _common_contest_types__WEBPACK_IMPORTED_MODULE_1__["ContestStatus"].All,
    value: _common_contest_types__WEBPACK_IMPORTED_MODULE_1__["ContestStatus"].All
  }, {
    name: _common_contest_types__WEBPACK_IMPORTED_MODULE_1__["ContestStatus"].Active,
    value: _common_contest_types__WEBPACK_IMPORTED_MODULE_1__["ContestStatus"].Active
  }, {
    name: _common_contest_types__WEBPACK_IMPORTED_MODULE_1__["ContestStatus"].Past,
    value: _common_contest_types__WEBPACK_IMPORTED_MODULE_1__["ContestStatus"].Past
  });
  return function () {
    return result;
  };
}();

var generateStrategyFilters = function () {
  var strategiesCache = new Map();
  return function (strategies) {
    var _strategies$map;

    var strategyFilters = (_strategies$map = strategies === null || strategies === void 0 ? void 0 : strategies.map(function (_ref2) {
      var name = _ref2.name,
          id = _ref2.id;

      if (!strategiesCache.has(id)) {
        strategiesCache.set(id, {
          name: name,
          value: id.toString()
        });
      }

      return strategiesCache.get(id);
    })) !== null && _strategies$map !== void 0 ? _strategies$map : [];
    return _common_filter_utils__WEBPACK_IMPORTED_MODULE_2__["generateFilterItems"].apply(void 0, [_common_contest_types__WEBPACK_IMPORTED_MODULE_1__["FilterType"].Strategy].concat(Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(strategyFilters)));
  };
}();



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
//# sourceMappingURL=main.059d4d54951d03b56954.hot-update.js.map