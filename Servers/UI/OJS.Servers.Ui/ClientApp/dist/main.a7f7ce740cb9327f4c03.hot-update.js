webpackHotUpdate("main",{

/***/ "./src/utils/dates.ts":
/*!****************************!*\
  !*** ./src/utils/dates.ts ***!
  \****************************/
/*! exports provided: default, formatDate, secondsToFullTime, calculateTimeUntil, convertToSecondsRemaining, convertToTwoDigitValues, convertToSecondsRemainingMilliseconds */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatDate", function() { return formatDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "secondsToFullTime", function() { return secondsToFullTime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "calculateTimeUntil", function() { return calculateTimeUntil; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convertToSecondsRemaining", function() { return convertToSecondsRemaining; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convertToTwoDigitValues", function() { return convertToTwoDigitValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convertToSecondsRemainingMilliseconds", function() { return convertToSecondsRemainingMilliseconds; });
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! date-fns */ "./node_modules/date-fns/esm/index.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);



var defaultDateTimeFormat = 'HH:MM, DD/MMM/yyyy';

var calculateTimeUntil = function calculateTimeUntil(date) {
  return Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["intervalToDuration"])({
    start: new Date(),
    end: date
  });
};

var formatDate = function formatDate(date) {
  var formatString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDateTimeFormat;
  return moment__WEBPACK_IMPORTED_MODULE_1___default()().diff(date, 'days') > 3 ? moment__WEBPACK_IMPORTED_MODULE_1___default()(date).format(formatString) : moment__WEBPACK_IMPORTED_MODULE_1___default()(date).fromNow();
};

var convertToSecondsRemaining = function convertToSecondsRemaining(date) {
  var _intervalToDuration = Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["intervalToDuration"])({
    start: new Date(),
    end: date
  }),
      days = _intervalToDuration.days,
      hours = _intervalToDuration.hours,
      minutes = _intervalToDuration.minutes,
      seconds = _intervalToDuration.seconds;

  var daysRemaining = days !== null && days !== void 0 ? days : 0;
  var hoursRemaining = daysRemaining * 24 + (hours !== null && hours !== void 0 ? hours : 0);
  var minutesRemaining = hoursRemaining * 60 + (minutes !== null && minutes !== void 0 ? minutes : 0);
  return minutesRemaining * 60 + (seconds !== null && seconds !== void 0 ? seconds : 0);
};

var convertToSecondsRemainingMilliseconds = function convertToSecondsRemainingMilliseconds(date) {
  var _intervalToDuration2 = Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["intervalToDuration"])({
    start: new Date(),
    end: new Date(date)
  }),
      days = _intervalToDuration2.days,
      hours = _intervalToDuration2.hours,
      minutes = _intervalToDuration2.minutes,
      seconds = _intervalToDuration2.seconds;

  var daysRemaining = days !== null && days !== void 0 ? days : 0;
  var hoursRemaining = daysRemaining * 24 + (hours !== null && hours !== void 0 ? hours : 0);
  var minutesRemaining = hoursRemaining * 60 + (minutes !== null && minutes !== void 0 ? minutes : 0);
  return minutesRemaining * 60 + (seconds !== null && seconds !== void 0 ? seconds : 0);
};

var secondsToFullTime = function secondsToFullTime(duration) {
  var _intervalToDuration3 = Object(date_fns__WEBPACK_IMPORTED_MODULE_0__["intervalToDuration"])({
    start: 0,
    end: duration * 1000
  }),
      daysInitial = _intervalToDuration3.days,
      hoursInitial = _intervalToDuration3.hours,
      minutesInitial = _intervalToDuration3.minutes,
      secondsInitial = _intervalToDuration3.seconds;

  var days = daysInitial !== null && daysInitial !== void 0 ? daysInitial : 0;
  var hours = hoursInitial !== null && hoursInitial !== void 0 ? hoursInitial : 0;
  var minutes = minutesInitial !== null && minutesInitial !== void 0 ? minutesInitial : 0;
  var seconds = secondsInitial !== null && secondsInitial !== void 0 ? secondsInitial : 0;
  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
};

var convertToTwoDigitValues = function convertToTwoDigitValues(_ref) {
  var hoursValue = _ref.hours,
      minutesValue = _ref.minutes,
      secondsValue = _ref.seconds;
  var hours = hoursValue >= 10 ? hoursValue.toString() : "0".concat(hoursValue);
  var minutes = minutesValue >= 10 ? minutesValue.toString() : "0".concat(minutesValue);
  var seconds = secondsValue >= 10 ? secondsValue.toString() : "0".concat(secondsValue);
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
};

/* harmony default export */ __webpack_exports__["default"] = ({
  formatDate: formatDate,
  secondsToFullTime: secondsToFullTime,
  calculateTimeUntil: calculateTimeUntil,
  convertToSecondsRemaining: convertToSecondsRemaining,
  convertToTwoDigitValues: convertToTwoDigitValues,
  convertToSecondsRemainingMilliseconds: convertToSecondsRemainingMilliseconds
});


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
//# sourceMappingURL=main.a7f7ce740cb9327f4c03.hot-update.js.map