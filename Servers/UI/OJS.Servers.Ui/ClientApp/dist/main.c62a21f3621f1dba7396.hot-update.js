webpackHotUpdate("main",{

/***/ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/components/contests/contest-categories/ContestCategories.module.scss":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--5-oneOf-7-1!./node_modules/postcss-loader/src??postcss!./node_modules/resolve-url-loader??ref--5-oneOf-7-3!./node_modules/sass-loader/dist/cjs.js??ref--5-oneOf-7-4!./src/components/contests/contest-categories/ContestCategories.module.scss ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(true);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".ContestCategories_heading__3r0tO {\n  text-align: left;\n  padding-bottom: 10px;\n  border-bottom: 1px solid #bebebe;\n}\n\n.ContestCategories_categoriesTree__1zk2Q {\n  font-size: 1rem;\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-weight: 400;\n  line-height: 1.5;\n}\n\n.ContestCategories_treeElement__32KkK div:nth-child(2) {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  width: 150px;\n}\n\n.ContestCategories_tooltip__1KI5C {\n  position: absolute;\n  left: 16%;\n  display: none;\n}\n\n.ContestCategories_tooltipElement__7BW6X {\n  width: 183px;\n  background-color: #B0B0B0;\n  color: #fff;\n  border-radius: 6px;\n}\n\n.ContestCategories_categoriesTree__1zk2Q:hover .ContestCategories_tooltip__1KI5C {\n  display: block;\n}", "",{"version":3,"sources":["webpack://src/components/contests/contest-categories/ContestCategories.module.scss"],"names":[],"mappings":"AAEA;EACE,gBAAA;EACA,oBAAA;EACA,gCAAA;AADF;;AAIA;EACE,eAAA;EACA,uDAAA;EACA,gBAAA;EACA,gBAAA;AADF;;AAIA;EACE,mBAAA;EACA,gBAAA;EACA,uBAAA;EACA,YAAA;AADF;;AAIA;EACE,kBAAA;EACA,SAAA;EACA,aAAA;AADF;;AAIA;EACE,YAAA;EACA,yBAAA;EACA,WAAA;EACA,kBAAA;AADF;;AAKE;EACE,cAAA;AAFJ","sourcesContent":["@import \"src/styles/colors\";\n\n.heading {\n  text-align: left;\n  padding-bottom: 10px;\n  border-bottom: 1px solid $bottom-border-color;\n}\n\n.categoriesTree {\n  font-size: 1rem;\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-weight: 400;\n  line-height: 1.5;\n}\n\n.treeElement div:nth-child(2) {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  width: 150px;\n}\n\n.tooltip {\n  position: absolute;\n  left: 16%;\n  display: none;\n}\n\n.tooltipElement {\n  width: 183px;\n  background-color: #B0B0B0;\n  color: #fff;\n  border-radius: 6px;\n}\n\n.categoriesTree:hover {\n  .tooltip {\n    display: block;\n  }\n}"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"heading": "ContestCategories_heading__3r0tO",
	"categoriesTree": "ContestCategories_categoriesTree__1zk2Q",
	"treeElement": "ContestCategories_treeElement__32KkK",
	"tooltip": "ContestCategories_tooltip__1KI5C",
	"tooltipElement": "ContestCategories_tooltipElement__7BW6X"
};
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/components/contests/contest-categories/ContestCategories.module.scss":
/*!**********************************************************************************!*\
  !*** ./src/components/contests/contest-categories/ContestCategories.module.scss ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../../../node_modules/css-loader/dist/cjs.js??ref--5-oneOf-7-1!../../../../node_modules/postcss-loader/src??postcss!../../../../node_modules/resolve-url-loader??ref--5-oneOf-7-3!../../../../node_modules/sass-loader/dist/cjs.js??ref--5-oneOf-7-4!./ContestCategories.module.scss */ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/components/contests/contest-categories/ContestCategories.module.scss");

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
      /*! !../../../../node_modules/css-loader/dist/cjs.js??ref--5-oneOf-7-1!../../../../node_modules/postcss-loader/src??postcss!../../../../node_modules/resolve-url-loader??ref--5-oneOf-7-3!../../../../node_modules/sass-loader/dist/cjs.js??ref--5-oneOf-7-4!./ContestCategories.module.scss */ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/components/contests/contest-categories/ContestCategories.module.scss",
      function () {
        content = __webpack_require__(/*! !../../../../node_modules/css-loader/dist/cjs.js??ref--5-oneOf-7-1!../../../../node_modules/postcss-loader/src??postcss!../../../../node_modules/resolve-url-loader??ref--5-oneOf-7-3!../../../../node_modules/sass-loader/dist/cjs.js??ref--5-oneOf-7-4!./ContestCategories.module.scss */ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/components/contests/contest-categories/ContestCategories.module.scss");

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

/***/ "./src/components/contests/contest-categories/ContestCategories.tsx":
/*!**************************************************************************!*\
  !*** ./src/components/contests/contest-categories/ContestCategories.tsx ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _material_ui_lab__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @material-ui/lab */ "./node_modules/@material-ui/lab/esm/index.js");
/* harmony import */ var _hooks_use_contest_categories__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../hooks/use-contest-categories */ "./src/hooks/use-contest-categories.tsx");
/* harmony import */ var _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../guidelines/headings/Heading */ "./src/components/guidelines/headings/Heading.tsx");
/* harmony import */ var _ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ContestCategories.module.scss */ "./src/components/contests/contest-categories/ContestCategories.module.scss");
/* harmony import */ var _ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _hooks_use_contests__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../hooks/use-contests */ "./src/hooks/use-contests.tsx");
/* harmony import */ var _guidelines_trees_Tree__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../guidelines/trees/Tree */ "./src/components/guidelines/trees/Tree.tsx");
/* harmony import */ var _hooks_use_contest_categories_breadcrumb__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../hooks/use-contest-categories-breadcrumb */ "./src/hooks/use-contest-categories-breadcrumb.tsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);


var _excluded = ["children"];

var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\contests\\contest-categories\\ContestCategories.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature();












var ContestCategories = function ContestCategories(_ref) {
  _s();

  var _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className,
      onCategoryClick = _ref.onCategoryClick,
      defaultSelected = _ref.defaultSelected;

  var _useContestCategories = Object(_hooks_use_contest_categories__WEBPACK_IMPORTED_MODULE_4__["useContestCategories"])(),
      categories = _useContestCategories.state.categories;

  var _useContests = Object(_hooks_use_contests__WEBPACK_IMPORTED_MODULE_7__["useContests"])(),
      possibleFilters = _useContests.state.possibleFilters;

  var _useCategoriesBreadcr = Object(_hooks_use_contest_categories_breadcrumb__WEBPACK_IMPORTED_MODULE_9__["useCategoriesBreadcrumbs"])(),
      updateBreadcrumb = _useCategoriesBreadcr.actions.updateBreadcrumb;

  var renderTree = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function (node) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__["jsxDEV"])("div", {
      className: _ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_6___default.a.categoriesTree,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__["jsxDEV"])("div", {
        className: _ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_6___default.a.tooltip,
        children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__["jsxDEV"])("div", {
          className: _ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_6___default.a.tooltipElement,
          children: node.name
        }, node.id, false, {
          fileName: _jsxFileName,
          lineNumber: 31,
          columnNumber: 17
        }, _this)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 30,
        columnNumber: 13
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__["jsxDEV"])(_material_ui_lab__WEBPACK_IMPORTED_MODULE_3__["TreeItem"], {
        className: _ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_6___default.a.treeElement,
        nodeId: node.id.toString(),
        label: node.name,
        onClick: function onClick() {
          return handleTreeItemClick(node);
        },
        onLabelClick: function onLabelClick() {
          return handleLabelClick(node);
        },
        children: Object(lodash__WEBPACK_IMPORTED_MODULE_2__["isArray"])(node.children) ? node.children.map(function (child) {
          return renderTree(child);
        }) : null
      }, node.id, false, {
        fileName: _jsxFileName,
        lineNumber: 36,
        columnNumber: 13
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 29,
      columnNumber: 9
    }, _this);
  }, [handleTreeItemClick, handleLabelClick, renderTree]);
  var flattenTree = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function (treeItems, result) {
    treeItems.forEach(function (_ref2) {
      var children = _ref2.children,
          rest = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref2, _excluded);

      result.push(rest);

      /*#__PURE__*/
      Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__["jsxDEV"])("div", {
        className: _ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_6___default.a.categoriesTree,
        children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__["jsxDEV"])("div", {
          className: _ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_6___default.a.tooltip,
          children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__["jsxDEV"])("div", {
            className: _ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_6___default.a.tooltipElement,
            children: node.name
          }, node.id, false, {
            fileName: _jsxFileName,
            lineNumber: 58,
            columnNumber: 25
          }, _this)
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 57,
          columnNumber: 21
        }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__["jsxDEV"])(_material_ui_lab__WEBPACK_IMPORTED_MODULE_3__["TreeItem"], {
          className: _ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_6___default.a.treeElement,
          nodeId: node.id.toString(),
          label: node.name,
          onClick: function onClick() {
            return handleTreeItemClick(node);
          },
          onLabelClick: function onLabelClick() {
            return handleLabelClick(node);
          }
        }, node.id, false, {
          fileName: _jsxFileName,
          lineNumber: 63,
          columnNumber: 21
        }, _this)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 56,
        columnNumber: 17
      }, _this);

      if (!Object(lodash__WEBPACK_IMPORTED_MODULE_2__["isNil"])(children)) {
        flattenTree(children, result);
      }
    });
    return result;
  }, []);
  var getParents = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function (result, allItems, searchId) {
    var _node$parentId;

    if (Object(lodash__WEBPACK_IMPORTED_MODULE_2__["isNil"])(searchId)) {
      return result;
    }

    var node = allItems.find(function (_ref3) {
      var id = _ref3.id;
      return id.toString() === searchId;
    });

    if (Object(lodash__WEBPACK_IMPORTED_MODULE_2__["isNil"])(node)) {
      return result;
    }

    if (node.id.toString() === searchId) {
      result.push(searchId);
    }

    getParents(result, allItems, (_node$parentId = node.parentId) === null || _node$parentId === void 0 ? void 0 : _node$parentId.toString());
    return result;
  }, []);
  var categoriesFlat = Object(react__WEBPACK_IMPORTED_MODULE_1__["useMemo"])(function () {
    return flattenTree(categories, []);
  }, [categories, flattenTree]);
  var defaultExpanded = Object(react__WEBPACK_IMPORTED_MODULE_1__["useMemo"])(function () {
    return getParents([], categoriesFlat, defaultSelected);
  }, [defaultSelected, categoriesFlat, getParents]);
  var handleTreeLabelClick = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function (node) {
    var filter = possibleFilters.find(function (_ref4) {
      var value = _ref4.value;
      return value.toString() === node.id.toString();
    });
    var category = categoriesFlat.find(function (_ref5) {
      var id = _ref5.id;
      return id.toString() === node.id.toString();
    });

    if (Object(lodash__WEBPACK_IMPORTED_MODULE_2__["isNil"])(filter)) {
      return;
    }

    onCategoryClick(filter);
    updateBreadcrumb(category, categoriesFlat);
  }, [possibleFilters, categoriesFlat, onCategoryClick, updateBreadcrumb]);
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__["jsxDEV"])("div", {
    className: className,
    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__["jsxDEV"])(_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_5__["default"], {
      type: _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_5__["HeadingType"].small,
      className: _ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_6___default.a.heading,
      children: "Category"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 130,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_10__["jsxDEV"])(_guidelines_trees_Tree__WEBPACK_IMPORTED_MODULE_8__["default"], {
      items: categories,
      onTreeLabelClick: handleTreeLabelClick,
      defaultSelected: defaultSelected,
      defaultExpanded: defaultExpanded
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 136,
      columnNumber: 13
    }, _this)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 129,
    columnNumber: 9
  }, _this);
};

_s(ContestCategories, "/neJjODpsmopnkbWOOsa4NC2cvU=", false, function () {
  return [_hooks_use_contest_categories__WEBPACK_IMPORTED_MODULE_4__["useContestCategories"], _hooks_use_contests__WEBPACK_IMPORTED_MODULE_7__["useContests"], _hooks_use_contest_categories_breadcrumb__WEBPACK_IMPORTED_MODULE_9__["useCategoriesBreadcrumbs"]];
});

_c = ContestCategories;
/* harmony default export */ __webpack_exports__["default"] = (ContestCategories);

var _c;

__webpack_require__.$Refresh$.register(_c, "ContestCategories");

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

/***/ "./src/components/guidelines/trees/Tree.tsx":
/*!**************************************************!*\
  !*** ./src/components/guidelines/trees/Tree.tsx ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _material_ui_lab__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/lab */ "./node_modules/@material-ui/lab/esm/index.js");
/* harmony import */ var react_icons_md__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-icons/md */ "./node_modules/react-icons/md/index.esm.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);



var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\guidelines\\trees\\Tree.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature();







var Tree = function Tree(_ref) {
  _s();

  var items = _ref.items,
      onTreeLabelClick = _ref.onTreeLabelClick,
      defaultSelected = _ref.defaultSelected,
      _ref$defaultExpanded = _ref.defaultExpanded,
      defaultExpanded = _ref$defaultExpanded === void 0 ? [] : _ref$defaultExpanded;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])([]),
      _useState2 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
      expanded = _useState2[0],
      setExpanded = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(''),
      _useState4 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState3, 2),
      selected = _useState4[0],
      setSelected = _useState4[1];

  var handleTreeItemClick = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function (node) {
    var id = node.id.toString();
    var newExpanded = Array.from(expanded);

    if (expanded.includes(id)) {
      newExpanded = newExpanded.filter(function (e) {
        return e !== id;
      });
    } else {
      newExpanded.push(id);
    }

    setExpanded(newExpanded);
  }, [expanded, setExpanded]);
  var handleLabelClick = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function (node) {
    setSelected(node.id.toString());
    onTreeLabelClick(node);
  }, [onTreeLabelClick]);
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(function () {
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isEmpty"])(selected) && defaultSelected) {
      setSelected(defaultSelected);
    }
  }, [defaultSelected, selected]);
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(function () {
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isEmpty"])(expanded) && !Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isEmpty"])(defaultExpanded)) {
      setExpanded(defaultExpanded);
    }
  }, [defaultExpanded, expanded]);
  var renderTree = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function (node) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__["jsxDEV"])(_material_ui_lab__WEBPACK_IMPORTED_MODULE_2__["TreeItem"], {
      nodeId: node.id.toString(),
      label: node.name,
      onClick: function onClick() {
        return handleTreeItemClick(node);
      },
      onLabelClick: function onLabelClick() {
        return handleLabelClick(node);
      },
      children: Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isArray"])(node.children) ? node.children.map(function (child) {
        return renderTree(child);
      }) : null
    }, node.id, false, {
      fileName: _jsxFileName,
      lineNumber: 75,
      columnNumber: 9
    }, _this);
  }, [handleLabelClick, handleTreeItemClick]); // const renderTree = useCallback((node: ITreeItemType) => (
  //     <div className={categoriesTreeClassName}>
  //         <div className={treeTooltipClassName}>
  //             <div className={treeTooltipElementClassName}
  //                  key={node.id}>
  //                 {node.name}
  //             </div>
  //         </div>
  //         <TreeItem
  //             key={node.id}
  //             className={treeElementClassName}
  //             nodeId={node.id.toString()}
  //             label={node.name}
  //             onClick={() => handleTreeItemClick(node)}
  //             onLabelClick={() => handleLabelClick(node)}
  //         >
  //             {isArray(node.children)
  //                 ? node.children.map((child) => renderTree(child))
  //                 : null}
  //         </TreeItem>
  //     </div>
  // ), [ categoriesTreeClassName, treeTooltipClassName, treeTooltipElementClassName,
  //     treeElementClassName, handleTreeItemClick, handleLabelClick, renderTree ]);

  var renderTreeView = function renderTreeView(treeItems) {
    return treeItems.map(function (c) {
      return renderTree(c);
    });
  };

  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__["jsxDEV"])(_material_ui_lab__WEBPACK_IMPORTED_MODULE_2__["TreeView"], {
    "aria-label": "rich object",
    defaultCollapseIcon: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__["jsxDEV"])(react_icons_md__WEBPACK_IMPORTED_MODULE_3__["MdExpandMore"], {}, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 117,
      columnNumber: 34
    }, _this),
    defaultExpandIcon: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__["jsxDEV"])(react_icons_md__WEBPACK_IMPORTED_MODULE_3__["MdChevronRight"], {}, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 118,
      columnNumber: 32
    }, _this),
    selected: selected,
    expanded: expanded,
    children: renderTreeView(items)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 115,
    columnNumber: 9
  }, _this);
};

_s(Tree, "Kc55M+GeTkLUE7ydlS215xkLZsI=");

_c = Tree;
/* harmony default export */ __webpack_exports__["default"] = (Tree);

var _c;

__webpack_require__.$Refresh$.register(_c, "Tree");

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
//# sourceMappingURL=main.c62a21f3621f1dba7396.hot-update.js.map