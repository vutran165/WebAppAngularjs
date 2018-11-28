var authorizeModule = angular.module('authorizeModule', ['ui.bootstrap', 'ngFilters', 'ngServices', 'ngResource', 'blockUI', 'ngFileUpload', 'LocalStorageModule']);

authorizeModule.config([
    '$windowProvider', '$stateProvider', '$httpProvider', '$urlRouterProvider', '$routeProvider', '$locationProvider',
    function ($windowProvider, $stateProvider, $httpProvider, $urlRouterProvider, $routeProvider, $locationProvider) {
        var window = $windowProvider.$get('$window');
        var hostname = window.location.hostname;
        var port = window.location.port;
        var rootUrl = 'http://' + hostname + ':' + port;
        var moduleUrl = rootUrl + 'authorize';
        $stateProvider
            .state('user',
                {
                    url: '/authorize/user',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/Authorize/User/account-index.html',
                    controller: 'accountUnitController',
                    resolve: {
                        permission: function (authorizeService) {
                            return authorizeService.permissionCheck('user');
                        }
                    }
                }
            )
            .state('parameterSystem',
                {
                    url: '/authorize/parameterSystem',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/Authorize/ParameterSystem/index.html',
                    controller: 'parameterSystemController',
                    resolve: {
                        permission: function (authorizeService) {
                            return authorizeService.permissionCheck('parameterSystem');
                        }
                    }
                }
            )
            .state('role',
                {
                    url: '/authorize/role',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/Authorize/Role/index.html',
                    controller: 'roleController',
                    resolve: {
                        permission: function (authorizeService) {
                            return authorizeService.permissionCheck('role');
                        }
                    }
                }
            )
           .state('group',
                {
                    url: '/authorize/group',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/Authorize/Group/index.html',
                    controller: 'groupController',
                    resolve: {
                        permission: function (authorizeService) {
                            return authorizeService.permissionCheck('group');
                        }
                    }
                }
            )
          .state('grant',
                {
                    url: '/authorize/grant',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/Authorize/Grant/index.html',
                    controller: 'grantController',
                    resolve: {
                        permission: function (authorizeService) {
                            return authorizeService.permissionCheck('grant');
                        }
                    }
                }
            )
          .state('refresh',
                {
                    url: '/authorize/refresh',
                    templateUrl: rootUrl + '/_layouts/15/app/views/refresh.html',
                    controller: 'refreshController',
                    resolve: {
                        permission: function (authorizeService) {
                            return authorizeService.permissionCheck('refresh');
                        }
                    }
                }
            )
            .state('accountUnit',
                {
                    url: '/authorize/accountUnit',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/Authorize/User/account-index.html',
                    controller: 'accountUnitController',
                    resolve: {
                        permission: function (authorizeService) {
                            return authorizeService.permissionCheck('accountUnit');
                        }
                    }
                }
            )
          .state('phanQuyen',
                {
                    url: '/authorize/phanQuyen',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/Authorize/PhanQuyen/index.html',
                    controller: 'phanQuyenController',
                    resolve: {
                        permission: function (authorizeService) {
                            return authorizeService.permissionCheck('phanQuyen');
                        }
                    }
                })
            .state('doimatkhau',
            {
                url: '/authorize/changePassword',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/Authorize/ChangePassword/index.html',
                controller: 'changePasswordController',
            })
            .state('thoat',
            {
                templateUrl: rootUrl + '/_layouts/15/app/views/login.html',
                controller: 'logOutController'
            })
        ;
    }
]);

var roles = {
    view: true,
    add: true,
    edit: true,
    delete: true,
    approve: true
};

authorizeModule.factory('authorizeService', [
    '$resource', '$http', '$window', 'clientService', 'configService', 'localStorageService', '$q','$rootScope','$location',
    function ($resource, $http, $window, clientService, configService, localStorageService, $q, $rootScope, $location) {
        var hostname = window.location.hostname;
        var port = window.location.port;
        var rootUrl = 'http://' + hostname + ':' + port;
        var serviceUrl = configService.apiServiceBaseUri;
        function isFromBiggerThanToNow(dtmfrom) {
            return new Date(dtmfrom).getTime() >= new Date().getTime();
        }

        var result = {
            config: configService,
            client: clientService,
            permissionModel: {
                permission: {},
                isPermissionLoaded: false
            },
            permissionCheck: function (data, roleCollection) {
                if (!roleCollection) {
                    roleCollection = roles;
                }
                var deferred = $q.defer();
                var parentPointer = this;
                this.permissionModel = {};
                this.permissionModel.permission = {};
                if (this.permissionModel.isPermissionLoaded) {
                    console.log(this.permissionModel);
                    this.getPermission(this.permissionModel, roleCollection, deferred);
                } else {
                    var url = configService.apiServiceBaseUri + "/api/Authorize/User/GetGrant";
                    $http({
                        method: 'GET',
                        url: url + "?state=" + data
                    }).then(function (success) {
                        if (success && success.status === 200) {
                            if (success.data && success.data.code && success.data.code === '401') {
                                console.log("Access denied.");
                                alert("Bạn không có quyền truy cập !");
                                parentPointer.permissionModel.isPermissionLoaded = false;
                                parentPointer.getPermission(parentPointer.permissionModel, roleCollection, deferred);
                            } else if (success.data.code === '200' && success.data.message === 'OK') {
                                parentPointer.permissionModel.permission = success.data.extData;   //list quyen
                                parentPointer.permissionModel.isPermissionLoaded = true;
                                parentPointer.getPermission(parentPointer.permissionModel, roleCollection, deferred);
                            } else {
                                parentPointer.permissionModel.isPermissionLoaded = true;
                                parentPointer.getPermission(parentPointer.permissionModel, roleCollection, deferred);

                            }
                        }
                    }, function (error) {
                        if (error.data && error.data.code && error.data.code === '401') {
                            $location.path('/login');
                        } else {
                            alert("Lỗi hệ thống !");
                            parentPointer.permissionModel.isPermissionLoaded = false;
                            parentPointer.getPermission(parentPointer.permissionModel, roleCollection, deferred);
                        }
                    });
                }


                return deferred.promise;
            },
            getPermission: function (permissionModel, roleCollection, deferred) {
                var ifPermissionPassed = false;
                angular.forEach(roleCollection, function (role) {
                    switch (role) {
                        case roles.view:
                            if (permissionModel.isPermissionLoaded) {
                                ifPermissionPassed = true;
                            }
                            break;
                        case roles.add:
                            if (permissionModel.isPermissionLoaded) {
                                ifPermissionPassed = true;
                            }
                            break;
                        case roles.edit:
                            if (permissionModel.isPermissionLoaded) {
                                ifPermissionPassed = true;
                            }
                            break;
                        case roles.delete:
                            if (permissionModel.isPermissionLoaded) {
                                ifPermissionPassed = true;
                            }
                            break;
                        case roles.approve:
                            if (permissionModel.isPermissionLoaded) {
                                ifPermissionPassed = true;
                            }
                            break;
                    }
                });
                if (!ifPermissionPassed) {
                    $rootScope.$on("$stateChangeStart",
                        function (event, toState, toParams, fromState, fromParams, options) {
                            event.preventDefault();
                            deferred.resolve();
                        });
                    $location.path('/home');
                } else {
                    deferred.resolve();
                }
            }
        };
        result.buildUrl = function (module, action) {
            return rootUrl + '/_layouts/15/BTS.SP.ERP/Authorize/' + module + '/' + action + '.html';
        };
        result.fillAuthData = function () {
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                var authorizationData = angular.fromJson(authData);
                var expried = new Date(authorizationData[".expires"]);
                return isFromBiggerThanToNow(expried);
            }
            return false;
        };
        var tempData = $window.CacheManager();
        var cacheStatus = tempData.cacheStatus;
        result.cacheStatus = cacheStatus;
        result.tempData = tempData;
        return result;
    }]);

//authorizeModule.factory('authService', ['$http', '$q', 'localStorageService', 'configService', function ($http, $q, localStorageService, configService) {
//    var serviceBase = configService.apiServiceBaseUri;
//    var authServiceFactory = {};
//    var _authentication = {
//        isAuth: false,
//        username: "",
//        useRefreshTokens: false
//    };
//    var _saveRegistration = function (registration) {
//        _logOut();
//        return $http.post(serviceBase + '/api/user/register', registration).then(function (response) {
//            return response;
//        });
//    };
//    var _login = function (loginData) {
//        var data = "grant_type=password&username=" + loginData.username + "&password=" + loginData.password + "&typeuser=" + loginData.typeuser;
//        if (loginData.useRefreshTokens) {
//            data = data + "&client_id=" + configService.clientId;
//        }
//        var deferred = $q.defer();
//        $http.post(serviceBase + '/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
//            if (loginData.useRefreshTokens) {
//                localStorageService.set('authorizationData', { token: response.access_token, username: loginData.username, refreshToken: response.refresh_token, useRefreshTokens: true });
//            }
//            else {
//                localStorageService.set('authorizationData', { token: response.access_token, username: loginData.username, refreshToken: "", useRefreshTokens: false });
//            }
//            _authentication.isAuth = true;
//            _authentication.username = loginData.username;
//            _authentication.useRefreshTokens = loginData.useRefreshTokens;
//            deferred.resolve(response);
//        }).error(function (err, status) {
//            _logOut();
//            deferred.reject(err);
//        });
//        return deferred.promise;
//    };
//    var _logOut = function () {
//        localStorageService.remove('authorizationData');
//        _authentication.isAuth = false;
//        _authentication.username = "";
//        _authentication.useRefreshTokens = false;
//    };
//    var _fillAuthData = function () {
//        var authData = localStorageService.get('authorizationData');
//        if (authData) {
//            _authentication.isAuth = true;
//            _authentication.username = authData.username;
//            _authentication.useRefreshTokens = authData.useRefreshTokens;
//        }
//        return authData;
//    };
//    var _refreshToken = function () {
//        var deferred = $q.defer();
//        var authData = localStorageService.get('authorizationData');
//        if (authData) {
//            if (authData.useRefreshTokens) {
//                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + configService.clientId;
//                localStorageService.remove('authorizationData');
//                $http.post(serviceBase + '/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
//                    localStorageService.set('authorizationData', { token: response.access_token, username: response.username, refreshToken: response.refresh_token, useRefreshTokens: true });
//                    deferred.resolve(response);
//                }).error(function (err, status) {
//                    _logOut();
//                    deferred.reject(err);
//                });
//            }
//        }
//        return deferred.promise;
//    };
//    authServiceFactory.saveRegistration = _saveRegistration;
//    authServiceFactory.login = _login;
//    authServiceFactory.logOut = _logOut;
//    authServiceFactory.fillAuthData = _fillAuthData;
//    authServiceFactory.authentication = _authentication;
//    authServiceFactory.refreshToken = _refreshToken;
//    return authServiceFactory;
//}]);

