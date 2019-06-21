'use strict';

const IS_DEBUG = process.env.NODE_ENV != "production";

const DB_SCHEMA = "salesforce"; // default schema name for Heroku Connect

const pg = require("pg");
pg.defaults.ssl = true; // doesn't work for many local installations
const squelGeneric = require("squel");
const squel = squelGeneric.useFlavour("postgres");

const dbUtil = {};
var currentPool;

dbUtil.getSchema = function() {
    return DB_SCHEMA;
};

dbUtil.getPool = function() {
  if (!currentPool) {
    currentPool = new pg.Pool({
      connectionString: process.env.DATABASE_URL
    });
  }
  return currentPool;
};

dbUtil.closePool = function() {
  if (currentPool) {
    currentPool.end();
  }
};

module.exports = dbUtil;