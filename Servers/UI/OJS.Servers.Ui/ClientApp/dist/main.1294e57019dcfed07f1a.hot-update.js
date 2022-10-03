webpackHotUpdate("main",{

/***/ "./src/components/contests/contest-tasks-navigation/ContestTasksNavigation.tsx":
/*!*************************************************************************************!*\
  !*** ./src/components/contests/contest-tasks-navigation/ContestTasksNavigation.tsx ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../guidelines/headings/Heading */ "./src/components/guidelines/headings/Heading.tsx");
/* harmony import */ var _guidelines_lists_List__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../guidelines/lists/List */ "./src/components/guidelines/lists/List.tsx");
/* harmony import */ var _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../guidelines/buttons/Button */ "./src/components/guidelines/buttons/Button.tsx");
/* harmony import */ var _utils_class_names__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/class-names */ "./src/utils/class-names.ts");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../common/constants */ "./src/common/constants.ts");
/* harmony import */ var _hooks_use_problems__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../hooks/use-problems */ "./src/hooks/use-problems.tsx");
/* harmony import */ var _hooks_use_current_contest__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../hooks/use-current-contest */ "./src/hooks/use-current-contest.tsx");
/* harmony import */ var _submissions_submission_result_points_label_SubmissionResultPointsLabel__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../submissions/submission-result-points-label/SubmissionResultPointsLabel */ "./src/components/submissions/submission-result-points-label/SubmissionResultPointsLabel.tsx");
/* harmony import */ var _ContestTasksNavigation_module_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ContestTasksNavigation.module.scss */ "./src/components/contests/contest-tasks-navigation/ContestTasksNavigation.module.scss");
/* harmony import */ var _ContestTasksNavigation_module_scss__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_ContestTasksNavigation_module_scss__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);



var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\contests\\contest-tasks-navigation\\ContestTasksNavigation.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature();














var compareByOrderBy = function compareByOrderBy(p1, p2) {
  return p1.orderBy - p2.orderBy;
};

var ContestTasksNavigation = function ContestTasksNavigation() {
  _s();

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(''),
      _useState2 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
      resultsLink = _useState2[0],
      setResultsLink = _useState2[1];

  var _useProblems = Object(_hooks_use_problems__WEBPACK_IMPORTED_MODULE_7__["useProblems"])(),
      _useProblems$state = _useProblems.state,
      currentProblem = _useProblems$state.currentProblem,
      problems = _useProblems$state.problems,
      selectProblemById = _useProblems.actions.selectProblemById;

  var _useCurrentContest = Object(_hooks_use_current_contest__WEBPACK_IMPORTED_MODULE_8__["useCurrentContest"])(),
      _useCurrentContest$st = _useCurrentContest.state,
      contest = _useCurrentContest$st.contest,
      isOfficial = _useCurrentContest$st.isOfficial;

  var renderTask = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function (problem) {
    var _ref = currentProblem || {},
        currentId = _ref.id;

    var id = problem.id;
    var selectedClassName = currentId === id ? _ContestTasksNavigation_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.selected : '';
    var className = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_5__["default"])(_ContestTasksNavigation_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.taskSideNavigationItem, selectedClassName);
    var participationType = isOfficial ? _common_constants__WEBPACK_IMPORTED_MODULE_6__["ContestParticipationType"].Compete : _common_constants__WEBPACK_IMPORTED_MODULE_6__["ContestParticipationType"].Practice;
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["Fragment"], {
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["LinkButton"] // onClick={() => selectProblemById(problem.id)} 
      , {
        state: _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["ButtonState"].enabled,
        className: className,
        type: _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["LinkButtonType"].plain,
        to: "/contests/".concat(contest === null || contest === void 0 ? void 0 : contest.id, "/").concat(participationType, "/#").concat(problem.name)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 58,
        columnNumber: 21
      }, _this), problem.name, /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_submissions_submission_result_points_label_SubmissionResultPointsLabel__WEBPACK_IMPORTED_MODULE_9__["default"], {
        points: problem.points,
        maximumPoints: problem.maximumPoints,
        isProcessed: false
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 72,
        columnNumber: 21
      }, _this)]
    }, void 0, true);
  }, [currentProblem, selectProblemById]);
  var sideBarTasksList = 'all-tasks-list';
  var sideBarTasksListClassName = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_5__["default"])(_ContestTasksNavigation_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.tasksListSideNavigation, sideBarTasksList);
  var renderTasksList = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function () {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_lists_List__WEBPACK_IMPORTED_MODULE_3__["default"], {
      values: problems.sort(compareByOrderBy),
      itemFunc: renderTask,
      className: sideBarTasksListClassName,
      itemClassName: _ContestTasksNavigation_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.taskListItem,
      type: _guidelines_lists_List__WEBPACK_IMPORTED_MODULE_3__["ListType"].numbered
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 86,
      columnNumber: 13
    }, _this);
  }, [problems, renderTask, sideBarTasksListClassName]);
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(function () {
    var participationType = isOfficial ? _common_constants__WEBPACK_IMPORTED_MODULE_6__["ContestParticipationType"].Compete : _common_constants__WEBPACK_IMPORTED_MODULE_6__["ContestParticipationType"].Practice;
    var newResultsLink = "/contests/".concat(contest === null || contest === void 0 ? void 0 : contest.id, "/").concat(participationType, "/results/").concat(_common_constants__WEBPACK_IMPORTED_MODULE_6__["ContestResultType"].Simple);
    setResultsLink(newResultsLink);
  }, [isOfficial, contest]);
  var resultsButtonClass = 'resultsButton';
  var refreshButtonClassName = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_5__["default"])(_ContestTasksNavigation_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.resultsButton, resultsButtonClass);
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
    className: _ContestTasksNavigation_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.tasksSideNavigation,
    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_2__["default"], {
      type: _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_2__["HeadingType"].secondary,
      children: "Tasks"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 111,
      columnNumber: 13
    }, _this), renderTasksList(), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["LinkButton"], {
      type: _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["LinkButtonType"].secondary,
      to: resultsLink,
      text: "Results",
      className: refreshButtonClassName
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 113,
      columnNumber: 13
    }, _this)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 110,
    columnNumber: 9
  }, _this);
};

_s(ContestTasksNavigation, "BZEXQs/fBaY3ORChpRVVskfFtis=", false, function () {
  return [_hooks_use_problems__WEBPACK_IMPORTED_MODULE_7__["useProblems"], _hooks_use_current_contest__WEBPACK_IMPORTED_MODULE_8__["useCurrentContest"]];
});

_c = ContestTasksNavigation;
/* harmony default export */ __webpack_exports__["default"] = (ContestTasksNavigation);

var _c;

__webpack_require__.$Refresh$.register(_c, "ContestTasksNavigation");

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
//# sourceMappingURL=main.1294e57019dcfed07f1a.hot-update.js.map