/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {Factory, Unknown} = require("api-utils/xpcom");
const {PageMod} = require("page-mod");
const {Class} = require("sdk/core/heritage");
const {data} = require("self");
const {Cc, Ci, Cu, ChromeWorker} = require("chrome");

Cu.import("resource://gre/modules/Services.jsm");

const tabs = require("tabs");

const quotes = [
  {quote: "Mistakes are always forgivable, if one has the courage to admit them.", author: "Bruce Lee"},
  {quote: "Showing off is the fool's idea of glory.", author: "Bruce Lee"},
  {quote: "Always be yourself, express yourself, have faith in yourself, do not go out and look for a successful personality and duplicate it.", author: "Bruce Lee"},
  {quote: "I don't measure a man's success by how high he climbs but how high he bounces when he hits bottom.", author: "George S. Patton"},
  {quote: "Courage is fear holding on a minute longer.", author: "George S. Patton"},
  {quote: "A good solution applied with vigor now is better than a perfect solution applied ten minutes later.", author: "George S. Patton"},
  {quote: "Insanity: doing the same thing over and over again and expecting different results.", author: "Albert Einstein"},
  {quote: "A person who never made a mistake never tried anything new.", author: "Albert Einstein"},
  {quote: "Great spirits have always encountered violent opposition from mediocre minds.", author: "Albert Einstein"},
]

function randomQuote() {
  let randIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randIndex];
}

exports.main = function(options, callbacks) {
  // about page declaration
  Factory({
    contract: "@mozilla.org/network/protocol/about;1?what=quotes",

    Component: Class({
      extends: Unknown,
      interfaces: ["nsIAboutModule"],

      newChannel: function(uri) {
        let chan = Services.io.newChannel(data.url("index.html"), null, null);
        chan.originalURI = uri;
        return chan;
      },

      getURIFlags: function(uri) {
        return Ci.nsIAboutModule.URI_SAFE_FOR_UNTRUSTED_CONTENT;
      }
    })
  });

  PageMod({
    // load scripts
    contentScriptFile: [
      data.url("js/angular.min.js"),
      data.url("js/app.js"),
    ],

    include: ["about:quotes"],

    onAttach: function(worker) {
      // inject styles
      worker.port.emit("style", data.url("css/bootstrap.min.css"));
      worker.port.emit("style", data.url("css/bootstrap-theme.min.css"));
      worker.port.emit("style", data.url("css/styles.css"));

      worker.port.on("fetch_quote", function() {
        worker.port.emit("quote", randomQuote());
      });
    },
  });

  if (options.loadReason != "startup") {
    tabs.open("about:quotes");
  }
}
