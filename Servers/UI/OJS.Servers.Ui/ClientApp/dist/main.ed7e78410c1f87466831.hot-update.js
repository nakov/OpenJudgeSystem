webpackHotUpdate("main",{

/***/ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/components/contests/categories-tree/CategoriesTree.module.scss":
false,

/***/ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/components/contests/contest-categories/ContestCategories.module.scss":
false,

/***/ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/components/profile/profile-submissions/ProfileSubmissions.module.scss":
false,

/***/ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/components/submissions/execution-result/ExecutionResult.module.scss":
false,

/***/ "./src/components/common/InitProviders.tsx":
/*!*************************************************!*\
  !*** ./src/components/common/InitProviders.tsx ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);



var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\common\\InitProviders.tsx",
    _this = undefined;





var InitProviders = function InitProviders(_ref) {
  var providers = _ref.providers,
      children = _ref.children;

  var initial = /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__["jsxDEV"])(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__["Fragment"], {
    children: children
  }, void 0, false);

  return providers.reverse().reduce(function (current, item) {
    var Provider = item;
    var props = {};
    var providerItem = item; // Checking if provider is of type IProvider to pass props

    if (providerItem.Provider) {
      Provider = providerItem.Provider;
      props = providerItem.props;
    }

    return (
      /*#__PURE__*/
      // eslint-disable-next-line react/jsx-props-no-spreading
      Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__["jsxDEV"])(Provider, Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, props), {}, {
        children: current
      }), void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 36,
        columnNumber: 21
      }, _this)
    );
  }, initial);
};

_c = InitProviders;
/* harmony default export */ __webpack_exports__["default"] = (InitProviders);

var _c;

__webpack_require__.$Refresh$.register(_c, "InitProviders");

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

/***/ }),

/***/ "./src/components/contests/categories-tree/CategoriesTree.module.scss":
false,

/***/ "./src/components/contests/categories-tree/CategoriesTree.tsx":
false,

/***/ "./src/components/contests/contest-categories/ContestCategories.module.scss":
false,

/***/ "./src/components/contests/contest-categories/ContestCategories.tsx":
/*!**************************************************************************!*\
  !*** ./src/components/contests/contest-categories/ContestCategories.tsx ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/react-scripts/node_modules/babel-loader/lib/index.js):\nSyntaxError: C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\contests\\contest-categories\\ContestCategories.tsx: Unexpected token (89:1)\n\n  87 |                 Category\n  88 |             </Heading>\n> 89 | <<<<<<< HEAD\n     |  ^\n  90 |             <CategoryTree\n  91 |                 items={categories}\n  92 |                 onCategoryLabelClick={handleTreeLabelClick}\n    at instantiate (C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\node_modules\\@babel\\parser\\lib\\index.js:72:32)\n    at constructor (C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\node_modules\\@babel\\parser\\lib\\index.js:358:12)\n    at Object.raise (C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\node_modules\\@babel\\parser\\lib\\index.js:3334:19)\n    at Object.unexpected (C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\node_modules\\@babel\\parser\\lib\\index.js:3372:16)\n    at Object.jsxParseIdentifier (C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\node_modules\\@babel\\parser\\lib\\index.js:7778:12)\n    at Object.jsxParseNamespacedName (C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\node_modules\\@babel\\parser\\lib\\index.js:7788:23)\n    at Object.jsxParseElementName (C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\node_modules\\@babel\\parser\\lib\\index.js:7799:21)\n    at Object.jsxParseOpeningElementAt (C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\node_modules\\@babel\\parser\\lib\\index.js:7896:22)\n    at Object.jsxParseElementAt (C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\node_modules\\@babel\\parser\\lib\\index.js:7929:33)\n    at Object.jsxParseElementAt (C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\node_modules\\@babel\\parser\\lib\\index.js:7945:32)");

/***/ }),

/***/ "./src/components/contests/contests-filters/ContestFilters.tsx":
/*!*********************************************************************!*\
  !*** ./src/components/contests/contests-filters/ContestFilters.tsx ***!
  \*********************************************************************/
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
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/index.js");
/* harmony import */ var _guidelines_lists_List__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../guidelines/lists/List */ "./src/components/guidelines/lists/List.tsx");
/* harmony import */ var _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../guidelines/headings/Heading */ "./src/components/guidelines/headings/Heading.tsx");
/* harmony import */ var _common_contest_types__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../common/contest-types */ "./src/common/contest-types.ts");
/* harmony import */ var _contest_categories_ContestCategories__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../contest-categories/ContestCategories */ "./src/components/contests/contest-categories/ContestCategories.tsx");
/* harmony import */ var _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../guidelines/buttons/Button */ "./src/components/guidelines/buttons/Button.tsx");
/* harmony import */ var _hooks_use_contests__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../hooks/use-contests */ "./src/hooks/use-contests.tsx");
/* harmony import */ var _common_filter_utils__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../common/filter-utils */ "./src/common/filter-utils.ts");
/* harmony import */ var _guidelines_buttons_ExpandButton__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../guidelines/buttons/ExpandButton */ "./src/components/guidelines/buttons/ExpandButton.tsx");
/* harmony import */ var _utils_class_names__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../utils/class-names */ "./src/utils/class-names.ts");
/* harmony import */ var _hooks_use_contest_strategy_filters__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../hooks/use-contest-strategy-filters */ "./src/hooks/use-contest-strategy-filters.tsx");
/* harmony import */ var _hooks_use_contest_categories__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../hooks/use-contest-categories */ "./src/hooks/use-contest-categories.tsx");
/* harmony import */ var _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./ContestFilters.module.scss */ "./src/components/contests/contests-filters/ContestFilters.module.scss");
/* harmony import */ var _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);




var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\contests\\contests-filters\\ContestFilters.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature();



















var ContestFilters = function ContestFilters(_ref) {
  _s();

  var onFilterClick = _ref.onFilterClick;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])([]),
      _useState2 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState, 2),
      filtersGroups = _useState2[0],
      setFiltersGroups = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(false),
      _useState4 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState3, 2),
      expanded = _useState4[0],
      setExpanded = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(''),
      _useState6 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState5, 2),
      defaultSelected = _useState6[0],
      setDefaultSelected = _useState6[1];

  var _useSearchParams = Object(react_router_dom__WEBPACK_IMPORTED_MODULE_5__["useSearchParams"])(),
      _useSearchParams2 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useSearchParams, 1),
      searchParams = _useSearchParams2[0];

  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(false),
      _useState8 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState7, 2),
      isLoaded = _useState8[0],
      setIsLoaded = _useState8[1];

  var _useContestStrategyFi = Object(_hooks_use_contest_strategy_filters__WEBPACK_IMPORTED_MODULE_15__["useContestStrategyFilters"])(),
      loadStrategies = _useContestStrategyFi.actions.load;

  var _useContestCategories = Object(_hooks_use_contest_categories__WEBPACK_IMPORTED_MODULE_16__["useContestCategories"])(),
      loadCategories = _useContestCategories.actions.load;

  var _useContests = Object(_hooks_use_contests__WEBPACK_IMPORTED_MODULE_11__["useContests"])(),
      _useContests$state = _useContests.state,
      possibleFilters = _useContests$state.possibleFilters,
      filters = _useContests$state.filters;

  var handleFilterClick = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (filterId) {
    var filter = possibleFilters.find(function (_ref2) {
      var id = _ref2.id;
      return filterId === id;
    });

    if (Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(filter)) {
      return;
    }

    onFilterClick(filter);
  }, [possibleFilters, onFilterClick]);
  var renderStatusFilterItem = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (buttonType, btnClassName, name, id) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_10__["default"], {
      type: buttonType,
      onClick: function onClick() {
        return handleFilterClick(id);
      },
      className: btnClassName + _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_17___default.a.btnSelectFilter,
      text: name,
      size: _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_10__["ButtonSize"].small
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 60,
      columnNumber: 13
    }, _this);
  }, [handleFilterClick]);
  var renderStrategyFilterItem = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (buttonType, btnClassName, name, id) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])("div", {
      className: _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_17___default.a.strategyHeader,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])("div", {
        className: _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_17___default.a.tooltip,
        children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])("span", {
          className: _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_17___default.a.tooltipElement,
          children: name
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 75,
          columnNumber: 21
        }, _this)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 74,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_10__["default"], {
        type: buttonType,
        onClick: function onClick() {
          return handleFilterClick(id);
        },
        className: _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_17___default.a.strategyElementClassName,
        text: name,
        size: _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_10__["ButtonSize"].small
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 77,
        columnNumber: 17
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 73,
      columnNumber: 13
    }, _this);
  }, [handleFilterClick]);
  var getRenderFilterItem = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (type) {
    return function (_ref3) {
      var name = _ref3.name,
          id = _ref3.id;
      var filterIsSelected = filters.some(function (f) {
        return f.name === name;
      });
      var buttonType = filterIsSelected ? _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_10__["ButtonType"].primary : _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_10__["ButtonType"].secondary;
      var btnClassName = type === _common_contest_types__WEBPACK_IMPORTED_MODULE_8__["FilterType"].Strategy ? _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_17___default.a.btnSelectFilter : '';
      return type === _common_contest_types__WEBPACK_IMPORTED_MODULE_8__["FilterType"].Strategy ? renderStrategyFilterItem(buttonType, btnClassName, name, id) : renderStatusFilterItem(buttonType, btnClassName, name, id);
    };
  }, [filters, renderStatusFilterItem, renderStrategyFilterItem]);
  var toggleFiltersExpanded = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (isExpanded) {
    return setExpanded(isExpanded);
  }, []);
  var renderExpandButton = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (allFilters) {
    var maxFiltersToDisplayCount = 3;
    return allFilters.length > maxFiltersToDisplayCount ? /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_buttons_ExpandButton__WEBPACK_IMPORTED_MODULE_13__["default"], {
      onExpandChanged: toggleFiltersExpanded
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 118,
      columnNumber: 19
    }, _this) : null;
  }, [toggleFiltersExpanded]);
  var renderFilter = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (fg) {
    var type = fg.type,
        groupFilters = fg.filters;
    var className = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_14__["default"])(_ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_17___default.a.listFilters, expanded ? _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_17___default.a.expanded : '');
    var listOrientation = type === _common_contest_types__WEBPACK_IMPORTED_MODULE_8__["FilterType"].Status ? _guidelines_lists_List__WEBPACK_IMPORTED_MODULE_6__["Orientation"].horizontal : _guidelines_lists_List__WEBPACK_IMPORTED_MODULE_6__["Orientation"].vertical;
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])("div", {
      className: _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_17___default.a.filterTypeContainer,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_7__["default"], {
        type: _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_7__["HeadingType"].small,
        className: _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_17___default.a.heading,
        children: type
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 140,
        columnNumber: 21
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_lists_List__WEBPACK_IMPORTED_MODULE_6__["default"], {
        values: groupFilters,
        itemFunc: getRenderFilterItem(type),
        orientation: listOrientation,
        className: className,
        itemClassName: _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_17___default.a.listFilterItem,
        fullWidth: true
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 146,
        columnNumber: 21
      }, _this), renderExpandButton(groupFilters)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 139,
      columnNumber: 17
    }, _this);
  }, [expanded, getRenderFilterItem, renderExpandButton]);
  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    var plainFilters = possibleFilters.filter(function (_ref4) {
      var type = _ref4.type;
      return type !== _common_contest_types__WEBPACK_IMPORTED_MODULE_8__["FilterType"].Category;
    });
    setFiltersGroups(Object(_common_filter_utils__WEBPACK_IMPORTED_MODULE_12__["groupByType"])(plainFilters));
  }, [possibleFilters]);
  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    if (isLoaded) {
      return;
    }

    var searchParamName = _common_contest_types__WEBPACK_IMPORTED_MODULE_8__["FilterType"].Category.toString();
    var selectedCategory = searchParams.get(searchParamName);

    if (Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(selectedCategory)) {
      selectedCategory = searchParams.get(searchParamName.toLowerCase());
    }

    if (Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(selectedCategory)) {
      return;
    }

    setIsLoaded(true);
    setDefaultSelected(selectedCategory.toString());
  }, [isLoaded, searchParams]);
  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee() {
      return C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return loadStrategies();

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }, [loadStrategies]);
  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee2() {
      return C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return loadCategories();

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  }, [loadCategories]);
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])("div", {
    className: _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_17___default.a.container,
    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_contest_categories_ContestCategories__WEBPACK_IMPORTED_MODULE_9__["default"], {
      className: _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_17___default.a.filterTypeContainer,
      onCategoryClick: onFilterClick,
      defaultSelected: defaultSelected
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 213,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_lists_List__WEBPACK_IMPORTED_MODULE_6__["default"], {
      values: filtersGroups,
      itemFunc: renderFilter,
      fullWidth: true
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 218,
      columnNumber: 13
    }, _this)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 212,
    columnNumber: 9
  }, _this);
};

_s(ContestFilters, "ZQy53lGwu65OZqOvL5WwAttGosc=", false, function () {
  return [react_router_dom__WEBPACK_IMPORTED_MODULE_5__["useSearchParams"], _hooks_use_contest_strategy_filters__WEBPACK_IMPORTED_MODULE_15__["useContestStrategyFilters"], _hooks_use_contest_categories__WEBPACK_IMPORTED_MODULE_16__["useContestCategories"], _hooks_use_contests__WEBPACK_IMPORTED_MODULE_11__["useContests"]];
});

_c = ContestFilters;
/* harmony default export */ __webpack_exports__["default"] = (ContestFilters);

var _c;

__webpack_require__.$Refresh$.register(_c, "ContestFilters");

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

/***/ }),

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

_s(SubmissionBox, "nx+5aTjBKDVOKlJV9rOgvpZoGrk=", false, function () {
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

/***/ }),

/***/ "./src/components/guidelines/icons/LockIcon.tsx":
/*!******************************************************!*\
  !*** ./src/components/guidelines/icons/LockIcon.tsx ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_icons_ai__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-icons/ai */ "./node_modules/react-icons/ai/index.esm.js");
/* harmony import */ var _common_icon_sizes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/icon-sizes */ "./src/components/guidelines/icons/common/icon-sizes.tsx");
/* harmony import */ var _Icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Icon */ "./src/components/guidelines/icons/Icon.tsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);

var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\guidelines\\icons\\LockIcon.tsx",
    _this = undefined;







var LockIcon = function LockIcon(_ref) {
  var _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? _common_icon_sizes__WEBPACK_IMPORTED_MODULE_2__["default"].Medium : _ref$size,
      _ref$helperText = _ref.helperText,
      helperText = _ref$helperText === void 0 ? '' : _ref$helperText;
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__["jsxDEV"])(_Icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: className,
    size: size,
    helperText: helperText,
    Component: react_icons_ai__WEBPACK_IMPORTED_MODULE_1__["AiOutlineLock"]
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 15,
    columnNumber: 5
  }, _this);
};

_c = LockIcon;
/* harmony default export */ __webpack_exports__["default"] = (LockIcon);

var _c;

__webpack_require__.$Refresh$.register(_c, "LockIcon");

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

/***/ }),

/***/ "./src/components/guidelines/icons/MdChervronRightIcon.tsx":
false,

/***/ "./src/components/guidelines/icons/MdExpandMoreIcon.tsx":
false,

/***/ "./src/components/guidelines/icons/MemoryIcon.tsx":
/*!********************************************************!*\
  !*** ./src/components/guidelines/icons/MemoryIcon.tsx ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_icons_bi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-icons/bi */ "./node_modules/react-icons/bi/index.esm.js");
/* harmony import */ var _common_icon_sizes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/icon-sizes */ "./src/components/guidelines/icons/common/icon-sizes.tsx");
/* harmony import */ var _Icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Icon */ "./src/components/guidelines/icons/Icon.tsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);

var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\guidelines\\icons\\MemoryIcon.tsx",
    _this = undefined;







var MemoryIcon = function MemoryIcon(_ref) {
  var _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? _common_icon_sizes__WEBPACK_IMPORTED_MODULE_2__["default"].Medium : _ref$size,
      _ref$helperText = _ref.helperText,
      helperText = _ref$helperText === void 0 ? '' : _ref$helperText;
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__["jsxDEV"])(_Icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: className,
    Component: react_icons_bi__WEBPACK_IMPORTED_MODULE_1__["BiMemoryCard"],
    size: size,
    helperText: helperText
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 14,
    columnNumber: 5
  }, _this);
};

_c = MemoryIcon;
/* harmony default export */ __webpack_exports__["default"] = (MemoryIcon);

var _c;

__webpack_require__.$Refresh$.register(_c, "MemoryIcon");

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

/***/ }),

/***/ "./src/components/guidelines/icons/TimeLimitIcon.tsx":
/*!***********************************************************!*\
  !*** ./src/components/guidelines/icons/TimeLimitIcon.tsx ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_icons_bi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-icons/bi */ "./node_modules/react-icons/bi/index.esm.js");
/* harmony import */ var _common_icon_sizes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/icon-sizes */ "./src/components/guidelines/icons/common/icon-sizes.tsx");
/* harmony import */ var _Icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Icon */ "./src/components/guidelines/icons/Icon.tsx");
/* harmony import */ var _utils_class_names__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/class-names */ "./src/utils/class-names.ts");
/* harmony import */ var _TimeLimitIcon_module_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TimeLimitIcon.module.scss */ "./src/components/guidelines/icons/TimeLimitIcon.module.scss");
/* harmony import */ var _TimeLimitIcon_module_scss__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_TimeLimitIcon_module_scss__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);

var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\guidelines\\icons\\TimeLimitIcon.tsx",
    _this = undefined;









var TimeLimitIcon = function TimeLimitIcon(_ref) {
  var _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? _common_icon_sizes__WEBPACK_IMPORTED_MODULE_2__["default"].Medium : _ref$size,
      _ref$helperText = _ref.helperText,
      helperText = _ref$helperText === void 0 ? '' : _ref$helperText;
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__["jsxDEV"])(_Icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_4__["default"])(_TimeLimitIcon_module_scss__WEBPACK_IMPORTED_MODULE_5___default.a.timeLimitIcon, className),
    Component: react_icons_bi__WEBPACK_IMPORTED_MODULE_1__["BiTime"],
    size: size,
    helperText: helperText
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 17,
    columnNumber: 5
  }, _this);
};

_c = TimeLimitIcon;
/* harmony default export */ __webpack_exports__["default"] = (TimeLimitIcon);

var _c;

__webpack_require__.$Refresh$.register(_c, "TimeLimitIcon");

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

/***/ }),

/***/ "./src/components/home-header/HomeHeader.tsx":
/*!***************************************************!*\
  !*** ./src/components/home-header/HomeHeader.tsx ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator/index.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _utils_object_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/object-utils */ "./src/utils/object-utils.ts");
/* harmony import */ var _guidelines_icons_common_icon_sizes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../guidelines/icons/common/icon-sizes */ "./src/components/guidelines/icons/common/icon-sizes.tsx");
/* harmony import */ var _guidelines_lists_List__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../guidelines/lists/List */ "./src/components/guidelines/lists/List.tsx");
/* harmony import */ var _statistic_box_StatisticBox__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../statistic-box/StatisticBox */ "./src/components/statistic-box/StatisticBox.tsx");
/* harmony import */ var _guidelines_icons_UsersIcon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../guidelines/icons/UsersIcon */ "./src/components/guidelines/icons/UsersIcon.tsx");
/* harmony import */ var _guidelines_icons_CodeIcon__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../guidelines/icons/CodeIcon */ "./src/components/guidelines/icons/CodeIcon.tsx");
/* harmony import */ var _guidelines_icons_ProblemIcon__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../guidelines/icons/ProblemIcon */ "./src/components/guidelines/icons/ProblemIcon.tsx");
/* harmony import */ var _guidelines_icons_StrategyIcon__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../guidelines/icons/StrategyIcon */ "./src/components/guidelines/icons/StrategyIcon.tsx");
/* harmony import */ var _guidelines_icons_ContestIcon__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../guidelines/icons/ContestIcon */ "./src/components/guidelines/icons/ContestIcon.tsx");
/* harmony import */ var _guidelines_icons_SubmissionsPerDayIcon__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../guidelines/icons/SubmissionsPerDayIcon */ "./src/components/guidelines/icons/SubmissionsPerDayIcon.tsx");
/* harmony import */ var _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../guidelines/headings/Heading */ "./src/components/guidelines/headings/Heading.tsx");
/* harmony import */ var _hooks_use_home_statistics__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../hooks/use-home-statistics */ "./src/hooks/use-home-statistics.tsx");
/* harmony import */ var _HomeHeader_module_scss__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./HomeHeader.module.scss */ "./src/components/home-header/HomeHeader.module.scss");
/* harmony import */ var _HomeHeader_module_scss__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_HomeHeader_module_scss__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);




var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\home-header\\HomeHeader.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature();



















var keyToNameMap = {
  usersCount: 'Users',
  submissionsCount: 'Submissions',
  submissionsPerDayCount: 'Submissions per day',
  problemsCount: 'Problems',
  strategiesCount: 'Test strategies',
  contestsCount: 'Contests'
};
var defaultProps = {
  className: _HomeHeader_module_scss__WEBPACK_IMPORTED_MODULE_17___default.a.icon
};
/* eslint-disable react/jsx-props-no-spreading */

var keyToIconComponent = {
  usersCount: function usersCount(props) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_icons_UsersIcon__WEBPACK_IMPORTED_MODULE_9__["default"], Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, defaultProps), props), void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 36,
      columnNumber: 34
    }, _this);
  },
  submissionsCount: function submissionsCount(props) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_icons_CodeIcon__WEBPACK_IMPORTED_MODULE_10__["default"], Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, defaultProps), props), void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 37,
      columnNumber: 40
    }, _this);
  },
  submissionsPerDayCount: function submissionsPerDayCount(props) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_icons_SubmissionsPerDayIcon__WEBPACK_IMPORTED_MODULE_14__["default"], Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, defaultProps), props), void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 38,
      columnNumber: 46
    }, _this);
  },
  problemsCount: function problemsCount(props) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_icons_ProblemIcon__WEBPACK_IMPORTED_MODULE_11__["default"], Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, defaultProps), props), void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 39,
      columnNumber: 37
    }, _this);
  },
  strategiesCount: function strategiesCount(props) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_icons_StrategyIcon__WEBPACK_IMPORTED_MODULE_12__["default"], Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, defaultProps), props), void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 40,
      columnNumber: 39
    }, _this);
  },
  contestsCount: function contestsCount(props) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_icons_ContestIcon__WEBPACK_IMPORTED_MODULE_13__["default"], Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, defaultProps), props), void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 41,
      columnNumber: 37
    }, _this);
  }
};
/* eslint-enable react/jsx-props-no-spreading */

var HomeHeader = function HomeHeader() {
  _s();

  var _useHomeStatistics = Object(_hooks_use_home_statistics__WEBPACK_IMPORTED_MODULE_16__["useHomeStatistics"])(),
      statistics = _useHomeStatistics.state.statistics,
      load = _useHomeStatistics.actions.load;

  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee() {
      return C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return load();

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }, [load]);

  var _renderIcon = function renderIcon(type) {
    var props = {
      size: _guidelines_icons_common_icon_sizes__WEBPACK_IMPORTED_MODULE_6__["default"].ExtraLarge,
      children: {}
    };
    var func = keyToIconComponent[type];
    return func(props);
  };

  var renderStatistic = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (statisticItem) {
    var key = statisticItem.key,
        value = statisticItem.value;
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["Fragment"], {
      children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_statistic_box_StatisticBox__WEBPACK_IMPORTED_MODULE_8__["default"], {
        statistic: {
          name: keyToNameMap[key],
          value: value
        },
        renderIcon: function renderIcon() {
          return _renderIcon(key);
        }
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 73,
        columnNumber: 21
      }, _this)
    }, void 0, false);
  }, []);
  var statisticsList = Object(react__WEBPACK_IMPORTED_MODULE_3__["useMemo"])(function () {
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(statistics)) {
      return [];
    }

    return Object(_utils_object_utils__WEBPACK_IMPORTED_MODULE_5__["toList"])(statistics);
  }, [statistics]);
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["Fragment"], {
    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_15__["default"], {
      type: _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_15__["HeadingType"].primary,
      children: "SoftUni Judge Numbers"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 96,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_lists_List__WEBPACK_IMPORTED_MODULE_7__["default"], {
      values: statisticsList,
      itemFunc: renderStatistic,
      className: _HomeHeader_module_scss__WEBPACK_IMPORTED_MODULE_17___default.a.statisticsList,
      itemClassName: _HomeHeader_module_scss__WEBPACK_IMPORTED_MODULE_17___default.a.statisticsListItem,
      wrap: true,
      orientation: _guidelines_lists_List__WEBPACK_IMPORTED_MODULE_7__["Orientation"].horizontal
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 99,
      columnNumber: 13
    }, _this)]
  }, void 0, true);
};

_s(HomeHeader, "QLWEYQf90QKz9U+3mL/chbXV5l4=", false, function () {
  return [_hooks_use_home_statistics__WEBPACK_IMPORTED_MODULE_16__["useHomeStatistics"]];
});

_c = HomeHeader;
/* harmony default export */ __webpack_exports__["default"] = (HomeHeader);

var _c;

__webpack_require__.$Refresh$.register(_c, "HomeHeader");

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

/***/ }),

/***/ "./src/components/profile/profile-submissions/ProfileSubmissions.module.scss":
false,

/***/ "./src/components/profile/profile-submissions/ProfileSubmisssions.tsx":
/*!****************************************************************************!*\
  !*** ./src/components/profile/profile-submissions/ProfileSubmisssions.tsx ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);

var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\profile\\profile-submissions\\ProfileSubmisssions.tsx",
    _this = undefined;

/* eslint-disable */



// const columns: GridColDef[] = [
//     { field: 'id', headerName: '№', minWidth: 70, flex: 1 },
//     {
//         field: 'submittedOn',
//         headerName: 'Submitted On',
//         minWidth: 160,
//         flex: 1,
//         sortable: true,
//         valueGetter: (params: GridValueGetterParams) => `${formatDate(new Date(params.row.submittedOn))}`,
//     },
//     {
//         field: 'problem',
//         headerName: 'Task',
//         minWidth: 150,
//         flex: 1,
//         sortable: true,
//         renderCell: (params: GridValueGetterParams) => (
//             <Link to={`/submissions/${params.row.id}`} className={styles.contestLink}>{params.row.problem.name}</Link>
//         ),
//     },
//     {
//         field: 'points',
//         headerName: 'Points',
//         type: 'number',
//         minWidth: 70,
//         flex: 1,
//         sortable: true,
//         valueGetter: (params: GridValueGetterParams) => `${params.row.points}/${params.row.problem.maximumPoints}`,
//     },
//     {
//         field: 'maxUsedTime',
//         headerName: 'Memory Used',
//         type: 'string',
//         minWidth: 70,
//         flex: 1,
//         hide: true,
//         sortable: false,
//     },
//     {
//         field: 'maxUsedMemory',
//         headerName: 'Memory Used',
//         type: 'string',
//         minWidth: 70,
//         hide: true,
//         sortable: true,
//     },
//     {
//         field: 'executionResult',
//         headerName: 'Execution Result',
//         type: 'string',
//         minWidth: 250,
//         flex: 1,
//         sortable: false,
//         renderCell: (params: GridValueGetterParams) => (
//             <ExecutionResult testRuns={params.row.testRuns} />
//         ),
//     },
// ];
var ProfileSubmissions = function ProfileSubmissions() {
  // const { submissions, getUserSubmissions } = useSubmissions();
  //
  // useEffect(() => {
  //     getUserSubmissions();
  // }, [ getUserSubmissions ]);
  //
  // return (
  //     <div style={{ height: 400, width: '100%' }}>
  //         <DataGrid
  //           rows={submissions}
  //           columns={columns}
  //           pageSize={5}
  //           rowsPerPageOptions={[ 5 ]}
  //           disableSelectionOnClick
  //         />
  //     </div>
  // );
  var x = 5;
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__["jsxDEV"])("h1", {
    children: x
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 90,
    columnNumber: 13
  }, _this);
};

_c = ProfileSubmissions;
/* harmony default export */ __webpack_exports__["default"] = (ProfileSubmissions);

var _c;

__webpack_require__.$Refresh$.register(_c, "ProfileSubmissions");

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

/***/ }),

/***/ "./src/components/submissions/execution-result/ExecutionResult.module.scss":
false,

/***/ "./src/components/submissions/execution-result/ExecutionResult.tsx":
false,

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

_s(CurrentContestResultsProvider, "o+i/SV1iG4F3ATc7P4ENl0njLSI=", false, function () {
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

/***/ }),

/***/ "./src/hooks/submissions/use-submissions.tsx":
/*!***************************************************!*\
  !*** ./src/hooks/submissions/use-submissions.tsx ***!
  \***************************************************/
/*! exports provided: useSubmissions, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useSubmissions", function() { return useSubmissions; });
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
/* harmony import */ var _use_current_contest__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../use-current-contest */ "./src/hooks/use-current-contest.tsx");
/* harmony import */ var _use_problems__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../use-problems */ "./src/hooks/use-problems.tsx");
/* harmony import */ var _use_problem_submissions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./use-problem-submissions */ "./src/hooks/submissions/use-problem-submissions.tsx");
/* harmony import */ var _use_urls__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../use-urls */ "./src/hooks/use-urls.tsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);




var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\hooks\\submissions\\use-submissions.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature(),
    _s2 = __webpack_require__.$Refresh$.signature();











var defaultState = {
  state: {
    submissionCode: "\nfunction hello() {\n    alert('Hello world!');\n}\n",
    selectedSubmissionType: null
  }
};
var SubmissionsContext = /*#__PURE__*/Object(react__WEBPACK_IMPORTED_MODULE_3__["createContext"])(defaultState);

var SubmissionsProvider = function SubmissionsProvider(_ref) {
  _s();

  var children = _ref.children;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(defaultState.state.selectedSubmissionType),
      _useState2 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState, 2),
      selectedSubmissionType = _useState2[0],
      setSelectedSubmissionType = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(defaultState.state.submissionCode),
      _useState4 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState3, 2),
      submissionCode = _useState4[0],
      setSubmissionCode = _useState4[1];

  var _useUrls = Object(_use_urls__WEBPACK_IMPORTED_MODULE_10__["useUrls"])(),
      getSubmitUrl = _useUrls.getSubmitUrl;

  var _useLoading = Object(_use_loading__WEBPACK_IMPORTED_MODULE_5__["useLoading"])(),
      startLoading = _useLoading.startLoading,
      stopLoading = _useLoading.stopLoading;

  var _useProblems = Object(_use_problems__WEBPACK_IMPORTED_MODULE_8__["useProblems"])(),
      currentProblem = _useProblems.state.currentProblem;

  var _useProblemSubmission = Object(_use_problem_submissions__WEBPACK_IMPORTED_MODULE_9__["useProblemSubmissions"])(),
      loadSubmissions = _useProblemSubmission.actions.loadSubmissions;

  var _useCurrentContest = Object(_use_current_contest__WEBPACK_IMPORTED_MODULE_7__["useCurrentContest"])(),
      isOfficial = _useCurrentContest.state.isOfficial;

  var _useHttp = Object(_use_http__WEBPACK_IMPORTED_MODULE_6__["useHttp"])(getSubmitUrl),
      submitCode = _useHttp.post,
      submitCodeResult = _useHttp.data;

  var submit = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])( /*#__PURE__*/Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee() {
    var _ref3, id, _ref4, problemId;

    return C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            startLoading();
            _ref3 = selectedSubmissionType || {}, id = _ref3.id;
            _ref4 = currentProblem || {}, problemId = _ref4.id;
            _context.next = 5;
            return submitCode({
              ProblemId: problemId,
              SubmissionTypeId: id,
              Content: submissionCode,
              Official: isOfficial
            });

          case 5:
            stopLoading();

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })), [startLoading, selectedSubmissionType, currentProblem, submitCode, submissionCode, isOfficial, stopLoading]);
  var selectSubmissionTypeById = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (id) {
    var _ref5 = currentProblem || {},
        allowedSubmissionTypes = _ref5.allowedSubmissionTypes;

    if (allowedSubmissionTypes == null) {
      return;
    }

    var newSubmissionType = allowedSubmissionTypes.find(function (st) {
      return st.id === id;
    });

    if (!newSubmissionType) {
      return;
    }

    setSelectedSubmissionType(newSubmissionType);
  }, [currentProblem]);

  var updateSubmissionCode = function updateSubmissionCode(code) {
    setSubmissionCode(code);
  };

  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    var _ref6 = currentProblem || {},
        allowedSubmissionTypes = _ref6.allowedSubmissionTypes;

    var submissionType = Object(lodash__WEBPACK_IMPORTED_MODULE_4__["first"])(allowedSubmissionTypes);

    if (submissionType) {
      var _id = submissionType.id;
      selectSubmissionTypeById(_id);
    } else {
      selectSubmissionTypeById(null);
    }
  }, [currentProblem, selectSubmissionTypeById]);
  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee2() {
      return C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return loadSubmissions();

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  }, [loadSubmissions, submitCodeResult]);
  var value = {
    state: {
      submissionCode: submissionCode,
      selectedSubmissionType: selectedSubmissionType
    },
    actions: {
      updateSubmissionCode: updateSubmissionCode,
      selectSubmissionTypeById: selectSubmissionTypeById,
      submit: submit
    }
  };
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(SubmissionsContext.Provider, {
    value: value,
    children: children
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 137,
    columnNumber: 9
  }, _this);
};

_s(SubmissionsProvider, "kCnMZEA+07/bSIsUgyIhFNSEpY0=", false, function () {
  return [_use_urls__WEBPACK_IMPORTED_MODULE_10__["useUrls"], _use_loading__WEBPACK_IMPORTED_MODULE_5__["useLoading"], _use_problems__WEBPACK_IMPORTED_MODULE_8__["useProblems"], _use_problem_submissions__WEBPACK_IMPORTED_MODULE_9__["useProblemSubmissions"], _use_current_contest__WEBPACK_IMPORTED_MODULE_7__["useCurrentContest"], _use_http__WEBPACK_IMPORTED_MODULE_6__["useHttp"]];
});

_c = SubmissionsProvider;

var useSubmissions = function useSubmissions() {
  _s2();

  return Object(react__WEBPACK_IMPORTED_MODULE_3__["useContext"])(SubmissionsContext);
};

_s2(useSubmissions, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");


/* harmony default export */ __webpack_exports__["default"] = (SubmissionsProvider);

var _c;

__webpack_require__.$Refresh$.register(_c, "SubmissionsProvider");

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

/***/ }),

/***/ "./src/hooks/use-current-contest.tsx":
/*!*******************************************!*\
  !*** ./src/hooks/use-current-contest.tsx ***!
  \*******************************************/
/*! exports provided: default, useCurrentContest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useCurrentContest", function() { return useCurrentContest; });
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator/index.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _use_loading__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./use-loading */ "./src/hooks/use-loading.tsx");
/* harmony import */ var _use_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./use-http */ "./src/hooks/use-http.tsx");
/* harmony import */ var _use_urls__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./use-urls */ "./src/hooks/use-urls.tsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);




var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\hooks\\use-current-contest.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature(),
    _s2 = __webpack_require__.$Refresh$.signature();








var defaultState = {
  state: {
    contest: null,
    contestPassword: null,
    score: 0,
    maxScore: 0,
    isOfficial: false,
    requirePassword: false,
    remainingTimeInMilliseconds: 0.0
  }
};
var CurrentContestsContext = /*#__PURE__*/Object(react__WEBPACK_IMPORTED_MODULE_3__["createContext"])(defaultState);

var CurrentContestsProvider = function CurrentContestsProvider(_ref) {
  _s();

  var children = _ref.children;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(defaultState.state.contest),
      _useState2 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState, 2),
      contest = _useState2[0],
      setContest = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(defaultState.state.contest),
      _useState4 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState3, 2),
      contestPassword = _useState4[0],
      setContestPassword = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(defaultState.state.score),
      _useState6 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState5, 2),
      score = _useState6[0],
      setScore = _useState6[1];

  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(defaultState.state.maxScore),
      _useState8 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState7, 2),
      maxScore = _useState8[0],
      setMaxScore = _useState8[1];

  var _useState9 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(defaultState.state.isOfficial),
      _useState10 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState9, 2),
      isOfficial = _useState10[0],
      setIsOfficial = _useState10[1];

  var _useState11 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(null),
      _useState12 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState11, 2),
      requirePassword = _useState12[0],
      setRequirePassword = _useState12[1];

  var _useState13 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(null),
      _useState14 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState13, 2),
      contestToStart = _useState14[0],
      setContestToStart = _useState14[1];

  var _useState15 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(null),
      _useState16 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState15, 2),
      registerForContestParams = _useState16[0],
      setRegisterForContestParams = _useState16[1];

  var _useState17 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(null),
      _useState18 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState17, 2),
      submitContestPasswordUrlParams = _useState18[0],
      setSubmitContestPasswordUrlParams = _useState18[1];

  var _useState19 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(null),
      _useState20 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState19, 2),
      submitContestPasswordErrorMessage = _useState20[0],
      setSubmitContestPasswordErrorMessage = _useState20[1];

  var _useState21 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(null),
      _useState22 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState21, 2),
      isPasswordValid = _useState22[0],
      setIsPasswordValid = _useState22[1];

  var _useState23 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(defaultState.state.remainingTimeInMilliseconds),
      _useState24 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState23, 2),
      remainingTimeInMilliseconds = _useState24[0],
      setRemainingTimeInMilliseconds = _useState24[1];

  var _useLoading = Object(_use_loading__WEBPACK_IMPORTED_MODULE_5__["useLoading"])(),
      startLoading = _useLoading.startLoading,
      stopLoading = _useLoading.stopLoading;

  var _useUrls = Object(_use_urls__WEBPACK_IMPORTED_MODULE_7__["useUrls"])(),
      getStartContestParticipationUrl = _useUrls.getStartContestParticipationUrl,
      getRegisterForContestUrl = _useUrls.getRegisterForContestUrl,
      getSubmitContestPasswordUrl = _useUrls.getSubmitContestPasswordUrl;

  var _useHttp = Object(_use_http__WEBPACK_IMPORTED_MODULE_6__["useHttp"])(getStartContestParticipationUrl, contestToStart),
      startContest = _useHttp.get,
      startContestData = _useHttp.data;

  var _useHttp2 = Object(_use_http__WEBPACK_IMPORTED_MODULE_6__["useHttp"])(getRegisterForContestUrl, registerForContestParams),
      registerForContest = _useHttp2.get,
      registerForContestData = _useHttp2.data;

  var _useHttp3 = Object(_use_http__WEBPACK_IMPORTED_MODULE_6__["useHttp"])(getSubmitContestPasswordUrl, submitContestPasswordUrlParams),
      submitContestPassword = _useHttp3.post,
      submitContestPasswordData = _useHttp3.data,
      submitContestPasswordResponse = _useHttp3.response;

  var start = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (obj) {
    setContestToStart(obj);
  }, []);
  var register = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (obj) {
    var id = obj.id,
        official = obj.isOfficial;
    setRegisterForContestParams({
      id: id,
      isOfficial: official
    });
  }, []);
  var submitPassword = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (_ref2) {
    var id = _ref2.id,
        official = _ref2.isOfficial,
        password = _ref2.password;
    setSubmitContestPasswordUrlParams({
      id: id,
      isOfficial: official
    });
    setContestPassword(password);
  }, []);
  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(contestToStart)) {
      return;
    }

    Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee() {
      return C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              startLoading();
              _context.next = 3;
              return startContest();

            case 3:
              stopLoading();

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }, [contestToStart, startContest, startLoading, stopLoading]);
  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(startContestData)) {
      return;
    }

    var responseData = startContestData;
    var newContest = responseData.contest,
        contestIsCompete = responseData.contestIsCompete,
        newRemainingTimeInMilliseconds = responseData.remainingTimeInMilliseconds;
    setContest(newContest);
    setIsOfficial(contestIsCompete);
    setRemainingTimeInMilliseconds(newRemainingTimeInMilliseconds);
  }, [startContestData]);
  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(registerForContestParams)) {
      return;
    }

    Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee2() {
      return C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              startLoading();
              _context2.next = 3;
              return registerForContest();

            case 3:
              stopLoading();

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  }, [registerForContest, registerForContestParams, startLoading, stopLoading]);
  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(registerForContestData)) {
      return;
    }

    var responseData = registerForContestData;
    var responseRequirePassword = responseData.requirePassword;
    setContest({
      id: responseData.id,
      name: responseData.name
    });
    setRequirePassword(responseRequirePassword);
  }, [registerForContestData]);
  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(submitContestPasswordUrlParams)) {
      return;
    }

    Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee3() {
      return C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              startLoading();
              _context3.next = 3;
              return submitContestPassword({
                password: contestPassword
              });

            case 3:
              stopLoading();

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }))();
  }, [contestPassword, submitContestPassword, submitContestPasswordUrlParams, startLoading, stopLoading]);
  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(submitContestPasswordData)) {
      return;
    } // TODO: fix this https://github.com/SoftUni-Internal/exam-systems-issues/issues/224


    if (!Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(submitContestPasswordResponse) && submitContestPasswordResponse.status !== 200) {
      setSubmitContestPasswordErrorMessage('Incorrect password');
      setIsPasswordValid(false);
      return;
    }

    setIsPasswordValid(true);
    setSubmitContestPasswordErrorMessage(null);
  }, [registerForContestData, submitContestPasswordData, submitContestPasswordResponse]);
  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    var _ref6 = contest || {},
        problems = _ref6.problems;

    if (Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(problems)) {
      return;
    }

    setScore(Object(lodash__WEBPACK_IMPORTED_MODULE_4__["sum"])(problems.map(function (p) {
      return p.points;
    })));
    setMaxScore(Object(lodash__WEBPACK_IMPORTED_MODULE_4__["sum"])(problems.map(function (p) {
      return p.maximumPoints;
    })));
  }, [contest]);
  var value = {
    state: {
      contest: contest,
      contestPassword: contestPassword,
      score: score,
      maxScore: maxScore,
      isOfficial: isOfficial,
      requirePassword: requirePassword,
      submitContestPasswordErrorMessage: submitContestPasswordErrorMessage,
      isPasswordValid: isPasswordValid,
      remainingTimeInMilliseconds: remainingTimeInMilliseconds
    },
    actions: {
      setContestPassword: setContestPassword,
      register: register,
      start: start,
      submitPassword: submitPassword
    }
  };
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(CurrentContestsContext.Provider, {
    value: value,
    children: children
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 236,
    columnNumber: 9
  }, _this);
};

_s(CurrentContestsProvider, "yuilTsQulpvNw7IE3xpej0tMIQA=", false, function () {
  return [_use_loading__WEBPACK_IMPORTED_MODULE_5__["useLoading"], _use_urls__WEBPACK_IMPORTED_MODULE_7__["useUrls"], _use_http__WEBPACK_IMPORTED_MODULE_6__["useHttp"], _use_http__WEBPACK_IMPORTED_MODULE_6__["useHttp"], _use_http__WEBPACK_IMPORTED_MODULE_6__["useHttp"]];
});

_c = CurrentContestsProvider;

var useCurrentContest = function useCurrentContest() {
  _s2();

  return Object(react__WEBPACK_IMPORTED_MODULE_3__["useContext"])(CurrentContestsContext);
};

_s2(useCurrentContest, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");

/* harmony default export */ __webpack_exports__["default"] = (CurrentContestsProvider);


var _c;

__webpack_require__.$Refresh$.register(_c, "CurrentContestsProvider");

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

/***/ }),

/***/ "./src/identity-config.ts":
/*!********************************!*\
  !*** ./src/identity-config.ts ***!
  \********************************/
/*! exports provided: IDENTITY_CONFIG, METADATA_OIDC */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IDENTITY_CONFIG", function() { return IDENTITY_CONFIG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "METADATA_OIDC", function() { return METADATA_OIDC; });
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);

// import { WebStorageStateStore } from 'oidc-client';
var appBaseUrl = window.URLS.UI_URL;
var authorityBaseUrl = Object({"NODE_ENV":"development","PUBLIC_URL":"","WDS_SOCKET_HOST":undefined,"WDS_SOCKET_PATH":undefined,"WDS_SOCKET_PORT":undefined,"FAST_REFRESH":true}).REACT_APP_PLATFORM_IDENTITY_BASE_URL;
var authorityUrl = "".concat(Object({"NODE_ENV":"development","PUBLIC_URL":"","WDS_SOCKET_HOST":undefined,"WDS_SOCKET_PATH":undefined,"WDS_SOCKET_PORT":undefined,"FAST_REFRESH":true}).REACT_APP_PLATFORM_IDENTITY_BASE_URL).concat(Object({"NODE_ENV":"development","PUBLIC_URL":"","WDS_SOCKET_HOST":undefined,"WDS_SOCKET_PATH":undefined,"WDS_SOCKET_PORT":undefined,"FAST_REFRESH":true}).REACT_APP_PLATFORM_IDENTITY_AUTHORITY_URL_POSTFIX);
var authorityRegisterUrl = "".concat(authorityUrl, "/register"); // eslint-disable-next-line max-len

var IDENTITY_CONFIG = {
  authority: authorityBaseUrl,
  client_id: Object({"NODE_ENV":"development","PUBLIC_URL":"","WDS_SOCKET_HOST":undefined,"WDS_SOCKET_PATH":undefined,"WDS_SOCKET_PORT":undefined,"FAST_REFRESH":true}).REACT_APP_IDENTITY_CLIENT_ID,
  redirect_uri: "".concat(appBaseUrl, "/logincallback"),
  login: "".concat(authorityUrl),
  register: authorityRegisterUrl,
  automaticSilentRenew: false,
  loadUserInfo: true,
  silent_redirect_uri: "".concat(appBaseUrl, "/silentrenew"),
  scope: Object({"NODE_ENV":"development","PUBLIC_URL":"","WDS_SOCKET_HOST":undefined,"WDS_SOCKET_PATH":undefined,"WDS_SOCKET_PORT":undefined,"FAST_REFRESH":true}).REACT_APP_IDENTITY_ALLOWED_SCOPES,
  response_type: Object({"NODE_ENV":"development","PUBLIC_URL":"","WDS_SOCKET_HOST":undefined,"WDS_SOCKET_PATH":undefined,"WDS_SOCKET_PORT":undefined,"FAST_REFRESH":true}).REACT_APP_RESPONSE_TYPE,
  // stateStore: new WebStorageStateStore({ store: window.localStorage }),
  canAccessAdministrationCookieName: 'can_access_administration',
  loggedInUsernameCookieName: 'logged_in_username'
};
var METADATA_OIDC = {
  issuer: authorityBaseUrl,
  jwks_uri: "".concat(authorityBaseUrl, "/.well-known/jwks"),
  authorization_endpoint: "".concat(authorityUrl, "/authorize"),
  token_endpoint: "".concat(authorityUrl, "/token"),
  userinfo_endpoint: "".concat(authorityUrl, "/userinfo"),
  end_session_endpoint: "".concat(authorityUrl, "/endsession"),
  check_session_iframe: "".concat(authorityUrl, "/checksession"),
  revocation_endpoint: "".concat(authorityUrl, "/revocation"),
  introspection_endpoint: "".concat(authorityUrl, "/introspect")
};


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

/***/ }),

/***/ "./src/index.tsx":
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
!(function webpackMissingModule() { var e = new Error("Cannot find module 'react-dom/client'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./App */ "./src/App.tsx");
/* harmony import */ var _components_guidelines_loading_Loading__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/guidelines/loading/Loading */ "./src/components/guidelines/loading/Loading.tsx");
/* harmony import */ var _registerServiceWorker__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./registerServiceWorker */ "./src/registerServiceWorker.ts");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);

var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\index.tsx";






var container = document.getElementById('root');
var root = !(function webpackMissingModule() { var e = new Error("Cannot find module 'react-dom/client'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(container);
root.render( /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__["jsxDEV"])(react__WEBPACK_IMPORTED_MODULE_0__["Suspense"], {
  fallback: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__["jsxDEV"])(_components_guidelines_loading_Loading__WEBPACK_IMPORTED_MODULE_3__["default"], {
    isWholePage: true,
    isLoading: true
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 12,
    columnNumber: 33
  }, undefined),
  children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__["jsxDEV"])(_App__WEBPACK_IMPORTED_MODULE_2__["default"], {}, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 13,
    columnNumber: 9
  }, undefined)
}, void 0, false, {
  fileName: _jsxFileName,
  lineNumber: 12,
  columnNumber: 13
}, undefined));
Object(_registerServiceWorker__WEBPACK_IMPORTED_MODULE_4__["default"])();

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
//# sourceMappingURL=main.ed7e78410c1f87466831.hot-update.js.map