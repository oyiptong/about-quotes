"use strict";

let quoteApp = angular.module("quoteApp", []);

quoteApp.filter('escape', function() {
  return window.escape;
});

quoteApp.controller("quoteCtrl", function($scope) {
  $scope.currentQuote = null;

  $scope.fetchQuote =  function fetchQuote() {
    self.port.emit("fetch_quote");
  }

  self.port.on("quote", function(newQuote) {
    $scope.$apply(_ => {
      $scope.currentQuote = newQuote;
    });
  });
});
angular.bootstrap(document, ['quoteApp']);

// Low-level data injection
self.port.on("style", function(file) {
  let link = document.createElement("link");
  link.setAttribute("href", file);
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  document.head.appendChild(link);
});
