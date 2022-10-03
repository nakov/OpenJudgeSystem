webpackHotUpdate("main",{

/***/ "./src/pages/contests/ContestsPage.tsx":
/*!*********************************************!*\
  !*** ./src/pages/contests/ContestsPage.tsx ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_contests_contests_filters_ContestFilters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/contests/contests-filters/ContestFilters */ "./src/components/contests/contests-filters/ContestFilters.tsx");
/* harmony import */ var _hooks_use_contests__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/use-contests */ "./src/hooks/use-contests.tsx");
/* harmony import */ var _shared_set_layout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shared/set-layout */ "./src/pages/shared/set-layout.tsx");
/* harmony import */ var _components_home_contests_contest_card_ContestCard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/home-contests/contest-card/ContestCard */ "./src/components/home-contests/contest-card/ContestCard.tsx");
/* harmony import */ var _components_guidelines_lists_List__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/guidelines/lists/List */ "./src/components/guidelines/lists/List.tsx");
/* harmony import */ var _components_guidelines_pagination_PaginationControls__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../components/guidelines/pagination/PaginationControls */ "./src/components/guidelines/pagination/PaginationControls.tsx");
/* harmony import */ var _common_contest_types__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../common/contest-types */ "./src/common/contest-types.ts");
/* harmony import */ var _components_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../components/guidelines/headings/Heading */ "./src/components/guidelines/headings/Heading.tsx");
/* harmony import */ var _components_guidelines_breadcrumb_Breadcrumb__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../components/guidelines/breadcrumb/Breadcrumb */ "./src/components/guidelines/breadcrumb/Breadcrumb.tsx");
/* harmony import */ var _hooks_use_contest_categories_breadcrumb__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../hooks/use-contest-categories-breadcrumb */ "./src/hooks/use-contest-categories-breadcrumb.tsx");
/* harmony import */ var _components_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../components/guidelines/buttons/Button */ "./src/components/guidelines/buttons/Button.tsx");
/* harmony import */ var _utils_class_names__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../utils/class-names */ "./src/utils/class-names.ts");
/* harmony import */ var _ContestsPage_module_scss__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./ContestsPage.module.scss */ "./src/pages/contests/ContestsPage.module.scss");
/* harmony import */ var _ContestsPage_module_scss__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_ContestsPage_module_scss__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);

var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\pages\\contests\\ContestsPage.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature();



















var getBreadcrumbItemPath = function getBreadcrumbItemPath(id) {
  return "/contests?".concat(_common_contest_types__WEBPACK_IMPORTED_MODULE_8__["FilterType"].Category.toString(), "=").concat(id);
};

var ContestsPage = function ContestsPage() {
  _s();

  var _useContests = Object(_hooks_use_contests__WEBPACK_IMPORTED_MODULE_3__["useContests"])(),
      _useContests$state = _useContests.state,
      contests = _useContests$state.contests,
      pagesInfo = _useContests$state.pagesInfo,
      currentPage = _useContests$state.currentPage,
      _useContests$actions = _useContests.actions,
      toggleFilter = _useContests$actions.toggleFilter,
      changePage = _useContests$actions.changePage;

  var _useCategoriesBreadcr = Object(_hooks_use_contest_categories_breadcrumb__WEBPACK_IMPORTED_MODULE_11__["useCategoriesBreadcrumbs"])(),
      breadcrumbItems = _useCategoriesBreadcr.state.breadcrumbItems;

  var handlePageChange = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function (page) {
    return changePage(page);
  }, [changePage]);
  var handleFilterClick = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function (filter) {
    return toggleFilter(filter);
  }, [toggleFilter]);
  var renderContest = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function (contest) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(_components_home_contests_contest_card_ContestCard__WEBPACK_IMPORTED_MODULE_5__["default"], {
      contest: contest
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 47,
      columnNumber: 13
    }, _this);
  }, []);
  var renderContests = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function () {
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isNil"])(contests) || Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isEmpty"])(contests)) {
      return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(_components_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_9__["default"], {
        type: _components_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_9__["HeadingType"].secondary,
        children: "No contests apply for this filter"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 56,
        columnNumber: 21
      }, _this);
    }

    var pagesCount = pagesInfo.pagesCount;
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["Fragment"], {
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(_components_guidelines_pagination_PaginationControls__WEBPACK_IMPORTED_MODULE_7__["default"], {
        count: pagesCount,
        page: currentPage,
        onChange: handlePageChange
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 66,
        columnNumber: 21
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(_components_guidelines_lists_List__WEBPACK_IMPORTED_MODULE_6__["default"], {
        values: contests,
        itemFunc: renderContest,
        itemClassName: _ContestsPage_module_scss__WEBPACK_IMPORTED_MODULE_14___default.a.contestItem,
        orientation: _components_guidelines_lists_List__WEBPACK_IMPORTED_MODULE_6__["Orientation"].horizontal,
        wrap: true
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 71,
        columnNumber: 21
      }, _this)]
    }, void 0, true);
  }, [contests, currentPage, handlePageChange, pagesInfo, renderContest]);
  var renderCategoriesBreadcrumbItem = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function (categoryBreadcrumbItem) {
    var value = categoryBreadcrumbItem.value,
        isLast = categoryBreadcrumbItem.isLast,
        id = categoryBreadcrumbItem.id;
    var classNames = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_13__["default"])(_ContestsPage_module_scss__WEBPACK_IMPORTED_MODULE_14___default.a.breadcrumbBtn, isLast ? _ContestsPage_module_scss__WEBPACK_IMPORTED_MODULE_14___default.a.breadcrumbBtnLast : '');
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(_components_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_12__["LinkButton"], {
      type: _components_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_12__["LinkButtonType"].plain,
      className: classNames,
      to: getBreadcrumbItemPath(id),
      text: value
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 92,
      columnNumber: 17
    }, _this);
  }, []);
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["Fragment"], {
    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(_components_guidelines_breadcrumb_Breadcrumb__WEBPACK_IMPORTED_MODULE_10__["default"], {
      items: breadcrumbItems,
      itemFunc: renderCategoriesBreadcrumbItem
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 100,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])("div", {
      className: _ContestsPage_module_scss__WEBPACK_IMPORTED_MODULE_14___default.a.container,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(_components_contests_contests_filters_ContestFilters__WEBPACK_IMPORTED_MODULE_2__["default"], {
        onFilterClick: handleFilterClick
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 102,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])("div", {
        children: renderContests()
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 103,
        columnNumber: 17
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 101,
      columnNumber: 13
    }, _this)]
  }, void 0, true);
};

_s(ContestsPage, "oGAfH53B0On2eAQxMnpK7pzbac0=", false, function () {
  return [_hooks_use_contests__WEBPACK_IMPORTED_MODULE_3__["useContests"], _hooks_use_contest_categories_breadcrumb__WEBPACK_IMPORTED_MODULE_11__["useCategoriesBreadcrumbs"]];
});

_c = ContestsPage;
/* harmony default export */ __webpack_exports__["default"] = (_c2 = Object(_shared_set_layout__WEBPACK_IMPORTED_MODULE_4__["setLayout"])(ContestsPage, true));

var _c, _c2;

__webpack_require__.$Refresh$.register(_c, "ContestsPage");
__webpack_require__.$Refresh$.register(_c2, "%default%");

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
//# sourceMappingURL=main.19d9279dc645973cd9e7.hot-update.js.map