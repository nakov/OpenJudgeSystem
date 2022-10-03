webpackHotUpdate("main",{

/***/ "./src/components/contests/contest/Contest.tsx":
/*!*****************************************************!*\
  !*** ./src/components/contests/contest/Contest.tsx ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../guidelines/headings/Heading */ "./src/components/guidelines/headings/Heading.tsx");
/* harmony import */ var _guidelines_text_Text__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../guidelines/text/Text */ "./src/components/guidelines/text/Text.tsx");
/* harmony import */ var _guidelines_countdown_Countdown__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../guidelines/countdown/Countdown */ "./src/components/guidelines/countdown/Countdown.tsx");
/* harmony import */ var _contest_tasks_navigation_ContestTasksNavigation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../contest-tasks-navigation/ContestTasksNavigation */ "./src/components/contests/contest-tasks-navigation/ContestTasksNavigation.tsx");
/* harmony import */ var _submission_box_SubmissionBox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../submission-box/SubmissionBox */ "./src/components/contests/submission-box/SubmissionBox.tsx");
/* harmony import */ var _contest_problem_details_ContestProblemDetails__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../contest-problem-details/ContestProblemDetails */ "./src/components/contests/contest-problem-details/ContestProblemDetails.tsx");
/* harmony import */ var _utils_class_names__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../utils/class-names */ "./src/utils/class-names.ts");
/* harmony import */ var _utils_dates__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../utils/dates */ "./src/utils/dates.ts");
/* harmony import */ var _hooks_use_current_contest__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../hooks/use-current-contest */ "./src/hooks/use-current-contest.tsx");
/* harmony import */ var _Contest_module_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Contest.module.scss */ "./src/components/contests/contest/Contest.module.scss");
/* harmony import */ var _Contest_module_scss__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_Contest_module_scss__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);

var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\contests\\contest\\Contest.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature();















var Contest = function Contest() {
  _s();

  var _useCurrentContest = Object(_hooks_use_current_contest__WEBPACK_IMPORTED_MODULE_9__["useCurrentContest"])(),
      _useCurrentContest$st = _useCurrentContest.state,
      contest = _useCurrentContest$st.contest,
      score = _useCurrentContest$st.score,
      maxScore = _useCurrentContest$st.maxScore;

  var navigationContestClass = 'navigationContest';
  var navigationContestClassName = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_7__["default"])(navigationContestClass);
  var submissionBoxClass = 'submissionBox';
  var submissionBoxClassName = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_7__["default"])(submissionBoxClass);
  var problemInfoClass = 'problemInfo';
  var problemInfoClassName = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_7__["default"])(problemInfoClass);
  var scoreText = Object(react__WEBPACK_IMPORTED_MODULE_0__["useMemo"])(function () {
    return "".concat(score, "/").concat(maxScore);
  }, [maxScore, score]);
  var scoreClassName = 'score';
  var renderScore = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function () {
    if (scoreText === '0/0') {
      return null;
    }

    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("p", {
      className: scoreClassName,
      children: ["Score:", ' ', /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_text_Text__WEBPACK_IMPORTED_MODULE_2__["default"], {
        type: _guidelines_text_Text__WEBPACK_IMPORTED_MODULE_2__["TextType"].Bold,
        children: scoreText
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 51,
        columnNumber: 21
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 48,
      columnNumber: 17
    }, _this);
  }, [scoreText]);
  var remainingTimeClassName = 'remainingTime';
  var renderCountdown = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function (remainingTime) {
    var _convertToTwoDigitVal = Object(_utils_dates__WEBPACK_IMPORTED_MODULE_8__["convertToTwoDigitValues"])(remainingTime),
        hours = _convertToTwoDigitVal.hours,
        minutes = _convertToTwoDigitVal.minutes,
        seconds = _convertToTwoDigitVal.seconds;

    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["Fragment"], {
      children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("p", {
        className: remainingTimeClassName,
        children: ["Remaining time:", ' ', /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_text_Text__WEBPACK_IMPORTED_MODULE_2__["default"], {
          type: _guidelines_text_Text__WEBPACK_IMPORTED_MODULE_2__["TextType"].Bold,
          children: [hours, ":", minutes, ":", seconds]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 70,
          columnNumber: 25
        }, _this)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 67,
        columnNumber: 21
      }, _this)
    }, void 0, false);
  }, []);
  var renderTimeRemaining = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function () {
    var _ref = contest || {},
        endTime = _ref.endTime;

    if (!endTime) {
      return null;
    }

    var duration = Object(_utils_dates__WEBPACK_IMPORTED_MODULE_8__["convertToSecondsRemaining"])(new Date(endTime));
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_countdown_Countdown__WEBPACK_IMPORTED_MODULE_3__["default"], {
      renderRemainingTime: renderCountdown,
      duration: duration,
      metric: _guidelines_countdown_Countdown__WEBPACK_IMPORTED_MODULE_3__["Metric"].seconds
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 95,
      columnNumber: 17
    }, _this);
  }, [contest, renderCountdown]);
  var secondaryHeadingClassName = Object(react__WEBPACK_IMPORTED_MODULE_0__["useMemo"])(function () {
    return Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_7__["default"])(_Contest_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.contestHeading, _Contest_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.contestInfoContainer);
  }, []);
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["Fragment"], {
    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
      className: _Contest_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.headingContest,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_1__["default"], {
        type: _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_1__["HeadingType"].primary,
        className: _Contest_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.contestHeading,
        children: contest === null || contest === void 0 ? void 0 : contest.name
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 109,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_1__["default"], {
        type: _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_1__["HeadingType"].secondary,
        className: secondaryHeadingClassName,
        children: [renderTimeRemaining(), renderScore()]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 115,
        columnNumber: 17
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 108,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
      className: _Contest_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.contestWrapper,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
        className: navigationContestClassName,
        children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_contest_tasks_navigation_ContestTasksNavigation__WEBPACK_IMPORTED_MODULE_4__["default"], {}, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 123,
          columnNumber: 21
        }, _this)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 122,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
        className: submissionBoxClassName,
        children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_submission_box_SubmissionBox__WEBPACK_IMPORTED_MODULE_5__["default"], {}, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 126,
          columnNumber: 21
        }, _this)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 125,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
        className: problemInfoClassName,
        children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_contest_problem_details_ContestProblemDetails__WEBPACK_IMPORTED_MODULE_6__["default"], {}, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 129,
          columnNumber: 21
        }, _this)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 128,
        columnNumber: 17
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 121,
      columnNumber: 13
    }, _this)]
  }, void 0, true);
};

_s(Contest, "WnaZhZ0fZUPTApuEgfux1B9LcT8=", false, function () {
  return [_hooks_use_current_contest__WEBPACK_IMPORTED_MODULE_9__["useCurrentContest"]];
});

_c = Contest;
/* harmony default export */ __webpack_exports__["default"] = (Contest);

var _c;

__webpack_require__.$Refresh$.register(_c, "Contest");

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
    score: 0,
    maxScore: 0,
    isOfficial: false
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

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(defaultState.state.score),
      _useState4 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState3, 2),
      score = _useState4[0],
      setScore = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(defaultState.state.maxScore),
      _useState6 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState5, 2),
      maxScore = _useState6[0],
      setMaxScore = _useState6[1];

  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(defaultState.state.isOfficial),
      _useState8 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState7, 2),
      isOfficial = _useState8[0],
      setIsOfficial = _useState8[1];

  var _useState9 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(null),
      _useState10 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState9, 2),
      contestToStart = _useState10[0],
      setContestToStart = _useState10[1];

  var _useLoading = Object(_use_loading__WEBPACK_IMPORTED_MODULE_5__["useLoading"])(),
      startLoading = _useLoading.startLoading,
      stopLoading = _useLoading.stopLoading;

  var _useUrls = Object(_use_urls__WEBPACK_IMPORTED_MODULE_7__["useUrls"])(),
      getStartContestParticipationUrl = _useUrls.getStartContestParticipationUrl;

  var _useHttp = Object(_use_http__WEBPACK_IMPORTED_MODULE_6__["useHttp"])(getStartContestParticipationUrl, contestToStart),
      startContest = _useHttp.get,
      startContestData = _useHttp.data;

  var start = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (obj) {
    setContestToStart(obj);
  }, []);
  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(startContestData)) {
      return;
    }

    var responseData = startContestData;
    var newContest = responseData.contest,
        contestIsCompete = responseData.contestIsCompete;
    setContest(newContest);
    setIsOfficial(contestIsCompete);
  }, [startContestData]);
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
    var _ref3 = contest || {},
        problems = _ref3.problems;

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
      score: score,
      maxScore: maxScore,
      isOfficial: isOfficial
    },
    actions: {
      start: start
    }
  };
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(CurrentContestsContext.Provider, {
    value: value,
    children: children
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 121,
    columnNumber: 9
  }, _this);
};

_s(CurrentContestsProvider, "CkGTYzcYqqwcqKRpHr4kKXGBwEo=", false, function () {
  return [_use_loading__WEBPACK_IMPORTED_MODULE_5__["useLoading"], _use_urls__WEBPACK_IMPORTED_MODULE_7__["useUrls"], _use_http__WEBPACK_IMPORTED_MODULE_6__["useHttp"]];
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

/***/ })

})
//# sourceMappingURL=main.152fce8cd4f62a717e94.hot-update.js.map