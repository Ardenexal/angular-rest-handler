(function () {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('angularRestHandler.config', [])
      .value('angularRestHandler.config', {
          debug: true
      });

  // Modules
  angular.module('angularRestHandler.services', []);
  angular.module('angularRestHandler',
      [
          'angularRestHandler.config',
          'angularRestHandler.services'
      ]);

})();

/**
 * Created by alexmurray on 21/01/15.
 */
angular.module('angularRestHandler.services').factory('RestHandler', function ($http, $q) {

    // Service logic
    // ...
    var parseUri = function (url, data) {
        var newUrl = url;
        angular.forEach(data, function (value, key) {
            var search = ':' + key;
            newUrl = newUrl.replace(search, value);
        });
        return newUrl;
    };
    return function () {
        var baseUrl = null;
        this.setBaseUrl = function (url) {
            baseUrl = url;
            if (url.slice(-1) === '/') {
                baseUrl = baseUrl.splice(0, -1);
            }


        };
        /**
         * Returns a promise containing an index on the query
         * @param params parameters of the request
         * @returns {*}
         * @param cache
         */
        this.index = function (params,cache,data) {
            if(typeof cache === 'undefined'){
                cache = {cache:true};
            }

            if(typeof data === 'undefined'){
                data = {};
            }
            var url = parseUri(baseUrl, params);
            data = angular.extend(data,cache);
            var q = $q.defer();
            $http.get(url, data)
                .success(function (response) {
                    q.resolve(response);
                })
                .error(function (err) {
                    q.reject(err);
                });
            return q.promise;
        };
        /**
         * returns a promise containing information to create a new item
         * @param pUrl string url of endpoint
         * @returns {*}
         */
        this.create = function (params) {
            var url = parseUri(baseUrl, params);
            url += url + '/create';

            var q = $q.defer();
            $http.get(url, {cache: true})
                .success(function (response) {
                    q.resolve(response);
                })
                .error(function (err) {
                    q.reject(err);
                });
            return q.promise;
        };
        /**
         * Saves data to store endpoint
         * @param params
         * @param data object of data to be passed
         * @returns {*}
         */
        this.store = function (params, data) {
            var url = parseUri(baseUrl, params);

            var q = $q.defer();
            $http.post(url, data, {cache: true})
                .success(function (response) {
                    q.resolve(response);
                })
                .error(function (err) {
                    q.reject(err);
                });
            return q.promise;
        };
        /**
         * Returns information needed to edit a endpoint
         * @returns {*}
         * @param params
         * @param id Extra Parameter for specifing which item is being edited
         */
        this.edit = function (params, id) {
            var url = parseUri(baseUrl, params) + '/' + id + '/edit';


            var q = $q.defer();
            $http.get(url, {cache: true})
                .success(function (response) {
                    q.resolve(response);
                })
                .error(function (err) {
                    q.reject(err);
                });
            return q.promise;
        };
        /**
         * updates endpoint data
         * @param data object of data to be passed
         * @returns {*}
         * @param params
         * @param id
         */
        this.update = function (params, id, data) {
            var url = parseUri(baseUrl, params) + '/' + id;


            var q = $q.defer();
            $http.put(url, data)
                .success(function (response) {
                    q.resolve(response);
                })
                .error(function (err) {
                    q.reject(err);
                });
            return q.promise;
        };
        /**
         * Get information about an endpoint
         * @param params
         * @param id item to get information about
         * @returns {*}
         */
        this.show = function (params, id) {
            var url = parseUri(baseUrl, params) + '/' + id;

            var q = $q.defer();
            $http.get(url, {cache: true})
                .success(function (response) {
                    q.resolve(response);
                })
                .error(function (err) {
                    q.reject(err);
                });
            return q.promise;
        };
        /**
         * delete an item
         * @param id item to destroy
         * @param pUrl absolute url to endpoint
         * @returns {*}
         */
        this.destroy = function (params, id) {
            var url = parseUri(baseUrl, params) + '/' + id;

            var q = $q.defer();
            $http.delete(url)
                .success(function (response) {
                    q.resolve(response);
                })
                .error(function (err) {
                    q.reject(err);
                });
            return q.promise;
        };
    };
});