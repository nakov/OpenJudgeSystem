webpackHotUpdate("main",{

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
var defeaultProps = {
  className: _HomeHeader_module_scss__WEBPACK_IMPORTED_MODULE_17___default.a.icon
};
/* eslint-disable react/jsx-props-no-spreading */

var keyToIconComponent = {
  usersCount: function usersCount(props) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_icons_UsersIcon__WEBPACK_IMPORTED_MODULE_9__["default"], Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, defeaultProps), props), void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 36,
      columnNumber: 34
    }, _this);
  },
  submissionsCount: function submissionsCount(props) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_icons_CodeIcon__WEBPACK_IMPORTED_MODULE_10__["default"], Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, defeaultProps), props), void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 37,
      columnNumber: 40
    }, _this);
  },
  submissionsPerDayCount: function submissionsPerDayCount(props) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_icons_SubmissionsPerDayIcon__WEBPACK_IMPORTED_MODULE_14__["default"], Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, defeaultProps), props), void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 38,
      columnNumber: 46
    }, _this);
  },
  problemsCount: function problemsCount(props) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_icons_ProblemIcon__WEBPACK_IMPORTED_MODULE_11__["default"], Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, defeaultProps), props), void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 39,
      columnNumber: 37
    }, _this);
  },
  strategiesCount: function strategiesCount(props) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_icons_StrategyIcon__WEBPACK_IMPORTED_MODULE_12__["default"], Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, defeaultProps), props), void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 40,
      columnNumber: 39
    }, _this);
  },
  contestsCount: function contestsCount(props) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_guidelines_icons_ContestIcon__WEBPACK_IMPORTED_MODULE_13__["default"], Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, defeaultProps), props), void 0, false, {
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
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_18__["jsxDEV"])(_statistic_box_StatisticBox__WEBPACK_IMPORTED_MODULE_8__["default"], {
      statistic: {
        name: keyToNameMap[key],
        value: value
      },
      renderIcon: function renderIcon() {
        return _renderIcon(key);
      }
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 72,
      columnNumber: 17
    }, _this);
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
      lineNumber: 94,
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
      lineNumber: 97,
      columnNumber: 13
    }, _this)]
  }, void 0, true);
};

_s(HomeHeader, "TX+Pwt+hNtqT2cnkM9iHmCG8qGw=", false, function () {
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

/***/ })

})
//# sourceMappingURL=main.30432f65af19e0437cf0.hot-update.js.map