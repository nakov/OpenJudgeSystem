webpackHotUpdate("main",{

/***/ "./src/hooks/use-contest-categories-breadcrumb.tsx":
/*!*********************************************************!*\
  !*** ./src/hooks/use-contest-categories-breadcrumb.tsx ***!
  \*********************************************************/
/*! exports provided: default, useCategoriesBreadcrumbs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useCategoriesBreadcrumbs", function() { return useCategoriesBreadcrumbs; });
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);



var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\hooks\\use-contest-categories-breadcrumb.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature(),
    _s2 = __webpack_require__.$Refresh$.signature();




var defaultState = {
  state: {
    breadcrumbItems: []
  }
};
var CategoriesBreadcrumbContext = /*#__PURE__*/Object(react__WEBPACK_IMPORTED_MODULE_1__["createContext"])(defaultState);

var orderByAsc = function orderByAsc(x, y) {
  return y.orderBy - x.orderBy;
};

var CategoriesBreadcrumbProvider = function CategoriesBreadcrumbProvider(_ref) {
  _s();

  var children = _ref.children;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(defaultState.state.breadcrumbItems),
      _useState2 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
      breadcrumbItems = _useState2[0],
      setBreadcrumbItems = _useState2[1];

  var updateBreadcrumb = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function (category, categoriesTree) {
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_2__["isNil"])(category) || Object(lodash__WEBPACK_IMPORTED_MODULE_2__["isNil"])(categoriesTree)) {
      return;
    }

    var id = category.id,
        name = category.name,
        parentId = category.parentId;
    var allBreadcrumbItems = [];
    var index = 0;
    allBreadcrumbItems.push({
      id: id,
      value: name,
      isLast: true,
      orderBy: index
    });

    var populateBreadcrumbItemsByParents = function populateBreadcrumbItemsByParents(categoryParentId) {
      if (Object(lodash__WEBPACK_IMPORTED_MODULE_2__["isNil"])(categoryParentId)) {
        return;
      }

      index += 1;

      var _ref2 = categoriesTree.find(function (x) {
        return x.id === categoryParentId;
      }),
          parentCategoryId = _ref2.id,
          parentCategoryName = _ref2.name,
          currentParrentId = _ref2.parentId;

      if (Object(lodash__WEBPACK_IMPORTED_MODULE_2__["isNil"])(parentCategoryId)) {
        return;
      }

      allBreadcrumbItems.push({
        id: parentCategoryId,
        value: parentCategoryName,
        isLast: false,
        orderBy: index
      });
      populateBreadcrumbItemsByParents(currentParrentId);
    };

    populateBreadcrumbItemsByParents(parentId);
    allBreadcrumbItems.sort(orderByAsc);
    setBreadcrumbItems([].concat(allBreadcrumbItems));
  }, [setBreadcrumbItems]);
  var value = {
    state: {
      breadcrumbItems: breadcrumbItems
    },
    actions: {
      updateBreadcrumb: updateBreadcrumb
    }
  };
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__["jsxDEV"])("div", {
    className: "kude sum",
    children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__["jsxDEV"])(CategoriesBreadcrumbContext.Provider, {
      value: value,
      children: children
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 94,
      columnNumber: 13
    }, _this)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 93,
    columnNumber: 9
  }, _this);
};

_s(CategoriesBreadcrumbProvider, "d20z2h5qlSdTdFoN5NEG516+UdM=");

_c = CategoriesBreadcrumbProvider;

var useCategoriesBreadcrumbs = function useCategoriesBreadcrumbs() {
  _s2();

  return Object(react__WEBPACK_IMPORTED_MODULE_1__["useContext"])(CategoriesBreadcrumbContext);
};

_s2(useCategoriesBreadcrumbs, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");

/* harmony default export */ __webpack_exports__["default"] = (CategoriesBreadcrumbProvider);


var _c;

__webpack_require__.$Refresh$.register(_c, "CategoriesBreadcrumbProvider");

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
//# sourceMappingURL=main.33c181ec91501628e0c6.hot-update.js.map