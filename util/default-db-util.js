'use strict';

const IS_DEBUG = process.env.NODE_ENV != "production";

const DB_ROOM_TABLE = "hospital_room__c";

const dbUtil = require("./db-util");

const defaultDbUtil = {};

defaultDbUtil.updateRoomQuery = function() {
    return squel.update()
      .table(dbUtil.getSchema() + "." + DB_ROOM_TABLE)
      .set("alexa_is_ready__c", true)
      .where("room__c = $1")
      .where("floor__c = $2")
      .toString();
  };
  
  defaultDbUtil.getRoomQuery = function() {
    return defaultDbUtil.getBaseRoomQuery()
      .where("room__c = $1")
      .where("floor__c = $2")
      .toString();
  };
  
  defaultDbUtil.getRoomToCleanQuery = function() {
    return dbUtil.getBaseRoomQuery()
      .where("status__c = ?", "Needing Cleaning")
      .where("floor__c = $1")
      .order("floor__c")
      .order("room__c")
      .limit(5)
      .toString();
  };
  
  defaultDbUtil.getBaseRoomQuery = function() {
    return squel.select()
      .from(dbUtil.getSchema() + "." + DB_ROOM_TABLE)
      .field("room__c")
      .field("floor__c")
      .field("status__c")
      .field("alexa_is_ready__c")
      .field("name")
      .field("sfid");
  };
  
  defaultDbUtil.getRooms = function(newRm, newFl) {
    return new Promise(function(resolve, reject) {
      const queryToRun = {
        text: defaultDbUtil.getRoomQuery(),
        values: [newRm, newFl]
      };
  
      dbUtil.getPool().query(queryToRun)
        .then( res => {
          resolve(res.rows);
        })
        .catch( e => console.error(e.stack) );
    });
  };
  
  defaultDbUtil.updateCleanRoom = function(newRm, newFl) {
    return new Promise(function(resolve, reject) {
      const queryToRun = {
        text: defaultDbUtil.updateRoomQuery(),
        values: [newRm, newFl]
      };
  
      dbUtil.getPool().query(queryToRun)
        .then( res => {
          resolve(res.rows);
        })
        .catch( e => console.error(e.stack) );
    });
  };
  
  defaultDbUtil.getRoomsToClean = function(currFl) {
    return new Promise(function(resolve, reject) {
      const queryToRun = {
        text: defaultDbUtil.getRoomToCleanQuery(),
        values: [currFl]
      };
  
      dbUtil.getPool().query(queryToRun)
        .then( res => {
          resolve(res.rows);
        })
        .catch( e => console.error(e.stack) );
    });
  };
  
  defaultDbUtil.getRoomListResponse = function(rows) {
    var response = "";
    var currentFloor;
    rows.forEach((row) => {
      var fl = row.floor__c;
      var rm = row.room__c;
      if (currentFloor != fl) {
        if (!currentFloor) {
          response += "on floor " + fl + " room " + rm;
        } else {
          response += ", on floor " + fl + " room " + rm;
        }
        currentFloor = fl;
      } else {
        response += ", " + rm;
      }
    });
  
    if (IS_DEBUG) {
      console.log("getListResponse: " + response);
    }
  
    return response;
  };
  
  module.exports = defaultDbUtil;