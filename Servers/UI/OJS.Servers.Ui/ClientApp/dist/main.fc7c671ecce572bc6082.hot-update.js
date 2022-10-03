webpackHotUpdate("main",{

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
      itemFunc = _ref.itemFunc,
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
  var renderTree1 = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function (node) {
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
        return renderTree1(child);
      }) : null
    }, node.id, false, {
      fileName: _jsxFileName,
      lineNumber: 77,
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

  var renderTree = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(function (node) {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__["jsxDEV"])("div", {
      className: "z",
      children: [itemFunc(node), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__["jsxDEV"])(_material_ui_lab__WEBPACK_IMPORTED_MODULE_2__["TreeItem"], {
        nodeId: node.id.toString(),
        label: node.name,
        onClick: function onClick() {
          return handleTreeItemClick(node);
        },
        onLabelClick: function onLabelClick() {
          return handleLabelClick(node);
        },
        children: Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isArray"])(node.children) ? node.children.map(function (child) {
          return renderTree1(child);
        }) : null
      }, node.id, false, {
        fileName: _jsxFileName,
        lineNumber: 117,
        columnNumber: 13
      }, _this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 115,
      columnNumber: 9
    }, _this);
  }, [handleLabelClick, handleTreeItemClick, itemFunc]);

  var renderTreeView = function renderTreeView(treeItems) {
    return treeItems.map(function (c) {
      return renderTree(c);
    });
  };

  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__["jsxDEV"])(_material_ui_lab__WEBPACK_IMPORTED_MODULE_2__["TreeView"], {
    "aria-label": "rich object",
    defaultCollapseIcon: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__["jsxDEV"])(react_icons_md__WEBPACK_IMPORTED_MODULE_3__["MdExpandMore"], {}, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 137,
      columnNumber: 34
    }, _this),
    defaultExpandIcon: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__["jsxDEV"])(react_icons_md__WEBPACK_IMPORTED_MODULE_3__["MdChevronRight"], {}, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 138,
      columnNumber: 32
    }, _this),
    selected: selected,
    expanded: expanded,
    children: renderTreeView(items)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 135,
    columnNumber: 9
  }, _this);
};

_s(Tree, "wwbM7lJPQHMWaI8LxIqxxQH96g8=");

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
//# sourceMappingURL=main.fc7c671ecce572bc6082.hot-update.js.map