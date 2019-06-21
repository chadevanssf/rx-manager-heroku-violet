'use strict';

const IS_DEBUG = process.env.NODE_ENV != "production";
const MY_PORT = process.env.PORT || 8080;
const MY_SCRIPT = process.env.SCRIPT_NAME || "scripts/default.js";
const MY_PATH = process.env.SCRIPT_PATH || "default";

var violetSrvr = require("violet/lib/violetSrvr")();
violetSrvr.listAppsAt("/");
var srvrInstance = violetSrvr.createAndListen(MY_PORT);

violetSrvr = require("violet/lib/violetClientTx")(violetSrvr, srvrInstance);

violetSrvr.loadScript(MY_SCRIPT, MY_PATH);

if (IS_DEBUG) {
    console.log("Waiting for requests...");
}