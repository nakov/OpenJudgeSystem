webpackHotUpdate("main",{

/***/ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/resolve-url-loader/index.js?!./node_modules/sass-loader/dist/cjs.js?!./src/components/contests/contests-filters/ContestFilters.module.scss":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--5-oneOf-7-1!./node_modules/postcss-loader/src??postcss!./node_modules/resolve-url-loader??ref--5-oneOf-7-3!./node_modules/sass-loader/dist/cjs.js??ref--5-oneOf-7-4!./src/components/contests/contests-filters/ContestFilters.module.scss ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(true);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".ContestFilters_heading__2zpGe {\n  text-align: left;\n  padding-bottom: 10px;\n  border-bottom: 1px solid #bebebe;\n}\n\n.ContestFilters_filterTypeContainer__QuWHH {\n  margin-top: 10px;\n}\n\n.ContestFilters_listFilters__2MlVy {\n  max-height: 130px;\n  overflow: hidden;\n  align-items: flex-start;\n}\n.ContestFilters_listFilters__2MlVy .ContestFilters_listFilterItem__29aBG {\n  margin-top: 5px;\n}\n.ContestFilters_listFilters__2MlVy.ContestFilters_expanded__2nNsm {\n  max-height: none;\n  overflow: visible;\n}\n\n.ContestFilters_btnSelectFilter__1BuMC {\n  width: 95%;\n}\n\n.ContestFilters_container__25CDp {\n  min-width: 300px;\n}\n\n.ContestFilters_strategyHeader__2Y1pI {\n  width: 10px;\n}\n.ContestFilters_strategyHeader__2Y1pI:hover .ContestFilters_tooltip__1L21o {\n  display: block;\n}\n.ContestFilters_strategyHeader__2Y1pI .ContestFilters_strategyElementClassName__1yvqN {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  width: 150px;\n}\n\n.ContestFilters_tooltip__1L21o {\n  position: absolute;\n  left: 14%;\n  margin-top: 12px;\n  display: none;\n}\n.ContestFilters_tooltip__1L21o .ContestFilters_tooltipElement__ehwJP {\n  color: #42abf8;\n  border-radius: 6px;\n  padding: 10px;\n  font-family: Lato, serif;\n  border: 2px solid #42abf8;\n  text-transform: uppercase;\n  font-weight: 700;\n  font-size: 12px;\n}", "",{"version":3,"sources":["webpack://src/components/contests/contests-filters/ContestFilters.module.scss","webpack://src/styles/colors.scss","webpack://src/styles/fonts.scss"],"names":[],"mappings":"AAGA;EACE,gBAAA;EACA,oBAAA;EACA,gCAAA;AAFF;;AAKA;EACE,gBAAA;AAFF;;AAKA;EACE,iBAAA;EACA,gBAAA;EACA,uBAAA;AAFF;AAIE;EACE,eAAA;AAFJ;AAKE;EACE,gBAAA;EACA,iBAAA;AAHJ;;AAOA;EACE,UAAA;AAJF;;AAOA;EACE,gBAAA;AAJF;;AAOA;EACE,WAAA;AAJF;AAOI;EACE,cAAA;AALN;AASE;EACE,mBAAA;EACA,gBAAA;EACA,uBAAA;EACA,YAAA;AAPJ;;AAYA;EACE,kBAAA;EACA,SAAA;EACA,gBAAA;EACA,aAAA;AATF;AAWE;EACE,cCpDuB;EDqDvB,kBAAA;EACA,aAAA;EACA,wBEhEgB;EFiEhB,yBAAA;EACA,yBAAA;EACA,gBAAA;EACA,eAAA;AATJ","sourcesContent":["@import \"src/styles/colors\";\r\n@import \"src/styles/fonts\";\r\n\r\n.heading {\r\n  text-align: left;\r\n  padding-bottom: 10px;\r\n  border-bottom: 1px solid $bottom-border-color;\r\n}\r\n\r\n.filterTypeContainer {\r\n  margin-top: 10px;\r\n}\r\n\r\n.listFilters {\r\n  max-height: 130px;\r\n  overflow: hidden;\r\n  align-items: flex-start;\r\n\r\n  .listFilterItem {\r\n    margin-top: 5px;\r\n  }\r\n\r\n  &.expanded {\r\n    max-height: none;\r\n    overflow: visible;\r\n  }\r\n}\r\n\r\n.btnSelectFilter {\r\n  width: 95%;\r\n}\r\n\r\n.container {\r\n  min-width: 300px;\r\n}\r\n\r\n.strategyHeader {\r\n  width: 10px;\r\n\r\n  &:hover {\r\n    .tooltip {\r\n      display: block;\r\n    }\r\n  }\r\n\r\n  .strategyElementClassName {\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    width: 150px;\r\n  }\r\n}\r\n\r\n\r\n.tooltip {\r\n  position: absolute;\r\n  left: 14%;\r\n  margin-top: 12px;\r\n  display: none;\r\n\r\n  .tooltipElement {\r\n    color: $success-background-color;\r\n    border-radius: 6px;\r\n    padding: 10px;\r\n    font-family: $font-family-lato;\r\n    border: 2px solid $success-background-color;\r\n    text-transform: uppercase;\r\n    font-weight: 700;\r\n    font-size: 12px;\r\n  }\r\n}","$white-color: #fff;\r\n$warning-color: #FEC112;\r\n$grey-color: #565656;\r\n$light-blue-color: #42abf8;\r\n\r\n$primary-blue: #44a9f8;\r\n$background-color-footer: #3e4c5d;\r\n$background-color-light-gray: #fdfdfd;\r\n$wrappers-border-color: #cbcbcb;\r\n$success-background-color: #42abf8;\r\n$success-font-color: #fff;\r\n$color-btn-secondary: $light-blue-color;\r\n$color-btn-disabled: #bebebe;\r\n$background-color-btn-primary: $success-background-color;\r\n$background-color-btn-primary-hover: $primary-blue;\r\n$background-color-btn-secondary: white;\r\n$background-color-btn-secondary-hover: #e3f3fd;\r\n$bottom-border-color: #bebebe;\r\n$text-light-gray-color: #b5b5b5;\r\n$text-dark-gray-color: #3e4c5d;\r\n$box-shadow-color: 0 1px 5px rgb(0 0 0 / 20%), 0 3px 4px rgb(0 0 0 / 12%), 0 2px 4px rgb(0 0 0 / 14%);\r\n$primary-red: #fc4c50;\r\n$primary-green: #23be5e;\r\n$icon-green: green;\r\n$icon-blue: blue;\r\n$icon-red: red;\r\n","﻿$font-family-lato: Lato, serif;\r\n$font-family-lato-regular: Lato-Regular, serif;\r\n$font-family-montserrat: Montserrat, serif;\r\n$font-family-montserrat-medium: Montserrat-Medium, serif;\r\n$font-style-normal: normal;\r\n\r\n%font-family-lato {\r\n  font-family: $font-family-lato;\r\n  @extend %font-style-normal;\r\n}\r\n\r\n%font-family-lato-regular {\r\n  font-family: $font-family-lato-regular;\r\n  @extend %font-style-normal;\r\n}\r\n\r\n%font-family-montserrat {\r\n  font-family: $font-family-montserrat;\r\n  @extend %font-style-normal;\r\n}\r\n\r\n%font-family-montserrat-medium {\r\n  font-family: $font-family-montserrat-medium;\r\n  @extend %font-style-normal;\r\n}\r\n\r\n%font-style-normal {\r\n  font-style: $font-style-normal;\r\n}"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"heading": "ContestFilters_heading__2zpGe",
	"filterTypeContainer": "ContestFilters_filterTypeContainer__QuWHH",
	"listFilters": "ContestFilters_listFilters__2MlVy",
	"listFilterItem": "ContestFilters_listFilterItem__29aBG",
	"expanded": "ContestFilters_expanded__2nNsm",
	"btnSelectFilter": "ContestFilters_btnSelectFilter__1BuMC",
	"container": "ContestFilters_container__25CDp",
	"strategyHeader": "ContestFilters_strategyHeader__2Y1pI",
	"tooltip": "ContestFilters_tooltip__1L21o",
	"strategyElementClassName": "ContestFilters_strategyElementClassName__1yvqN",
	"tooltipElement": "ContestFilters_tooltipElement__ehwJP"
};
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ })

})
//# sourceMappingURL=main.82824a52b2662ad30816.hot-update.js.map