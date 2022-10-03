webpackHotUpdate("main",{

/***/ "./src/layout/content/PageContent.tsx":
/*!********************************************!*\
  !*** ./src/layout/content/PageContent.tsx ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _pages_home_HomePage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pages/home/HomePage */ "./src/pages/home/HomePage.tsx");
/* harmony import */ var _pages_logout_LogoutPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pages/logout/LogoutPage */ "./src/pages/logout/LogoutPage.tsx");
/* harmony import */ var _pages_login_LoginPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../pages/login/LoginPage */ "./src/pages/login/LoginPage.tsx");
/* harmony import */ var _pages_register_RegisterPage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../pages/register/RegisterPage */ "./src/pages/register/RegisterPage.tsx");
/* harmony import */ var _pages_profile_ProfilePage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../pages/profile/ProfilePage */ "./src/pages/profile/ProfilePage.tsx");
/* harmony import */ var _pages_submissions_SubmissionPage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../pages/submissions/SubmissionPage */ "./src/pages/submissions/SubmissionPage.tsx");
/* harmony import */ var _pages_contest_ContestPage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../pages/contest/ContestPage */ "./src/pages/contest/ContestPage.tsx");
/* harmony import */ var _pages_contest_results_ContestResultsPage__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../pages/contest-results/ContestResultsPage */ "./src/pages/contest-results/ContestResultsPage.tsx");
/* harmony import */ var _pages_contests_ContestsPage__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../pages/contests/ContestsPage */ "./src/pages/contests/ContestsPage.tsx");
/* harmony import */ var _pages_submission_details_SubmissionDetailsPage__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../pages/submission-details/SubmissionDetailsPage */ "./src/pages/submission-details/SubmissionDetailsPage.tsx");
/* harmony import */ var _pages_administration_AdministrationPage__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../pages/administration/AdministrationPage */ "./src/pages/administration/AdministrationPage.ts");
/* harmony import */ var _pages_contest_ContestRegisterPage__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../pages/contest/ContestRegisterPage */ "./src/pages/contest/ContestRegisterPage.tsx");
/* harmony import */ var _PageContent_module_scss__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./PageContent.module.scss */ "./src/layout/content/PageContent.module.scss");
/* harmony import */ var _PageContent_module_scss__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_PageContent_module_scss__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);

var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\layout\\content\\PageContent.tsx",
    _this = undefined;

















var routes = [{
  path: '/login',
  Element: _pages_login_LoginPage__WEBPACK_IMPORTED_MODULE_4__["default"]
}, {
  path: '/register',
  Element: _pages_register_RegisterPage__WEBPACK_IMPORTED_MODULE_5__["default"]
}, {
  path: '/logout',
  Element: _pages_logout_LogoutPage__WEBPACK_IMPORTED_MODULE_3__["default"]
}, {
  path: '/',
  Element: _pages_home_HomePage__WEBPACK_IMPORTED_MODULE_2__["default"]
}, {
  path: '/profile',
  Element: _pages_profile_ProfilePage__WEBPACK_IMPORTED_MODULE_6__["default"]
}, {
  path: '/submissions/:submissionId',
  Element: _pages_submissions_SubmissionPage__WEBPACK_IMPORTED_MODULE_7__["default"]
}, {
  path: '/submissions/:submissionId/details',
  Element: _pages_submission_details_SubmissionDetailsPage__WEBPACK_IMPORTED_MODULE_11__["default"]
}, {
  path: '/contests/:contestId/register/:participationType',
  Element: _pages_contest_ContestRegisterPage__WEBPACK_IMPORTED_MODULE_13__["default"]
}, {
  path: '/contests',
  Element: _pages_contests_ContestsPage__WEBPACK_IMPORTED_MODULE_10__["default"]
}, {
  path: '/contests/:contestId/:participationType/',
  Element: _pages_contest_ContestPage__WEBPACK_IMPORTED_MODULE_8__["default"]
}, {
  path: '/contests/:contestId/:participationType#:problemName',
  Element: _pages_contest_ContestPage__WEBPACK_IMPORTED_MODULE_8__["default"]
}, {
  path: '/contests/:contestId/:participationType/results/:resultType',
  Element: _pages_contest_results_ContestResultsPage__WEBPACK_IMPORTED_MODULE_9__["default"]
}, {
  path: '/administration',
  Element: _pages_administration_AdministrationPage__WEBPACK_IMPORTED_MODULE_12__["default"]
}];

var PageContent = function PageContent() {
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])("main", {
    className: _PageContent_module_scss__WEBPACK_IMPORTED_MODULE_14___default.a.main,
    children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(react_router_dom__WEBPACK_IMPORTED_MODULE_0__["Routes"], {
      children: routes.map(function (_ref) {
        var path = _ref.path,
            Element = _ref.Element;
        return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(react_router_dom__WEBPACK_IMPORTED_MODULE_0__["Route"], {
          path: path,
          element: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_15__["jsxDEV"])(Element, {}, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 56
          }, _this)
        }, path, false, {
          fileName: _jsxFileName,
          lineNumber: 76,
          columnNumber: 17
        }, _this);
      })
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 74,
      columnNumber: 9
    }, _this)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 73,
    columnNumber: 5
  }, _this);
};

_c = PageContent;
/* harmony default export */ __webpack_exports__["default"] = (PageContent);

var _c;

__webpack_require__.$Refresh$.register(_c, "PageContent");

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
//# sourceMappingURL=main.6924e8f8e83aa8af666f.hot-update.js.map