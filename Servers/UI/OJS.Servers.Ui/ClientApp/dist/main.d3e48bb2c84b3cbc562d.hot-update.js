webpackHotUpdate("main",{

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

_s(CurrentContestsProvider, "XEpDJx7Xfx7QMk1dp7jBNcphLw0=", false, function () {
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

/***/ })

})
//# sourceMappingURL=main.d3e48bb2c84b3cbc562d.hot-update.js.map