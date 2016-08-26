(function(window, angular, deepstream, undefined) {

  'use strict';

  var host = location.host.substr(0, location.host.indexOf(':'));
  var port = 6020;

  /**
   * @name dsServices
   * @module
   * @description
   *
   * The `dsServices` module provides services for interacting with
   * deepstream.io's javascript client platform and angular.
   *
   */

  var module = angular.module("deepServices", []);

  module.service('DS', function(){

    var ds = this;

    this._url     = host+':'+port;
    this.source   = deepstream(this._url).login();

    this.bindFields = function($scope, record, names){
      angular.forEach(names, function(name){
        Object.defineProperty($scope, name, {
          get: function() {

            return record.get(name);
          },
          set: function(newValue) {
            if(newValue === undefined)
              return;

            record.set(name, newValue);
          }
        });
      });

      record.subscribe(function() {
        if(!$scope.$$phase)
          $scope.$apply();
      });
    };

    this.link = function($scope, name, scopeValue){
      var list = ds.source.record.getList(name);

      if(typeof scopeValue === 'undefined')
        scopeValue = name;

      $scope[scopeValue] = [];

      list.subscribe(function(entries){
    		function scopeApply(){
          if(!$scope.$$phase)
            $scope.$apply();
    		}

        $scope[scopeValue] = entries.map(function(entry){
    			var record = ds.source.record.getRecord(entry);
    			record.subscribe(scopeApply);
    			return record;
    		});

    		scopeApply();
    	});

      list.whenReady(function(){
        console.log(list.getEntries());
      });

      return list;
    };

    this.getRecord = function(name) {
      return ds.source.record.getRecord(name);
    };
  });


})(window, window.angular, window.deepstream);
