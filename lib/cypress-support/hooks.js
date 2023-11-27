/* eslint-disable no-param-reassign */
const fetchPolyfill =
  '!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e||self).unfetch=n()}(this,function(){return function(e,n){return n=n||{},new Promise(function(t,o){var r=new XMLHttpRequest,s=[],u={},i=function e(){return{ok:2==(r.status/100|0),statusText:r.statusText,status:r.status,url:r.responseURL,text:function(){return Promise.resolve(r.responseText)},json:function(){return Promise.resolve(r.responseText).then(JSON.parse)},blob:function(){return Promise.resolve(new Blob([r.response]))},clone:e,headers:{keys:function(){return s},entries:function(){return s.map(function(e){return[e,r.getResponseHeader(e)]})},get:function(e){return r.getResponseHeader(e)},has:function(e){return null!=r.getResponseHeader(e)}}}};for(var f in r.open(n.method||"get",e,!0),r.onload=function(){r.getAllResponseHeaders().toLowerCase().replace(/^(.+?):/gm,function(e,n){u[n]||s.push(u[n]=n)}),t(i())},r.onerror=o,r.withCredentials="include"==n.credentials,n.headers)r.setRequestHeader(f,n.headers[f]);r.send(n.body||null)})}})';

Cypress.wp = {};

before(() => {
  const installedWordpressVersions = Cypress.config('wordpressVersions');

  if (installedWordpressVersions.length === 1) {
    cy.resetWP(installedWordpressVersions[0]);
  }
});

Cypress.on('uncaught:exception', () => false);

Cypress.on('window:before:load', (win) => {
  delete win.fetch;
  win.eval(fetchPolyfill);
  win.fetch = win.unfetch;
});
