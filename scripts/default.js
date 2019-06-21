'use strict';

const IS_DEBUG = process.env.NODE_ENV != "production";

var violet = require("violet").script();
const defaultDbUtil = require("../util/default-db-util");

