webpackHotUpdate("main",{

/***/ "./src/pages/contest/ContestRegisterPage.tsx":
/*!***************************************************!*\
  !*** ./src/pages/contest/ContestRegisterPage.tsx ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator/index.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/index.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _shared_make_private__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../shared/make-private */ "./src/pages/shared/make-private.tsx");
/* harmony import */ var _shared_set_layout__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../shared/set-layout */ "./src/pages/shared/set-layout.tsx");
/* harmony import */ var _hooks_use_current_contest__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/use-current-contest */ "./src/hooks/use-current-contest.tsx");
/* harmony import */ var _components_contests_contest_password_form_ContestPasswordForm__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../components/contests/contest-password-form/ContestPasswordForm */ "./src/components/contests/contest-password-form/ContestPasswordForm.tsx");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../common/constants */ "./src/common/constants.ts");
/* harmony import */ var _ContestRegisterPage_module_scss__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ContestRegisterPage.module.scss */ "./src/pages/contest/ContestRegisterPage.module.scss");
/* harmony import */ var _ContestRegisterPage_module_scss__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_ContestRegisterPage_module_scss__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);



var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\pages\\contest\\ContestRegisterPage.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature();















var ContestRegisterPage = function ContestRegisterPage() {
  _s();

  var _useParams = Object(react_router__WEBPACK_IMPORTED_MODULE_3__["useParams"])(),
      contestId = _useParams.contestId,
      participationType = _useParams.participationType;

  var navigate = Object(react_router_dom__WEBPACK_IMPORTED_MODULE_4__["useNavigate"])();
  var contestIdToNumber = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(function () {
    return Number(contestId);
  }, [contestId]);
  var isParticipationOfficial = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(function () {
    return participationType === _common_constants__WEBPACK_IMPORTED_MODULE_10__["ContestParticipationType"].Compete;
  }, [participationType]);
  var internalContest = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(function () {
    return {
      id: contestIdToNumber,
      isOfficial: isParticipationOfficial
    };
  }, [contestIdToNumber, isParticipationOfficial]);

  var _useCurrentContest = Object(_hooks_use_current_contest__WEBPACK_IMPORTED_MODULE_8__["useCurrentContest"])(),
      _useCurrentContest$st = _useCurrentContest.state,
      requirePassword = _useCurrentContest$st.requirePassword,
      isPasswordValid = _useCurrentContest$st.isPasswordValid,
      register = _useCurrentContest.actions.register;

  var doesNotRequirePassword = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(function () {
    return !Object(lodash__WEBPACK_IMPORTED_MODULE_5__["isNil"])(requirePassword) && !requirePassword;
  }, [requirePassword]);
  var isSubmittedPasswordValid = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(function () {
    return !Object(lodash__WEBPACK_IMPORTED_MODULE_5__["isNil"])(isPasswordValid) && isPasswordValid;
  }, [isPasswordValid]);
  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee() {
      return C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return register(internalContest);

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }, [internalContest, contestIdToNumber, isParticipationOfficial, participationType, register]);
  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    if (doesNotRequirePassword || isSubmittedPasswordValid) {
      navigate("/contests/".concat(contestId, "/").concat(participationType));
    }
  }, [contestId, doesNotRequirePassword, isSubmittedPasswordValid, participationType, navigate]);
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__["jsxDEV"])("div", {
    className: _ContestRegisterPage_module_scss__WEBPACK_IMPORTED_MODULE_11___default.a.container,
    children: requirePassword ? /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__["jsxDEV"])(_components_contests_contest_password_form_ContestPasswordForm__WEBPACK_IMPORTED_MODULE_9__["default"], {
      id: contestIdToNumber,
      isOfficial: isParticipationOfficial
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 60,
      columnNumber: 25
    }, _this) : /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_12__["jsxDEV"])("p", {
      children: "No password required. Redirecting to contest."
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 65,
      columnNumber: 23
    }, _this)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 56,
    columnNumber: 9
  }, _this);
};

_s(ContestRegisterPage, "OLWWbHlJMzfx2h7NqAN6t4MsTa8=", false, function () {
  return [react_router__WEBPACK_IMPORTED_MODULE_3__["useParams"], react_router_dom__WEBPACK_IMPORTED_MODULE_4__["useNavigate"], _hooks_use_current_contest__WEBPACK_IMPORTED_MODULE_8__["useCurrentContest"]];
});

_c = ContestRegisterPage;
/* harmony default export */ __webpack_exports__["default"] = (_c3 = Object(_shared_make_private__WEBPACK_IMPORTED_MODULE_6__["makePrivate"])(_c2 = Object(_shared_set_layout__WEBPACK_IMPORTED_MODULE_7__["setLayout"])(ContestRegisterPage)));

var _c, _c2, _c3;

__webpack_require__.$Refresh$.register(_c, "ContestRegisterPage");
__webpack_require__.$Refresh$.register(_c2, "%default%$makePrivate");
__webpack_require__.$Refresh$.register(_c3, "%default%");

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
//# sourceMappingURL=main.056f171fd3c1e7e9e39a.hot-update.js.map