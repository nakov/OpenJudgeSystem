webpackHotUpdate("main",{

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
/* harmony import */ var _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ContestFilters.module.scss */ "./src/components/contests/contests-filters/ContestFilters.module.scss");
/* harmony import */ var _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../guidelines/buttons/Button */ "./src/components/guidelines/buttons/Button.tsx");
/* harmony import */ var _hooks_use_contests__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../hooks/use-contests */ "./src/hooks/use-contests.tsx");
/* harmony import */ var _common_filter_utils__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../common/filter-utils */ "./src/common/filter-utils.ts");
/* harmony import */ var _guidelines_buttons_ExpandButton__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../guidelines/buttons/ExpandButton */ "./src/components/guidelines/buttons/ExpandButton.tsx");
/* harmony import */ var _utils_class_names__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../utils/class-names */ "./src/utils/class-names.ts");
/* harmony import */ var _hooks_use_contest_strategy_filters__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../hooks/use-contest-strategy-filters */ "./src/hooks/use-contest-strategy-filters.tsx");
/* harmony import */ var _hooks_use_contest_categories__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../hooks/use-contest-categories */ "./src/hooks/use-contest-categories.tsx");
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

  var _useContestStrategyFi = Object(_hooks_use_contest_strategy_filters__WEBPACK_IMPORTED_MODULE_16__["useContestStrategyFilters"])(),
      loadStrategies = _useContestStrategyFi.actions.load;

  var _useContestCategories = Object(_hooks_use_contest_categories__WEBPACK_IMPORTED_MODULE_17__["useContestCategories"])(),
      loadCategories = _useContestCategories.actions.load;

  var _useContests = Object(_hooks_use_contests__WEBPACK_IMPORTED_MODULE_12__["useContests"])(),
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
  var getRenderStatusFilterItem = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (buttonType, btnClassName) {
    return function (_ref3) {
      var id = _ref3.id,
          name = _ref3.name;
      return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_11__["default"], {
        type: buttonType,
        onClick: function onClick() {
          return handleFilterClick(id);
        },
        className: btnClassName,
        text: name,
        size: _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_11__["ButtonSize"].small
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 60,
        columnNumber: 17
      }, _this);
    };
  }, [handleFilterClick, filters]);
  var strategyHeader = 'strategy-Header';
  var strategyHeaderClassName = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_15__["default"])(strategyHeader, _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.strategyHeader);
  var strategyElement = 'strategy-Element';
  var strategyElementClassName = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_15__["default"])(strategyElement, _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.strategyElementClassName);
  var strategyTooltip = 'tooltip';
  var strategyTooltipClassName = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_15__["default"])(strategyTooltip, _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.tooltip);
  var strategyTooltipElement = 'tooltip-Element';
  var strategyTooltipElementClassName = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_15__["default"])(strategyTooltipElement, _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.tooltipElement);
  var getRenderStrategyFilterItem = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (buttonType, btnClassName) {
    return function (_ref4) {
      var id = _ref4.id,
          name = _ref4.name;
      return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])("div", {
        className: strategyHeaderClassName,
        children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])("div", {
          className: strategyTooltipClassName,
          children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])("span", {
            className: strategyTooltipElementClassName,
            children: name
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 86,
            columnNumber: 25
          }, _this)
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 85,
          columnNumber: 21
        }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_11__["default"], {
          type: buttonType,
          onClick: function onClick() {
            return handleFilterClick(id);
          },
          className: btnClassName + strategyElementClassName,
          text: name,
          size: _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_11__["ButtonSize"].small
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 88,
          columnNumber: 21
        }, _this)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 84,
        columnNumber: 17
      }, _this);
    };
  }, [strategyTooltipClassName, strategyTooltipElementClassName, strategyElementClassName, strategyHeaderClassName, handleFilterClick, filters]);
  var getRenderFilterItem = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (type) {
    return function (_ref5) {
      var id = _ref5.id,
          name = _ref5.name;
      var filterIsSelected = filters.some(function (f) {
        return f.name === name;
      });
      var buttonType = filterIsSelected ? _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_11__["ButtonType"].primary : _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_11__["ButtonType"].secondary;
      var btnClassName = type === _common_contest_types__WEBPACK_IMPORTED_MODULE_8__["FilterType"].Strategy ? _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.btnSelectFilter : '';
      return type === _common_contest_types__WEBPACK_IMPORTED_MODULE_8__["FilterType"].Strategy ? getRenderStrategyFilterItem(buttonType, btnClassName) : getRenderStatusFilterItem(buttonType, btnClassName);
    };
  }, [strategyTooltipClassName, strategyTooltipElementClassName, strategyElementClassName, strategyHeaderClassName, handleFilterClick, filters]);
  var toggleFiltersExpanded = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (isExpanded) {
    return setExpanded(isExpanded);
  }, []);
  var renderExpandButton = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (allFilters) {
    var maxFiltersToDisplayCount = 3;
    return allFilters.length > maxFiltersToDisplayCount ? /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_buttons_ExpandButton__WEBPACK_IMPORTED_MODULE_14__["default"], {
      onExpandChanged: toggleFiltersExpanded
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 134,
      columnNumber: 19
    }, _this) : null;
  }, [toggleFiltersExpanded]);
  var renderFilter = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (fg) {
    var type = fg.type,
        groupFilters = fg.filters;
    var className = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_15__["default"])(_ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.listFilters, expanded ? _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.expanded : '');
    var listOrientation = type === _common_contest_types__WEBPACK_IMPORTED_MODULE_8__["FilterType"].Status ? _guidelines_lists_List__WEBPACK_IMPORTED_MODULE_6__["Orientation"].horizontal : _guidelines_lists_List__WEBPACK_IMPORTED_MODULE_6__["Orientation"].vertical;
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])("div", {
      className: _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.filterTypeContainer,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_7__["default"], {
        type: _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_7__["HeadingType"].small,
        className: _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.heading,
        children: type
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 156,
        columnNumber: 21
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_lists_List__WEBPACK_IMPORTED_MODULE_6__["default"], {
        values: groupFilters,
        itemFunc: getRenderStrategyFilterItem(type),
        orientation: listOrientation,
        className: className,
        itemClassName: _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.listFilterItem,
        fullWidth: true
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 162,
        columnNumber: 21
      }, _this), renderExpandButton(groupFilters)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 155,
      columnNumber: 17
    }, _this);
  }, [getRenderStatusFilterItem, getRenderStrategyFilterItem, expanded, renderExpandButton]);
  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    var plainFilters = possibleFilters.filter(function (_ref6) {
      var type = _ref6.type;
      return type !== _common_contest_types__WEBPACK_IMPORTED_MODULE_8__["FilterType"].Category;
    });
    setFiltersGroups(Object(_common_filter_utils__WEBPACK_IMPORTED_MODULE_13__["groupByType"])(plainFilters));
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
    className: _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.container,
    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_contest_categories_ContestCategories__WEBPACK_IMPORTED_MODULE_9__["default"], {
      className: _ContestFilters_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.filterTypeContainer,
      onCategoryClick: onFilterClick,
      defaultSelected: defaultSelected
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 229,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_lists_List__WEBPACK_IMPORTED_MODULE_6__["default"], {
      values: filtersGroups,
      itemFunc: renderFilter,
      fullWidth: true
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 234,
      columnNumber: 13
    }, _this)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 228,
    columnNumber: 9
  }, _this);
};

_s(ContestFilters, "NQp5uxVd3qFwtv7zxjSHrR2Fc8I=", false, function () {
  return [react_router_dom__WEBPACK_IMPORTED_MODULE_5__["useSearchParams"], _hooks_use_contest_strategy_filters__WEBPACK_IMPORTED_MODULE_16__["useContestStrategyFilters"], _hooks_use_contest_categories__WEBPACK_IMPORTED_MODULE_17__["useContestCategories"], _hooks_use_contests__WEBPACK_IMPORTED_MODULE_12__["useContests"]];
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

/***/ })

})
//# sourceMappingURL=main.757ccf0a002f673e924d.hot-update.js.map