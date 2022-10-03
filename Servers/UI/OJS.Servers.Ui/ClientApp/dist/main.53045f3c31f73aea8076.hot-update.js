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
      maxScore = _useCurrentContest$st.maxScore,
      remainingTimeInMilliseconds = _useCurrentContest$st.remainingTimeInMilliseconds;

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
        lineNumber: 52,
        columnNumber: 21
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 49,
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
          lineNumber: 71,
          columnNumber: 25
        }, _this)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 68,
        columnNumber: 21
      }, _this)
    }, void 0, false);
  }, []);
  var renderTimeRemaining = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function () {
    if (!remainingTimeInMilliseconds) {
      return null;
    }

    var d = new Date();
    d.addMilliseconds(5);
    var duration = Object(_utils_dates__WEBPACK_IMPORTED_MODULE_8__["convertToSecondsRemaining"])(new Date().getDate() + new Date(remainingTimeInMilliseconds));
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_countdown_Countdown__WEBPACK_IMPORTED_MODULE_3__["default"], {
      renderRemainingTime: renderCountdown,
      duration: new Date().a,
      metric: _guidelines_countdown_Countdown__WEBPACK_IMPORTED_MODULE_3__["Metric"].seconds
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 98,
      columnNumber: 17
    }, _this);
  }, [remainingTimeInMilliseconds, renderCountdown]);
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
        lineNumber: 112,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_1__["default"], {
        type: _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_1__["HeadingType"].secondary,
        className: secondaryHeadingClassName,
        children: [renderTimeRemaining(), renderScore()]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 118,
        columnNumber: 17
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 111,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
      className: _Contest_module_scss__WEBPACK_IMPORTED_MODULE_10___default.a.contestWrapper,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
        className: navigationContestClassName,
        children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_contest_tasks_navigation_ContestTasksNavigation__WEBPACK_IMPORTED_MODULE_4__["default"], {}, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 126,
          columnNumber: 21
        }, _this)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 125,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
        className: submissionBoxClassName,
        children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_submission_box_SubmissionBox__WEBPACK_IMPORTED_MODULE_5__["default"], {}, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 129,
          columnNumber: 21
        }, _this)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 128,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])("div", {
        className: problemInfoClassName,
        children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(_contest_problem_details_ContestProblemDetails__WEBPACK_IMPORTED_MODULE_6__["default"], {}, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 132,
          columnNumber: 21
        }, _this)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 131,
        columnNumber: 17
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 124,
      columnNumber: 13
    }, _this)]
  }, void 0, true);
};

_s(Contest, "ofl+RnBaE2OGNJ8zA1u6wXTgl8Y=", false, function () {
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

/***/ })

})
//# sourceMappingURL=main.53045f3c31f73aea8076.hot-update.js.map