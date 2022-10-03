webpackHotUpdate("main",{

/***/ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/layout/header/PageHeader.module.scss":
/*!******************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--5-oneOf-7-1!./node_modules/postcss-loader/src??postcss!./node_modules/resolve-url-loader??ref--5-oneOf-7-3!./node_modules/sass-loader/dist/cjs.js??ref--5-oneOf-7-4!./src/layout/header/PageHeader.module.scss ***!
  \******************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(true);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".PageHeader_medium__3npYZ {\n  font-size: 16px;\n  line-height: 16px;\n  padding: 13px 24px;\n}\n\n.PageHeader_large__1RQKu {\n  padding: 16px 48px;\n  font-size: 16px;\n  line-height: 16px;\n}\n\n.PageHeader_headerSize__8h2EI {\n  margin: 0 auto;\n  width: 1280px;\n  max-width: 90%;\n  box-sizing: border-box;\n}\n@media only screen and (max-width: 1440px) {\n  .PageHeader_headerSize__8h2EI {\n    width: 1280px;\n  }\n}\n\n.PageHeader_header__rkczt {\n  position: absolute;\n  display: flex;\n  justify-content: center;\n  height: 75px;\n  width: 100%;\n}\n@media only screen and (max-width: 425px) {\n  .PageHeader_header__rkczt {\n    padding: 0 5px;\n  }\n}\n.PageHeader_header__rkczt h1 {\n  color: #fff;\n}\n.PageHeader_header__rkczt img {\n  max-height: 40px;\n}\n\n.PageHeader_headerSize__8h2EI {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.14), 0 3px 4px rgba(0, 0, 0, 0.12), 0 1px 5px rgba(0, 0, 0, 0.2);\n  background-color: #fff;\n  padding: 0 30px;\n  border-radius: 0 0 8px 8px;\n}\n@media only screen and (max-width: 425px) {\n  .PageHeader_headerSize__8h2EI {\n    box-shadow: none;\n    padding: 0;\n  }\n}\n\n@media only screen and (max-width: 425px) {\n  .PageHeader_heading__3SlWt {\n    width: 100px;\n  }\n}\n\n.PageHeader_headerLinks__2YZtH {\n  display: flex;\n  grid-gap: 10px;\n  gap: 10px;\n  align-items: center;\n  justify-content: center;\n}", "",{"version":3,"sources":["webpack://src/styles/components.scss","webpack://src/styles/variables.scss","webpack://src/layout/header/PageHeader.module.scss","webpack://src/styles/colors.scss"],"names":[],"mappings":"AASA;EAEE,eCRU;EDSV,iBAAA;EACA,kBAAA;AETF;;AFYA;EAEE,kBAAA;EACA,eChBU;EDiBV,iBAAA;AEVF;;AFaA;EACE,cAAA;EACA,aAAA;EACA,cAAA;EACA,sBAAA;AEVF;AFiBE;EAXF;IAYI,aAAA;EEdF;AACF;;AAnBA;EACE,kBAAA;EACA,aAAA;EACA,uBAAA;EACA,YAAA;EACA,WAAA;AAsBF;AApBE;EAPF;IAQI,cAAA;EAuBF;AACF;AArBE;EACE,WCfU;ADsCd;AApBE;EACE,gBAAA;AAsBJ;;AAlBA;EAGE,aAAA;EACA,8BAAA;EACA,mBAAA;EACA,sGAAA;EACA,sBC9BY;ED+BZ,eAAA;EACA,0BAAA;AAmBF;AAjBE;EAXF;IAYI,gBAAA;IACA,UAAA;EAoBF;AACF;;AAhBE;EADF;IAEI,YAAA;EAoBF;AACF;;AAjBA;EACE,aAAA;EACA,cAAA;EAAA,SAAA;EACA,mBAAA;EACA,uBAAA;AAoBF","sourcesContent":["@import \"colors\";\n@import \"variables\";\n\n%small {\n  padding: 10px 18px;\n  font-size: $f-size-12;\n  line-height: 12px;\n}\n\n.medium,\n%medium {\n  font-size: $f-size-16;\n  line-height: 16px;\n  padding: 13px 24px;\n}\n\n.large,\n%large {\n  padding: 16px 48px;\n  font-size: $f-size-16;\n  line-height: 16px;\n}\n\n%contentSize {\n  margin: 0 auto;\n  width: 1280px;\n  max-width: 90%;\n  box-sizing: border-box;\n\n  &%wide {\n    width: 100%;\n    max-width: 100%;\n  }\n\n  @media only screen and (max-width: 1440px) {\n    width: 1280px;\n  }\n}\n","﻿// Font-Sizes\r\n$f-size-10: 10px;\r\n$f-size-12: 12px;\r\n$f-size-16: 16px;\r\n$f-size-18: 18px;\r\n$f-size-24: 24px;\r\n$f-size-30: 30px;\r\n$f-size-36: 36px;",".medium {\n  font-size: 16px;\n  line-height: 16px;\n  padding: 13px 24px;\n}\n\n.large {\n  padding: 16px 48px;\n  font-size: 16px;\n  line-height: 16px;\n}\n\n.headerSize {\n  margin: 0 auto;\n  width: 1280px;\n  max-width: 90%;\n  box-sizing: border-box;\n}\n@media only screen and (max-width: 1440px) {\n  .headerSize {\n    width: 1280px;\n  }\n}\n\n.header {\n  position: absolute;\n  display: flex;\n  justify-content: center;\n  height: 75px;\n  width: 100%;\n}\n@media only screen and (max-width: 425px) {\n  .header {\n    padding: 0 5px;\n  }\n}\n.header h1 {\n  color: #fff;\n}\n.header img {\n  max-height: 40px;\n}\n\n.headerSize {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.14), 0 3px 4px rgba(0, 0, 0, 0.12), 0 1px 5px rgba(0, 0, 0, 0.2);\n  background-color: #fff;\n  padding: 0 30px;\n  border-radius: 0 0 8px 8px;\n}\n@media only screen and (max-width: 425px) {\n  .headerSize {\n    box-shadow: none;\n    padding: 0;\n  }\n}\n\n@media only screen and (max-width: 425px) {\n  .heading {\n    width: 100px;\n  }\n}\n\n.headerLinks {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n  justify-content: center;\n}","$white-color: #fff;\r\n$warning-color: #FEC112;\r\n$grey-color: #565656;\r\n$light-blue-color: #42abf8;\r\n\r\n$primary-blue: #44a9f8;\r\n$background-color-footer: #3e4c5d;\r\n$background-color-light-gray: #fdfdfd;\r\n$wrappers-border-color: #cbcbcb;\r\n$success-background-color: #42abf8;\r\n$success-font-color: #fff;\r\n$color-btn-secondary: $light-blue-color;\r\n$color-btn-disabled: #bebebe;\r\n$background-color-btn-primary: $success-background-color;\r\n$background-color-btn-primary-hover: $primary-blue;\r\n$background-color-btn-secondary: white;\r\n$background-color-btn-secondary-hover: #e3f3fd;\r\n$bottom-border-color: #bebebe;\r\n$text-light-gray-color: #b5b5b5;\r\n$text-dark-gray-color: #3e4c5d;\r\n$box-shadow-color: 0 1px 5px rgb(0 0 0 / 20%), 0 3px 4px rgb(0 0 0 / 12%), 0 2px 4px rgb(0 0 0 / 14%);\r\n$primary-red: #fc4c50;\r\n$primary-green: #23be5e;\r\n$icon-green: green;\r\n$icon-blue: blue;\r\n$icon-red: red;\r\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"medium": "PageHeader_medium__3npYZ",
	"large": "PageHeader_large__1RQKu",
	"headerSize": "PageHeader_headerSize__8h2EI",
	"header": "PageHeader_header__rkczt",
	"heading": "PageHeader_heading__3SlWt",
	"headerLinks": "PageHeader_headerLinks__2YZtH"
};
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/layout/nav/PageNav.module.scss":
/*!************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--5-oneOf-7-1!./node_modules/postcss-loader/src??postcss!./node_modules/resolve-url-loader??ref--5-oneOf-7-3!./node_modules/sass-loader/dist/cjs.js??ref--5-oneOf-7-4!./src/layout/nav/PageNav.module.scss ***!
  \************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(true);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".PageNav_listNav__w3DOE {\n  display: flex;\n  grid-gap: 15px;\n  gap: 15px;\n  justify-content: right;\n  align-items: center;\n}\n\n.PageNav_btn__11trP {\n  font-size: 12px;\n  padding: 12px 8px;\n}", "",{"version":3,"sources":["webpack://src/layout/nav/PageNav.module.scss","webpack://src/styles/variables.scss"],"names":[],"mappings":"AAEA;EACE,aAAA;EACA,cAAA;EAAA,SAAA;EACA,sBAAA;EACA,mBAAA;AADF;;AAIA;EACE,eCRU;EDSV,iBAAA;AADF","sourcesContent":["@import \"src/styles/variables\";\n\n.listNav {\n  display: flex;\n  gap: 15px;\n  justify-content: right;\n  align-items: center;\n}\n\n.btn {\n  font-size: $f-size-12;\n  padding: 12px 8px;\n}\n","﻿// Font-Sizes\r\n$f-size-10: 10px;\r\n$f-size-12: 12px;\r\n$f-size-16: 16px;\r\n$f-size-18: 18px;\r\n$f-size-24: 24px;\r\n$f-size-30: 30px;\r\n$f-size-36: 36px;"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"listNav": "PageNav_listNav__w3DOE",
	"btn": "PageNav_btn__11trP"
};
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/layout/header/PageHeader.module.scss":
/*!**************************************************!*\
  !*** ./src/layout/header/PageHeader.module.scss ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js??ref--5-oneOf-7-1!../../../node_modules/postcss-loader/src??postcss!../../../node_modules/resolve-url-loader??ref--5-oneOf-7-3!../../../node_modules/sass-loader/dist/cjs.js??ref--5-oneOf-7-4!./PageHeader.module.scss */ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/layout/header/PageHeader.module.scss");

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
      /*! !../../../node_modules/css-loader/dist/cjs.js??ref--5-oneOf-7-1!../../../node_modules/postcss-loader/src??postcss!../../../node_modules/resolve-url-loader??ref--5-oneOf-7-3!../../../node_modules/sass-loader/dist/cjs.js??ref--5-oneOf-7-4!./PageHeader.module.scss */ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/layout/header/PageHeader.module.scss",
      function () {
        content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js??ref--5-oneOf-7-1!../../../node_modules/postcss-loader/src??postcss!../../../node_modules/resolve-url-loader??ref--5-oneOf-7-3!../../../node_modules/sass-loader/dist/cjs.js??ref--5-oneOf-7-4!./PageHeader.module.scss */ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/layout/header/PageHeader.module.scss");

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
      getAdministrationContestsGridUrl = _useUrls.getAdministrationContestsGridUrl,
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
  }, [getAdministrationContestsGridUrl, user.permissions.canAccessAdministration]);
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

_s(PageHeader, "EHf1JPHoDKTyUrLq8gQwXPmh+Qg=", false, function () {
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

/***/ }),

/***/ "./src/layout/header/softuni-logo-horizontal.svg":
/*!*******************************************************!*\
  !*** ./src/layout/header/softuni-logo-horizontal.svg ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "static/media/softuni-logo-horizontal.c94ee051.svg");

/***/ }),

/***/ "./src/layout/nav/PageNav.module.scss":
/*!********************************************!*\
  !*** ./src/layout/nav/PageNav.module.scss ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js??ref--5-oneOf-7-1!../../../node_modules/postcss-loader/src??postcss!../../../node_modules/resolve-url-loader??ref--5-oneOf-7-3!../../../node_modules/sass-loader/dist/cjs.js??ref--5-oneOf-7-4!./PageNav.module.scss */ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/layout/nav/PageNav.module.scss");

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
      /*! !../../../node_modules/css-loader/dist/cjs.js??ref--5-oneOf-7-1!../../../node_modules/postcss-loader/src??postcss!../../../node_modules/resolve-url-loader??ref--5-oneOf-7-3!../../../node_modules/sass-loader/dist/cjs.js??ref--5-oneOf-7-4!./PageNav.module.scss */ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/layout/nav/PageNav.module.scss",
      function () {
        content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js??ref--5-oneOf-7-1!../../../node_modules/postcss-loader/src??postcss!../../../node_modules/resolve-url-loader??ref--5-oneOf-7-3!../../../node_modules/sass-loader/dist/cjs.js??ref--5-oneOf-7-4!./PageNav.module.scss */ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/layout/nav/PageNav.module.scss");

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

/***/ "./src/layout/nav/PageNav.tsx":
/*!************************************!*\
  !*** ./src/layout/nav/PageNav.tsx ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _hooks_use_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/use-auth */ "./src/hooks/use-auth.tsx");
/* harmony import */ var _components_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/guidelines/buttons/Button */ "./src/components/guidelines/buttons/Button.tsx");
/* harmony import */ var _components_guidelines_lists_List__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/guidelines/lists/List */ "./src/components/guidelines/lists/List.tsx");
/* harmony import */ var _PageNav_module_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./PageNav.module.scss */ "./src/layout/nav/PageNav.module.scss");
/* harmony import */ var _PageNav_module_scss__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_PageNav_module_scss__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);



var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\layout\\nav\\PageNav.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature();








var userRoutes = [{
  id: 'nav-my-profile-link',
  name: 'My Profile',
  link: '/profile',
  isPrimary: true
}, {
  id: 'nav-logout-link',
  name: 'Log out',
  link: '/logout',
  isPrimary: false
}];
var anonymousRoutes = [{
  name: 'Login',
  link: '/login',
  isPrimary: false,
  id: 'anonymous-login-link'
}, {
  name: 'Register',
  link: '/register',
  isPrimary: true,
  id: 'anonymous-register-link'
}];

var PageNav = function PageNav() {
  _s();

  var _useAuth = Object(_hooks_use_auth__WEBPACK_IMPORTED_MODULE_2__["useAuth"])(),
      user = _useAuth.state.user;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(anonymousRoutes),
      _useState2 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
      routes = _useState2[0],
      setRoutes = _useState2[1];

  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(function () {
    setRoutes(user.isLoggedIn ? userRoutes : anonymousRoutes);
  }, [user.isLoggedIn]);

  var itemFunc = function itemFunc(_ref) {
    var name = _ref.name,
        link = _ref.link,
        isPrimary = _ref.isPrimary,
        id = _ref.id;
    var type = isPrimary ? _components_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_3__["LinkButtonType"].primary : _components_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_3__["LinkButtonType"].secondary;
    var btnClassName = _PageNav_module_scss__WEBPACK_IMPORTED_MODULE_5___default.a.btn;
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__["jsxDEV"])(_components_guidelines_buttons_Button__WEBPACK_IMPORTED_MODULE_3__["LinkButton"], {
      to: link,
      id: id,
      text: name,
      type: type,
      className: btnClassName
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 44,
      columnNumber: 13
    }, _this);
  };

  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__["jsxDEV"])("nav", {
    children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__["jsxDEV"])(_components_guidelines_lists_List__WEBPACK_IMPORTED_MODULE_4__["default"], {
      values: routes,
      itemFunc: itemFunc,
      orientation: _components_guidelines_lists_List__WEBPACK_IMPORTED_MODULE_4__["Orientation"].horizontal,
      className: _PageNav_module_scss__WEBPACK_IMPORTED_MODULE_5___default.a.listNav
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 50,
      columnNumber: 13
    }, _this)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 49,
    columnNumber: 9
  }, _this);
};

_s(PageNav, "xiy9oZFopErD8iwEkz9qXjQDcc0=", false, function () {
  return [_hooks_use_auth__WEBPACK_IMPORTED_MODULE_2__["useAuth"]];
});

_c = PageNav;
/* harmony default export */ __webpack_exports__["default"] = (PageNav);

var _c;

__webpack_require__.$Refresh$.register(_c, "PageNav");

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
//# sourceMappingURL=main.c1c932c3720de9d86db9.hot-update.js.map