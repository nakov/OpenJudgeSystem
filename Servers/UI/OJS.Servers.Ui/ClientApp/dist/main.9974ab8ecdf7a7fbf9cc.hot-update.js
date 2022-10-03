webpackHotUpdate("main",{

/***/ "./src/hooks/submissions/use-submissions.tsx":
/*!***************************************************!*\
  !*** ./src/hooks/submissions/use-submissions.tsx ***!
  \***************************************************/
/*! exports provided: useSubmissions, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useSubmissions", function() { return useSubmissions; });
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator/index.js */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _use_loading__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../use-loading */ "./src/hooks/use-loading.tsx");
/* harmony import */ var _use_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../use-http */ "./src/hooks/use-http.tsx");
/* harmony import */ var _use_current_contest__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../use-current-contest */ "./src/hooks/use-current-contest.tsx");
/* harmony import */ var _use_problems__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../use-problems */ "./src/hooks/use-problems.tsx");
/* harmony import */ var _use_problem_submissions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./use-problem-submissions */ "./src/hooks/submissions/use-problem-submissions.tsx");
/* harmony import */ var _use_urls__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../use-urls */ "./src/hooks/use-urls.tsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);




var _jsxFileName = "C:\\Users\\User\\Desktop\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp\\src\\hooks\\submissions\\use-submissions.tsx",
    _this = undefined,
    _s = __webpack_require__.$Refresh$.signature(),
    _s2 = __webpack_require__.$Refresh$.signature();











var defaultState = {
  state: {
    submissionCode: "\nfunction hello() {\n    alert('Hello world!');\n}\n",
    selectedSubmissionType: null
  }
};
var SubmissionsContext = /*#__PURE__*/Object(react__WEBPACK_IMPORTED_MODULE_3__["createContext"])(defaultState);

var SubmissionsProvider = function SubmissionsProvider(_ref) {
  _s();

  var children = _ref.children;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(defaultState.state.selectedSubmissionType),
      _useState2 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState, 2),
      selectedSubmissionType = _useState2[0],
      setSelectedSubmissionType = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_3__["useState"])(defaultState.state.submissionCode),
      _useState4 = Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState3, 2),
      submissionCode = _useState4[0],
      setSubmissionCode = _useState4[1];

  var _useUrls = Object(_use_urls__WEBPACK_IMPORTED_MODULE_10__["useUrls"])(),
      getSubmitUrl = _useUrls.getSubmitUrl;

  var _useLoading = Object(_use_loading__WEBPACK_IMPORTED_MODULE_5__["useLoading"])(),
      startLoading = _useLoading.startLoading,
      stopLoading = _useLoading.stopLoading;

  var _useProblems = Object(_use_problems__WEBPACK_IMPORTED_MODULE_8__["useProblems"])(),
      currentProblem = _useProblems.state.currentProblem;

  var _useProblemSubmission = Object(_use_problem_submissions__WEBPACK_IMPORTED_MODULE_9__["useProblemSubmissions"])(),
      loadSubmissions = _useProblemSubmission.actions.loadSubmissions;

  var _useCurrentContest = Object(_use_current_contest__WEBPACK_IMPORTED_MODULE_7__["useCurrentContest"])(),
      isOfficial = _useCurrentContest.state.isOfficial;

  var _useHttp = Object(_use_http__WEBPACK_IMPORTED_MODULE_6__["useHttp"])(getSubmitUrl),
      submitCode = _useHttp.post,
      submitCodeResult = _useHttp.data;

  var submit = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])( /*#__PURE__*/Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee() {
    var _ref3, id, _ref4, problemId;

    return C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            startLoading();
            _ref3 = selectedSubmissionType || {}, id = _ref3.id;
            _ref4 = currentProblem || {}, problemId = _ref4.id;
            _context.next = 5;
            return submitCode({
              ProblemId: problemId,
              SubmissionTypeId: id,
              Content: submissionCode,
              Official: isOfficial
            });

          case 5:
            stopLoading();

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })), [startLoading, selectedSubmissionType, currentProblem, submitCode, submissionCode, isOfficial, stopLoading]);
  var selectSubmissionTypeById = Object(react__WEBPACK_IMPORTED_MODULE_3__["useCallback"])(function (id) {
    var _ref5 = currentProblem || {},
        allowedSubmissionTypes = _ref5.allowedSubmissionTypes;

    if (allowedSubmissionTypes == null) {
      return;
    }

    var newSubmissionType = allowedSubmissionTypes.find(function (st) {
      return st.id === id;
    });

    if (!newSubmissionType) {
      return;
    }

    setSelectedSubmissionType(newSubmissionType);
  }, [currentProblem]);

  var updateSubmissionCode = function updateSubmissionCode(code) {
    setSubmissionCode(code);
  };

  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    var _ref6 = currentProblem || {},
        allowedSubmissionTypes = _ref6.allowedSubmissionTypes;

    var submissionType = Object(lodash__WEBPACK_IMPORTED_MODULE_4__["first"])(allowedSubmissionTypes);

    if (submissionType) {
      var _id = submissionType.id;
      selectSubmissionTypeById(_id);
    } else {
      selectSubmissionTypeById(null);
    }
  }, [currentProblem, selectSubmissionTypeById]);
  Object(react__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    Object(C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee2() {
      return C_Users_User_Desktop_OpenJudgeSystem_Servers_UI_OJS_Servers_Ui_ClientApp_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator_index_js__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return loadSubmissions();

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  }, [loadSubmissions, submitCodeResult]);
  var value = {
    state: {
      submissionCode: submissionCode,
      selectedSubmissionType: selectedSubmissionType
    },
    actions: {
      updateSubmissionCode: updateSubmissionCode,
      selectSubmissionTypeById: selectSubmissionTypeById,
      submit: submit
    }
  };
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__["jsxDEV"])(SubmissionsContext.Provider, {
    value: value,
    children: children
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 137,
    columnNumber: 9
  }, _this);
};

_s(SubmissionsProvider, "Y/3IxNCcGwB9rDyOgYVk0dm9CIA=", false, function () {
  return [_use_urls__WEBPACK_IMPORTED_MODULE_10__["useUrls"], _use_loading__WEBPACK_IMPORTED_MODULE_5__["useLoading"], _use_problems__WEBPACK_IMPORTED_MODULE_8__["useProblems"], _use_problem_submissions__WEBPACK_IMPORTED_MODULE_9__["useProblemSubmissions"], _use_current_contest__WEBPACK_IMPORTED_MODULE_7__["useCurrentContest"], _use_http__WEBPACK_IMPORTED_MODULE_6__["useHttp"]];
});

_c = SubmissionsProvider;

var useSubmissions = function useSubmissions() {
  _s2();

  return Object(react__WEBPACK_IMPORTED_MODULE_3__["useContext"])(SubmissionsContext);
};

_s2(useSubmissions, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");


/* harmony default export */ __webpack_exports__["default"] = (SubmissionsProvider);

var _c;

__webpack_require__.$Refresh$.register(_c, "SubmissionsProvider");

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
//# sourceMappingURL=main.9974ab8ecdf7a7fbf9cc.hot-update.js.map