var ngHandlers = angular.module('ngHandlers', []);
ngHandlers.factory('httpInterceptor', [
    '$q', '$rootScope', '$window', '$injector', 'localStorageService', '$location', 'userService2',
    function ($q, $rootScope, $window, $injector, localStorageService, $location, userService2) {
        function noticeAlert(_msg, _type) {
            var msgObject = { msg: _msg, type: _type }
            if (!$rootScope.noticeAlert) { $rootScope.noticeAlert = []; }
            $rootScope.noticeAlert.push(msgObject);
        }
        function retryRequest($http, config, deferred) {
            function successCallback(response) {
                deferred.resolve(response);
            }
            function errorCallback(response) {
                deferred.reject(response);
            }
            $http(config).then(successCallback, errorCallback);
        }
        function convertDate(inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat);
            console.log(inputFormat);
            if (inputFormat == null) {
                return null;
            }
            return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-');
        }
        var result = {
            // On request success
            request: function (config) {
                var arrDate = ['ngayCT', 'ngayHoaDon', 'fromDate', 'toDate', 'tuNgay', 'denNgay', 'ngayCap', 'ngayKeKhai'];
                if (config.data) {
                    var object;
                    try {
                        object = JSON.parse(config.data);
                    } catch (e) {
                        object = config.data;
                    }
                    angular.forEach(object, function (value, key) {
                        if (arrDate.indexOf(key) != -1) {
                            object[key] = convertDate(object[key]);
                            config.data = JSON.stringify(object);
                        }
                        else {
                            config.data = config.data;
                        }
                    });
                    if (object.filtered && object.filtered.advanceData) {
                        angular.forEach(object.filtered.advanceData, function (value, key) {
                            if (arrDate.indexOf(key) != -1) {
                                object.filtered.advanceData[key] = convertDate(object.filtered.advanceData[key]);
                                config.data = JSON.stringify(object);
                            }
                            else {
                                config.data = config.data;
                            }
                        });
                    }
                }
                config.headers = config.headers || {};
                var currentUser = userService2.GetCurrentUser();
                if (currentUser != null) {
                    config.headers.Authorization = 'Bearer ' + currentUser.access_token;
                }
                return config || $q.when(config);
            },
            // On request failure
            requestError: function (rejection) {
                // Return the promise rejection.
                return $q.reject(rejection);
            },
            // On response success
            response: function (response) {
                // Return the response or promise.
                return response || $q.when(response);
            },

            // On response failture
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    $location.path('/login');
                    return $q.reject(rejection);
                }
                // Return the promise rejection.
                var hostname = window.location.hostname;
                var port = window.location.port;
                var rootUrl = 'http://' + hostname + ':' + port;
                var modal = $injector.get('$uibModal');
                $window.notify(rejection);
                if (rejection.status != 404) {
                    var message = rejection.statusText;
                    if (rejection.data) {
                        message = rejection.data.message || rejection.data.error;
                    }
                    noticeAlert("Lỗi Mã: " + rejection.status + "-" + message, "danger");
                }
                return $q.reject(rejection);
            }
        };
        return result;
    }
]);