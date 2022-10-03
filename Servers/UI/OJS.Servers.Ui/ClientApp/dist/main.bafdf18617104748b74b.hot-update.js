webpackHotUpdate("main",{

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
/* harmony import */ var _hooks_use_contest_categories__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../hooks/use-contest-categories */ "./src/hooks/use-contest-categories.tsx");
/* harmony import */ var _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../guidelines/headings/Heading */ "./src/components/guidelines/headings/Heading.tsx");
/* harmony import */ var _hooks_use_contests__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../hooks/use-contests */ "./src/hooks/use-contests.tsx");
/* harmony import */ var _hooks_use_contest_categories_breadcrumb__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../hooks/use-contest-categories-breadcrumb */ "./src/hooks/use-contest-categories-breadcrumb.tsx");
/* harmony import */ var _contest_tree_CategoriesTree__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../contest-tree/CategoriesTree */ "./src/components/contests/contest-tree/CategoriesTree.tsx");
/* harmony import */ var _ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ContestCategories.module.scss */ "./src/components/contests/contest-categories/ContestCategories.module.scss");
/* harmony import */ var _ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__);
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

  var _useContestCategories = Object(_hooks_use_contest_categories__WEBPACK_IMPORTED_MODULE_3__["useContestCategories"])(),
      categories = _useContestCategories.state.categories;

  var _useContests = Object(_hooks_use_contests__WEBPACK_IMPORTED_MODULE_5__["useContests"])(),
      possibleFilters = _useContests.state.possibleFilters;

  var _useCategoriesBreadcr = Object(_hooks_use_contest_categories_breadcrumb__WEBPACK_IMPORTED_MODULE_6__["useCategoriesBreadcrumbs"])(),
      updateBreadcrumb = _useCategoriesBreadcr.actions.updateBreadcrumb;

  var flattenTree = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function (treeItems, result) {
    treeItems.forEach(function (_ref2) {
      var children = _ref2.children,
          rest = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref2, _excluded);

      result.push(rest);

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
  var renderCategoryItem = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function (item) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__["jsxDEV"])("div", {
      className: _ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_8___default.a.tooltip,
      children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__["jsxDEV"])("div", {
        className: _ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_8___default.a.tooltipElement,
        children: item.name
      }, item.id, false, {
        fileName: _jsxFileName,
        lineNumber: 93,
        columnNumber: 17
      }, _this)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 92,
      columnNumber: 13
    }, _this);
  }, []);
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__["jsxDEV"])("div", {
    className: className,
    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__["jsxDEV"])(_guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_4__["default"], {
      type: _guidelines_headings_Heading__WEBPACK_IMPORTED_MODULE_4__["HeadingType"].small,
      className: _ContestCategories_module_scss__WEBPACK_IMPORTED_MODULE_8___default.a.heading,
      children: "Category"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 100,
      columnNumber: 13
    }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__["jsxDEV"])(_contest_tree_CategoriesTree__WEBPACK_IMPORTED_MODULE_7__["default"], {
      items: categories // itemFunc={renderCategoryItem}
      ,
      onTreeLabelClick: handleTreeLabelClick,
      defaultSelected: defaultSelected,
      defaultExpanded: defaultExpanded
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 106,
      columnNumber: 13
    }, _this)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 99,
    columnNumber: 9
  }, _this);
};

_s(ContestCategories, "xSBPwKVQwqth/VpKaFFLOnQdhSg=", false, function () {
  return [_hooks_use_contest_categories__WEBPACK_IMPORTED_MODULE_3__["useContestCategories"], _hooks_use_contests__WEBPACK_IMPORTED_MODULE_5__["useContests"], _hooks_use_contest_categories_breadcrumb__WEBPACK_IMPORTED_MODULE_6__["useCategoriesBreadcrumbs"]];
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

/***/ "./src/components/contests/contest-tree/CategoriesTree.tsx":
/*!*****************************************************************!*\
  !*** ./src/components/contests/contest-tree/CategoriesTree.tsx ***!
  \*****************************************************************/
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
/* harmony import */ var _CategoriesTree_module_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CategoriesTree.module.scss */ "./src/components/contests/contest-tree/CategoriesTree.module.scss");
/* harmony import */ var _CategoriesTree_module_scss__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_CategoriesTree_module_scss__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);



var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\components\\contests\\contest-tree\\CategoriesTree.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature();








var CategoryTree = function CategoryTree(_ref) {
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
  var renderCategoryTree = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function (node) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__["jsxDEV"])("div", {
      className: _CategoriesTree_module_scss__WEBPACK_IMPORTED_MODULE_5___default.a.categoriesTree,
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__["jsxDEV"])("div", {
        className: _CategoriesTree_module_scss__WEBPACK_IMPORTED_MODULE_5___default.a.tooltip,
        children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__["jsxDEV"])("div", {
          className: _CategoriesTree_module_scss__WEBPACK_IMPORTED_MODULE_5___default.a.tooltipElement,
          children: node.name
        }, node.id, false, {
          fileName: _jsxFileName,
          lineNumber: 77,
          columnNumber: 17
        }, _this)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 76,
        columnNumber: 13
      }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__["jsxDEV"])(_material_ui_lab__WEBPACK_IMPORTED_MODULE_2__["TreeItem"], {
        className: _CategoriesTree_module_scss__WEBPACK_IMPORTED_MODULE_5___default.a.treeElement,
        nodeId: node.id.toString(),
        label: node.name,
        onClick: function onClick() {
          return handleTreeItemClick(node);
        },
        onLabelClick: function onLabelClick() {
          return handleLabelClick(node);
        },
        children: Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isArray"])(node.children) ? node.children.map(function (child) {
          return renderCategoryTree(child);
        }) : null
      }, node.id, false, {
        fileName: _jsxFileName,
        lineNumber: 82,
        columnNumber: 13
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 75,
      columnNumber: 9
    }, _this);
  }, [handleTreeItemClick, handleLabelClick]);

  var renderCategoryTreeView = function renderCategoryTreeView(treeItems) {
    return treeItems.map(function (c) {
      return renderCategoryTree(c);
    });
  };

  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__["jsxDEV"])(_material_ui_lab__WEBPACK_IMPORTED_MODULE_2__["TreeView"], {
    "aria-label": "rich object",
    defaultCollapseIcon: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__["jsxDEV"])(react_icons_md__WEBPACK_IMPORTED_MODULE_3__["MdExpandMore"], {}, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 102,
      columnNumber: 34
    }, _this),
    defaultExpandIcon: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__["jsxDEV"])(react_icons_md__WEBPACK_IMPORTED_MODULE_3__["MdChevronRight"], {}, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 103,
      columnNumber: 32
    }, _this),
    selected: selected,
    expanded: expanded,
    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__["jsxDEV"])("div", {
      className: _CategoriesTree_module_scss__WEBPACK_IMPORTED_MODULE_5___default.a.tooltip,
      children: [" ", renderCategoryTreeView(items)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 107,
      columnNumber: 13
    }, _this), renderCategoryTreeView(items)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 100,
    columnNumber: 9
  }, _this);
};

_s(CategoryTree, "2OPUfBmUqKdGVcC3aWAA3UDzBHQ=");

_c = CategoryTree;
/* harmony default export */ __webpack_exports__["default"] = (CategoryTree);

var _c;

__webpack_require__.$Refresh$.register(_c, "CategoryTree");

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
false

})
//# sourceMappingURL=main.bafdf18617104748b74b.hot-update.js.map