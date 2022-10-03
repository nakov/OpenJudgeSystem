webpackHotUpdate("main",{

/***/ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/components/home-contests/contest-card/ContestCard.module.scss":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--5-oneOf-7-1!./node_modules/postcss-loader/src??postcss!./node_modules/resolve-url-loader??ref--5-oneOf-7-3!./node_modules/sass-loader/dist/cjs.js??ref--5-oneOf-7-4!./src/components/home-contests/contest-card/ContestCard.module.scss ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(true);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".ContestCard_contestCardHeader__2WK4O, .ContestCard_contestCard__aTYur {\n  font-family: Lato, serif;\n}\n\n.ContestCard_contestCardHeader__2WK4O, .ContestCard_contestCard__aTYur {\n  font-style: normal;\n}\n\n.ContestCard_contestCard__aTYur {\n  display: grid;\n  flex-flow: wrap;\n  grid-template-rows: auto 1fr auto;\n  align-content: center;\n  grid-gap: 10px;\n  min-height: 10vh;\n  margin: 10px;\n  padding: 0.7vw;\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 3px 4px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.14);\n  border-radius: 8px;\n}\n\n.ContestCard_contestCardHeader__2WK4O {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  font-weight: 500;\n  font-size: 18px;\n  min-height: 4vh;\n  margin: 10px;\n  border-bottom: 1px solid;\n  border-bottom-color: #bebebe;\n}\n\n.ContestCard_contestCardControls__3wft9 {\n  display: flex;\n  align-items: flex-end;\n  grid-gap: 10px;\n}\n\n.ContestCard_contestCardCountdown__3C04z {\n  padding: 10px;\n  font-size: 12px;\n  font-weight: bold;\n  color: #3e4c5d;\n}\n\n.ContestCard_contestCardCategoryLabel__3z11Z {\n  margin-left: 10px;\n  font-size: 10px;\n  text-transform: uppercase;\n  font-weight: bold;\n  color: #b5b5b5;\n}", "",{"version":3,"sources":["webpack://src/styles/fonts.scss","webpack://src/components/home-contests/contest-card/ContestCard.module.scss","webpack://src/styles/colors.scss","webpack://src/styles/variables.scss"],"names":[],"mappings":"AAMA;EACE,wBAPkB;ACEpB;;ADwBA;EACE,kBAvBkB;ACEpB;;AAFA;EAEE,aAAA;EACA,eAAA;EACA,iCAAA;EACA,qBAAA;EACA,cAAA;EACA,gBAAA;EACA,YAAA;EACA,cAAA;EACA,sGCMiB;EDLjB,kBAAA;AAIF;;AADA;EACE,aAAA;EACA,mBAAA;EACA,8BAAA;EAEA,gBAAA;EACA,eEpBU;EFqBV,eAAA;EACA,YAAA;EACA,wBAAA;EACA,4BCXoB;ADctB;;AAAA;EACE,aAAA;EACA,qBAAA;EACA,cAAA;AAGF;;AAAA;EACE,aAAA;EACA,eErCU;EFsCV,iBAAA;EACA,cCtBqB;ADyBvB;;AAAA;EACE,iBAAA;EACA,eE7CU;EF8CV,yBAAA;EACA,iBAAA;EACA,cC/BsB;ADkCxB","sourcesContent":["﻿$font-family-lato: Lato, serif;\r\n$font-family-lato-regular: Lato-Regular, serif;\r\n$font-family-montserrat: Montserrat, serif;\r\n$font-family-montserrat-medium: Montserrat-Medium, serif;\r\n$font-style-normal: normal;\r\n\r\n%font-family-lato {\r\n  font-family: $font-family-lato;\r\n  @extend %font-style-normal;\r\n}\r\n\r\n%font-family-lato-regular {\r\n  font-family: $font-family-lato-regular;\r\n  @extend %font-style-normal;\r\n}\r\n\r\n%font-family-montserrat {\r\n  font-family: $font-family-montserrat;\r\n  @extend %font-style-normal;\r\n}\r\n\r\n%font-family-montserrat-medium {\r\n  font-family: $font-family-montserrat-medium;\r\n  @extend %font-style-normal;\r\n}\r\n\r\n%font-style-normal {\r\n  font-style: $font-style-normal;\r\n}",".contestCardHeader, .contestCard {\n  font-family: Lato, serif;\n}\n\n.contestCardHeader, .contestCard {\n  font-style: normal;\n}\n\n.contestCard {\n  display: grid;\n  flex-flow: wrap;\n  grid-template-rows: auto 1fr auto;\n  align-content: center;\n  grid-gap: 10px;\n  min-height: 10vh;\n  margin: 10px;\n  padding: 0.7vw;\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 3px 4px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.14);\n  border-radius: 8px;\n}\n\n.contestCardHeader {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  font-weight: 500;\n  font-size: 18px;\n  min-height: 4vh;\n  margin: 10px;\n  border-bottom: 1px solid;\n  border-bottom-color: #bebebe;\n}\n\n.contestCardControls {\n  display: flex;\n  align-items: flex-end;\n  grid-gap: 10px;\n}\n\n.contestCardCountdown {\n  padding: 10px;\n  font-size: 12px;\n  font-weight: bold;\n  color: #3e4c5d;\n}\n\n.contestCardCategoryLabel {\n  margin-left: 10px;\n  font-size: 10px;\n  text-transform: uppercase;\n  font-weight: bold;\n  color: #b5b5b5;\n}","$white-color: #fff;\r\n$warning-color: #FEC112;\r\n$grey-color: #565656;\r\n$light-blue-color: #42abf8;\r\n\r\n$primary-blue: #44a9f8;\r\n$background-color-footer: #3e4c5d;\r\n$background-color-light-gray: #fdfdfd;\r\n$wrappers-border-color: #cbcbcb;\r\n$success-background-color: #42abf8;\r\n$success-font-color: #fff;\r\n$color-btn-secondary: $light-blue-color;\r\n$color-btn-disabled: #bebebe;\r\n$background-color-btn-primary: $success-background-color;\r\n$background-color-btn-primary-hover: $primary-blue;\r\n$background-color-btn-secondary: white;\r\n$background-color-btn-secondary-hover: #e3f3fd;\r\n$bottom-border-color: #bebebe;\r\n$text-light-gray-color: #b5b5b5;\r\n$text-dark-gray-color: #3e4c5d;\r\n$box-shadow-color: 0 1px 5px rgb(0 0 0 / 20%), 0 3px 4px rgb(0 0 0 / 12%), 0 2px 4px rgb(0 0 0 / 14%);\r\n$primary-red: #fc4c50;\r\n$primary-green: #23be5e;\r\n$icon-green: green;\r\n$icon-blue: blue;\r\n$icon-red: red;\r\n","﻿// Font-Sizes\r\n$f-size-10: 10px;\r\n$f-size-12: 12px;\r\n$f-size-16: 16px;\r\n$f-size-18: 18px;\r\n$f-size-24: 24px;\r\n$f-size-30: 30px;\r\n$f-size-36: 36px;"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"contestCardHeader": "ContestCard_contestCardHeader__2WK4O",
	"contestCard": "ContestCard_contestCard__aTYur",
	"contestCardControls": "ContestCard_contestCardControls__3wft9",
	"contestCardCountdown": "ContestCard_contestCardCountdown__3C04z",
	"contestCardCategoryLabel": "ContestCard_contestCardCategoryLabel__3z11Z"
};
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


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
/* harmony import */ var react_icons_all__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-icons/all */ "./node_modules/react-icons/all.js");
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
    Component: react_icons_all__WEBPACK_IMPORTED_MODULE_1__["AiOutlineLock"]
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

/***/ "./src/components/home-contests/contest-card/ContestCard.module.scss":
/*!***************************************************************************!*\
  !*** ./src/components/home-contests/contest-card/ContestCard.module.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../../../node_modules/css-loader/dist/cjs.js??ref--5-oneOf-7-1!../../../../node_modules/postcss-loader/src??postcss!../../../../node_modules/resolve-url-loader??ref--5-oneOf-7-3!../../../../node_modules/sass-loader/dist/cjs.js??ref--5-oneOf-7-4!./ContestCard.module.scss */ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/components/home-contests/contest-card/ContestCard.module.scss");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);


if (true) {
  if (!content.locals || module.hot.invalidate) {
    var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
  if (!a && b || a && !b) {
    return false;
  }

  var p;

  for (p in a) {
    if (isNamedExport && p === 'default') {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (a[p] !== b[p]) {
      return false;
    }
  }

  for (p in b) {
    if (isNamedExport && p === 'default') {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (!a[p]) {
      return false;
    }
  }

  return true;
};
    var oldLocals = content.locals;

    module.hot.accept(
      /*! !../../../../node_modules/css-loader/dist/cjs.js??ref--5-oneOf-7-1!../../../../node_modules/postcss-loader/src??postcss!../../../../node_modules/resolve-url-loader??ref--5-oneOf-7-3!../../../../node_modules/sass-loader/dist/cjs.js??ref--5-oneOf-7-4!./ContestCard.module.scss */ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/components/home-contests/contest-card/ContestCard.module.scss",
      function () {
        content = __webpack_require__(/*! !../../../../node_modules/css-loader/dist/cjs.js??ref--5-oneOf-7-1!../../../../node_modules/postcss-loader/src??postcss!../../../../node_modules/resolve-url-loader??ref--5-oneOf-7-3!../../../../node_modules/sass-loader/dist/cjs.js??ref--5-oneOf-7-4!./ContestCard.module.scss */ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/components/home-contests/contest-card/ContestCard.module.scss");

              content = content.__esModule ? content.default : content;

              if (typeof content === 'string') {
                content = [[module.i, content, '']];
              }

              if (!isEqualLocals(oldLocals, content.locals)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = content.locals;

              update(content);
      }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}

module.exports = content.locals || {};

/***/ }),

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

  var checkLength = function checkLength(name) {
    if (name.length >= 20) {
      return name;
    }
  };

  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])("div", {
    className: contestCardClassName,
    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])("div", {
      className: contestCardHeaderClassName,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])("span", {
        children: name
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 78,
        columnNumber: 17
      }, _this), renderContestLockIcon()]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 77,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])("div", {
      className: contestCardCategoryClassName,
      children: category
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 81,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])("div", {
      className: contestCardCounterClassName,
      children: renderCountdown()
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 82,
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
        lineNumber: 86,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__["jsxDEV"])(_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["LinkButton"], {
        id: "button-card-practice",
        to: "/contests/".concat(id, "/register/practice"),
        text: "Practice",
        type: _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["LinkButtonType"].secondary,
        state: canBePracticed ? _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["ButtonState"].enabled : _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["ButtonState"].disabled,
        size: _guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_4__["ButtonSize"].small
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 97,
        columnNumber: 17
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 85,
      columnNumber: 13
    }, _this)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 76,
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
//# sourceMappingURL=main.806bf3a3f632adb8f794.hot-update.js.map