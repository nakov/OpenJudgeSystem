webpackHotUpdate("main",{

/***/ "./src/components/common/RedirectExternal.ts":
/*!***************************************************!*\
  !*** ./src/components/common/RedirectExternal.ts ***!
  \***************************************************/
/*! exports provided: RedirectExternal, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RedirectExternal", function() { return RedirectExternal; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);

var _s = __webpack_require__.$Refresh$.signature();


var RedirectExternal = function RedirectExternal(path) {
  _s();

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    window.location.href = path;
  });
  return null;
};

_s(RedirectExternal, "OD7bBpZva5O2jO+Puf00hKivP7c=");

_c = RedirectExternal;
/* harmony default export */ __webpack_exports__["default"] = ({
  RedirectExternal: RedirectExternal
});

var _c;

__webpack_require__.$Refresh$.register(_c, "RedirectExternal");

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

/***/ "./src/layout/header/PageHeader.tsx":
/*!******************************************!*\
  !*** ./src/layout/header/PageHeader.tsx ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _softuni_logo_horizontal_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./softuni-logo-horizontal.svg */ "./src/layout/header/softuni-logo-horizontal.svg");
/* harmony import */ var _nav_PageNav__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../nav/PageNav */ "./src/layout/nav/PageNav.tsx");
/* harmony import */ var _components_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/guidelines/headings/Heading */ "./src/components/guidelines/headings/Heading.tsx");
/* harmony import */ var _hooks_use_auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/use-auth */ "./src/hooks/use-auth.tsx");
/* harmony import */ var _hooks_use_urls__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/use-urls */ "./src/hooks/use-urls.tsx");
/* harmony import */ var _components_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/guidelines/buttons/Button */ "./src/components/guidelines/buttons/Button.tsx");
/* harmony import */ var _PageHeader_module_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./PageHeader.module.scss */ "./src/layout/header/PageHeader.module.scss");
/* harmony import */ var _PageHeader_module_scss__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_PageHeader_module_scss__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);

var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\layout\\header\\PageHeader.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature();












var PageHeader = function PageHeader() {
  _s();

  var _useAuth = Object(_hooks_use_auth__WEBPACK_IMPORTED_MODULE_4__["useAuth"])(),
      user = _useAuth.state.user;

  var _useUrls = Object(_hooks_use_urls__WEBPACK_IMPORTED_MODULE_5__["useUrls"])(),
      getAdministrationNavigation = _useUrls.getAdministrationNavigation;

  var renderLinks = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function () {
    var administrationLink = user.permissions.canAccessAdministration ? /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(_components_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_6__["LinkButton"], {
      type: _components_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_6__["LinkButtonType"].plain,
      size: _components_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_6__["ButtonSize"].none,
      to: getAdministrationNavigation(),
      isToExternal: true,
      text: "Administration"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 18,
      columnNumber: 17
    }, _this) : null;
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["Fragment"], {
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(_components_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_6__["LinkButton"], {
        id: "nav-contests-link",
        type: _components_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_6__["LinkButtonType"].plain,
        size: _components_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_6__["ButtonSize"].none,
        to: "/contests",
        text: "Contests"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 30,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(_components_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_6__["LinkButton"], {
        id: "nav-submissions-link",
        type: _components_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_6__["LinkButtonType"].plain,
        size: _components_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_6__["ButtonSize"].none,
        to: "/submissions",
        text: "Submissions"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 37,
        columnNumber: 17
      }, _this), administrationLink]
    }, void 0, true);
  }, [getAdministrationNavigation, user.permissions.canAccessAdministration]);
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])("header", {
    id: "pageHeader",
    className: _PageHeader_module_scss__WEBPACK_IMPORTED_MODULE_7___default.a.header,
    children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])("div", {
      className: _PageHeader_module_scss__WEBPACK_IMPORTED_MODULE_7___default.a.headerSize,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])("div", {
        className: _PageHeader_module_scss__WEBPACK_IMPORTED_MODULE_7___default.a.headerLinks,
        children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(_components_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_3__["default"], {
          id: "page-header-h2",
          type: _components_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_3__["HeadingType"].secondary,
          className: _PageHeader_module_scss__WEBPACK_IMPORTED_MODULE_7___default.a.heading,
          children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])("a", {
            href: "/",
            children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])("img", {
              src: _softuni_logo_horizontal_svg__WEBPACK_IMPORTED_MODULE_1__["default"],
              alt: "softuni logo"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 59,
              columnNumber: 29
            }, _this)
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 58,
            columnNumber: 25
          }, _this)
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 53,
          columnNumber: 21
        }, _this), renderLinks()]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 52,
        columnNumber: 17
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(_nav_PageNav__WEBPACK_IMPORTED_MODULE_2__["default"], {}, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 64,
        columnNumber: 17
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 51,
      columnNumber: 13
    }, _this)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 50,
    columnNumber: 9
  }, _this);
};

_s(PageHeader, "UgUHyaf7HEXlWEad27qeS2KAEbo=", false, function () {
  return [_hooks_use_auth__WEBPACK_IMPORTED_MODULE_4__["useAuth"], _hooks_use_urls__WEBPACK_IMPORTED_MODULE_5__["useUrls"]];
});

_c = PageHeader;
/* harmony default export */ __webpack_exports__["default"] = (PageHeader);

var _c;

__webpack_require__.$Refresh$.register(_c, "PageHeader");

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
//# sourceMappingURL=main.930c8c8df77643c8b236.hot-update.js.map