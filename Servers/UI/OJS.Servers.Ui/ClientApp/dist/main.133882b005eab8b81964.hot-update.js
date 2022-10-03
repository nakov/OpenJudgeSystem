webpackHotUpdate("main",{

/***/ "./src/components/home-contests/contest-card/ContestCard.tsx":
/*!*******************************************************************!*\
  !*** ./src/components/home-contests/contest-card/ContestCard.tsx ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _guidelines_countdown_Countdown__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../guidelines/countdown/Countdown */ "./src/components/guidelines/countdown/Countdown.tsx");
/* harmony import */ var _utils_dates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/dates */ "./src/utils/dates.ts");
/* harmony import */ var _utils_class_names__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/class-names */ "./src/utils/class-names.ts");
/* harmony import */ var _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../guidelines/buttons/Button */ "./src/components/guidelines/buttons/Button.tsx");
/* harmony import */ var _guidelines_icons_LockIcon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../guidelines/icons/LockIcon */ "./src/components/guidelines/icons/LockIcon.tsx");
/* harmony import */ var _ContestCard_module_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ContestCard.module.scss */ "./src/components/home-contests/contest-card/ContestCard.module.scss");
/* harmony import */ var _ContestCard_module_scss__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_ContestCard_module_scss__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);

var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\home-contests\\contest-card\\ContestCard.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature();











var ContestCard = function ContestCard(_ref) {
  _s();

  var contest = _ref.contest;
  var id = contest.id,
      name = contest.name,
      category = contest.category,
      canBePracticed = contest.canBePracticed,
      practiceEndTime = contest.practiceEndTime,
      canBeCompeted = contest.canBeCompeted,
      endTime = contest.endTime;
  var contestCard = 'card-contests';
  var contestCardClassName = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_3__["default"])(_ContestCard_module_scss__WEBPACK_IMPORTED_MODULE_6___default.a.contestCard, contestCard);
  var contestCardHeader = 'card-header';
  var contestCardHeaderClassName = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_3__["default"])(_ContestCard_module_scss__WEBPACK_IMPORTED_MODULE_6___default.a.contestCardHeader, contestCardHeader);
  var contestCardCategory = 'card-category';
  var contestCardCategoryClassName = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_3__["default"])(_ContestCard_module_scss__WEBPACK_IMPORTED_MODULE_6___default.a.contestCardCategoryLabel, contestCardCategory);
  var contestCardCounter = 'card-counter';
  var contestCardCounterClassName = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_3__["default"])(_ContestCard_module_scss__WEBPACK_IMPORTED_MODULE_6___default.a.contestCardCountdown, contestCardCounter);
  var contestCardControlBtns = 'card-control-buttons';
  var contestCardControlBtnsClassName = Object(_utils_class_names__WEBPACK_IMPORTED_MODULE_3__["default"])(_ContestCard_module_scss__WEBPACK_IMPORTED_MODULE_6___default.a.contestCardControls, contestCardControlBtns);
  var renderCountdown = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function () {
    if (canBePracticed && practiceEndTime == null) {
      return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])("p", {
        children: "No practice end time."
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 40,
        columnNumber: 24
      }, _this);
    }

    var endDate = canBeCompeted && !canBePracticed ? endTime : practiceEndTime;
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])(_guidelines_countdown_Countdown__WEBPACK_IMPORTED_MODULE_1__["default"], {
      duration: Object(_utils_dates__WEBPACK_IMPORTED_MODULE_2__["convertToSecondsRemaining"])(new Date(endDate)),
      metric: _guidelines_countdown_Countdown__WEBPACK_IMPORTED_MODULE_1__["Metric"].seconds
    }, id, false, {
      fileName: _jsxFileName,
      lineNumber: 48,
      columnNumber: 17
    }, _this);
  }, [canBeCompeted, canBePracticed, endTime, id, practiceEndTime]);
  var renderContestLockIcon = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function () {
    var hasContestPassword = contest.hasContestPassword,
        hasPracticePassword = contest.hasPracticePassword;
    return canBeCompeted && hasContestPassword || canBePracticed && hasPracticePassword ? /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])(_guidelines_icons_LockIcon__WEBPACK_IMPORTED_MODULE_5__["default"], {}, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 63,
      columnNumber: 19
    }, _this) : null;
  }, [canBeCompeted, canBePracticed, contest]);
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])("div", {
    className: contestCardClassName,
    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])("div", {
      className: contestCardHeaderClassName,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])("div", {
        className: _ContestCard_module_scss__WEBPACK_IMPORTED_MODULE_6___default.a.tooltip,
        children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])("span", {
          className: _ContestCard_module_scss__WEBPACK_IMPORTED_MODULE_6___default.a.tooltipText,
          children: name
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 73,
          columnNumber: 21
        }, _this)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 72,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])("span", {
        className: _ContestCard_module_scss__WEBPACK_IMPORTED_MODULE_6___default.a.contestCardTitle,
        children: name
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 75,
        columnNumber: 17
      }, _this), renderContestLockIcon()]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 71,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])("div", {
      className: contestCardCategoryClassName,
      children: category
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 78,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])("div", {
      className: contestCardCounterClassName,
      children: renderCountdown()
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 79,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])("div", {
      className: contestCardControlBtnsClassName,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])(_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["LinkButton"], {
        id: "button-card-compete",
        to: "/contests/".concat(id, "/register/compete"),
        text: "Compete",
        state: canBeCompeted ? _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["ButtonState"].enabled : _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["ButtonState"].disabled,
        size: _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["ButtonSize"].small
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 83,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])(_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["LinkButton"], {
        id: "button-card-practice",
        to: "/contests/".concat(id, "/register/practice/").concat(name.slice(0, 2)),
        text: "Practice",
        type: _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["LinkButtonType"].secondary,
        state: canBePracticed ? _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["ButtonState"].enabled : _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["ButtonState"].disabled,
        size: _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["ButtonSize"].small
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 94,
        columnNumber: 17
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 82,
      columnNumber: 13
    }, _this)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 70,
    columnNumber: 9
  }, _this);
};

_s(ContestCard, "zRsT3zlK+DIRmoseD51AFRJ+4wk=");

_c = ContestCard;
/* harmony default export */ __webpack_exports__["default"] = (ContestCard);

var _c;

__webpack_require__.$Refresh$.register(_c, "ContestCard");

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
//# sourceMappingURL=main.133882b005eab8b81964.hot-update.js.map