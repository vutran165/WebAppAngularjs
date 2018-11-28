authorizeModule.factory('userService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var serviceUrl = configService.rootUrlWebApi + '/Authorize/User';
        var result = {
            postQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            post: function (data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback);
            },
            postRegister: function (data, callback) {
                $http.post(serviceUrl + '/Register', data).success(callback);
            },
            getCurrentUser: function (callback) {
                $http.get(serviceUrl + '/GetCurrentUser').success(callback);
            },
            getAuthenticateUser: function (callback) {
                $http.get(serviceUrl + '/GetAuthenticateUser').success(callback);
            },
            update: function (params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            changePassword: function (params, callback) {
                return $http.post(serviceUrl + '/ChangePassword', params).success(callback);;
            },
            //delete
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
            getTreeDonVi: function () {
                return $http.get(serviceUrl + '/GetTreeDonVi');
            },
            getDonVi: function (maDonVi, callback) {
                $http.get(serviceUrl + '/GetDataDonVi/' + maDonVi).success(callback);
            },
            getUserByMaDonVi: function (callback) {
                $http.get(serviceUrl + '/GetUserByMaDonVi').success(callback);
            },
            getAllUser: function (maDonVi, callback) {
                $http.post(serviceUrl + '/GetAllUser/' + maDonVi).success(callback);
            },
            getAccountByUserName: function (para, callback) {
                $http.post(serviceUrl + '/GetAccountByUserName', para).success(callback);
            },
            getUserInGroup: function (idGroup, callback) {
                $http.get(serviceUrl + '/GetUserInGroup/' + idGroup).success(callback);
            }
        }
        return result;
    }
]);


//Chung 24-4-2017
authorizeModule.factory('userService2', ['localStorageService', '$rootScope', function (localStorageService, $rootScope) {

    var fac = {};
    fac.CurrentUser = null;

    fac.SetCurrentUser = function (user) {
        fac.CurrentUser = user;
        localStorageService.set('authorizationData', angular.toJson(user));
        $rootScope.currentUser = user;
    }

    fac.GetCurrentUser = function () {
        fac.CurrentUser = angular.fromJson(localStorageService.get('authorizationData'));
        $rootScope.currentUser = fac.CurrentUser;
        return fac.CurrentUser;
    }
    return fac;
}]);
authorizeModule.factory('accountService2', [
    '$http', '$q', 'configService', 'userService2', 'localStorageService', '$location', 'mdService', function ($http, $q, configService, userService, localStorageService, $location, mdService) {
        var fac = {};
        fac.login = function (user) {
            var obj = {
                'username': user.username,
                'password': user.password,
                'grant_type': 'password',
                'typeuser': user.typeuser
            };
            Object.toparams = function ObjectsToParams(obj) {
                var p = [];
                for (var key in obj) {
                    p.push(key + '=' + encodeURIComponent(obj[key]));
                }
                return p.join('&');
            }

            var defer = $q.defer();
            $http({
                method: 'post',
                url: configService.apiServiceBaseUri + "/token",
                data: Object.toparams(obj),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                userService.SetCurrentUser(response.data);
                mdService.loadDataAuth();
                defer.resolve(response.data);
            }, function (error) {
                defer.reject(error.data);
            });
            return defer.promise;
        }
        fac.logout = function () {
            userService.CurrentUser = null;
            userService.SetCurrentUser(userService.CurrentUser);
            localStorageService.remove('authorizationData');
            $location.path('/login');
        }
        return fac;
    }
]);
//Chung 24-4-2017
var userController = authorizeModule.controller('userController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$timeout', '$mdDialog',
'authorizeService', 'configService', 'userService', 'blockUI', 'Upload', 'clientService', 'localStorageService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $timeout, $mdDialog,
authorizeService, configService, userService, blockUI, Upload, clientService, localStorageService) {
    $scope.config = authorizeService.config;
    $scope.tempData = authorizeService.tempData;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    //isDeleteable

    function filterData() {
        $scope.isLoading = true;
        userService.getTreeDonVi().then(function (response) {
            $scope.data = response.data;
        }, function (response) {
            console.log("Log Error:" + response);
        });
    };

    $scope.isDeleteable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'username'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.doSearch = function () {
        $scope.paged.currentPage = 1;
        filterData();
    };
    $scope.pageChanged = function () {
        filterData();
    };

    $scope.refresh = function () {
        $scope.setPage($scope.paged.currentPage);
    };
    $scope.title = function () {
        return 'Tài khoản người dùng';
    };
    $scope.addUser = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: authorizeService.buildUrl('user', 'addAccount'),
            controller: 'authorizeAddAccountController',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });

        modalInstance.result.then(function (updatedData) {
            var index = $scope.data.indexOf(target);
            if (index !== -1) {
                $scope.data[index] = updatedData;
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.details = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: authorizeService.buildUrl('user', 'details'),
            controller: 'authorizeDetailsController',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
    };

    //delete
    $scope.deleteItem = function (ev, item) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Cảnh báo')
            .textContent('Thao tác này sẽ xóa toàn bộ tài khoản thuộc đơn vị này! Bạn có chắc chắn muốn thực hiện ?')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Ok')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            userService.deleteItem(item).then(function (data) {
            }).then(function (data) {
                $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Thông báo')
                        .textContent('Xóa thành công')
                        .ariaLabel('Alert')
                        .ok('Ok')
                        .targetEvent(ev))
                    .finally(function () {
                        filterData();
                    });
            });

        }, function () {
        });
    };


    filterData();

    $scope.selectNodeLabel = function (value, $event) {
        $scope.currentNode = value;
        userService.getDonVi(value.maDonVi, function (response) {
            if (response.status) {
                $scope.lstEmployees = response.data.dataProfile;
            } else {
                clientService.noticeAlert("Chưa chọn đơn vị", "danger");
            }
        });
    }
}]);

authorizeModule.controller('authorizeDetailsController', [
'$scope', '$uibModalInstance',
'authorizeService', 'userService', 'targetData',
function ($scope, $uibModalInstance,
    authorizeService, userService, targetData) {
    $scope.config = authorizeService.config;
    $scope.target = targetData;
    $scope.title = function () { return 'Thông tin Tài khoản đơn vị: ' + '[' + $scope.target.maDonVi + ']'; };
    userService.getAccountById(targetData.id, function (response) {
        $scope.lstAccount = response;
    });
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

authorizeModule.controller('authorizeAddAccountController', [
    '$scope', '$uibModalInstance',
    'authorizeService', 'userService', 'targetData', 'clientService',
    function ($scope, $uibModalInstance,
        authorizeService, userService, targetData, clientService) {
        $scope.config = authorizeService.config;
        $scope.target = targetData;
        $scope.tempData = authorizeService.tempData;
        $scope.title = function () { return 'Thêm Tài khoản người dùng  ' + targetData.maCuaHang; };
        $scope.save = function () {
            $scope.target.maCuaHang = targetData.maCuaHang;
            userService.post(JSON.stringify($scope.target),
                function (response) {
                    //Fix
                    if (response.status) {
                        console.log('Create  Successfully!');
                        clientService.noticeAlert("Thành công", "success");
                        $uibModalInstance.close($scope.target);

                    } else {
                        clientService.noticeAlert("Chưa có nhân viên thuộc đơn vị này", "danger");
                    }
                    //End fix
                });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);


authorizeModule.controller('accountUnitController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog', '$filter', 'donViHaiQuanService', 'mdService',
'userService', 'configService', 'authorizeService', 'blockUI',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog, $filter, donViHaiQuanService, mdService,
userService, configService, authorizeService, blockUI) {
    $scope.config = authorizeService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.paged.itemsPerPage = 20;
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.idHQ = {};
    $scope.tempData = mdService.tempData;

    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        //filterData();
    };
    $scope.sortType = 'code'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.doSearch = function (input) {
        filterData(input);
    };
    $scope.pageChanged = function () {
        //filterData();
    };
    $scope.goHome = function () {
        $state.go('home');
    };
    $scope.refresh = function () {
        $scope.setPage($scope.paged.currentPage);
    };
    $scope.title = function () {
        return 'Danh sách tài khoản ';
    };

    //delete
    $scope.deleteItem = function (ev, item) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Cảnh báo')
              .textContent('Dữ liệu có thể liên kết với các dữ liệu khác, bạn có chắc muốn xóa?')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Ok')
              .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            userService.deleteItem(item).then(function (data) {
            }).then(function (data) {
                $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Thông báo')
                .textContent('Xóa thành công')
                .ariaLabel('Alert')
                .ok('Ok')
                .targetEvent(ev))
                    .finally(function () {
                        //filterData();
                    });
            });

        }, function () {
            console.log('Không xóa');
        });
    };
    //reset password
    $scope.reset = function (item) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: authorizeService.buildUrl('user', 'reset-password'),
            controller: 'resetPasswordController',
            resolve: {
                targetData: function () {
                    return item;
                }
            }
        });

        modalInstance.result.then(function (updatedData) {
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.create = function () {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: authorizeService.buildUrl('user', 'account-add'),
            controller: 'accountUnitCreateController',
            resolve: {}
        });

        modalInstance.result.then(function (updatedData) {
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.update = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: authorizeService.buildUrl('user', 'account-update'),
            controller: 'accountUnitEditController',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
        modalInstance.result.then(function (updatedData) {
            var index = $scope.data.indexOf(target);
            if (index !== -1) {
                $scope.data[index] = updatedData;
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.details = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: authorizeService.buildUrl('user', 'account-details'),
            controller: 'accountUnitDetailsController',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
    };

    function filterData(input) {
        $scope.isLoading = true;
        var maDonVi = $rootScope.currentUser.maDonVi;
        $scope.filtered.advanceData.typeUser = 1;
        var postdata = { paged: $scope.paged, filtered: input, maDonVi: maDonVi };
        userService.postQuery(
            JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    $scope.data = response.data.data;
                    angular.extend($scope.paged, response.data);
                }
            });
    };

    var maDonVi = $rootScope.currentUser.idHaiQuan;
    donViHaiQuanService.getHaiQuanById(maDonVi, function (response) {
        $scope.lstDonViHaiQuan = response;
    });
    $scope.filtered.advanceData.maHaiQuan = $rootScope.currentUser.maHaiQuan;
    $scope.filtered.advanceData.idHaiQuan = $rootScope.currentUser.idHaiQuan;
    $scope.onChangeMaHaiQuan = function (mahq) {
        if (mahq) {
            mahq = mahq.toUpperCase();
            var data = $filter('filter')($scope.lstDonViHaiQuan, { value: mahq }, true);
            if (data && data.length > 0) {
                $scope.filtered.advanceData.maHaiQuan = data[0].value;
                $scope.filtered.advanceData.idHaiQuan = data[0].id;
                $scope.lstDoanhnghiep = $scope.tempData.companiesByHQ.filter(function (dn) {
                    return (dn.referenceDataId.indexOf($scope.filtered.advanceData.idHaiQuan) === 0);

                });
            }
        }
    };
}]);
authorizeModule.controller('accountUnitDetailsController', [
'$scope', '$uibModalInstance',
'authorizeService', 'mdService', 'userService', 'targetData', '$filter',
function ($scope, $uibModalInstance,
    authorizeService, mdService, userService, targetData, $filter) {
    $scope.tempData = mdService.tempData;
    $scope.config = authorizeService.config;
    $scope.target = targetData;
    $scope.title = function () { return 'Chi tiết tài khoản'; };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

authorizeModule.controller('accountUnitCreateController', [
    '$scope', '$uibModalInstance', '$rootScope',
    'authorizeService', 'mdService', 'userService', 'clientService', 'donViHaiQuanService', '$filter', 'configService',
    function ($scope, $uibModalInstance, $rootScope,
        authorizeService, mdService, userService, clientService, donViHaiQuanService, $filter, configService) {
        $scope.tempData = mdService.tempData;
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.filtered.isAdvance = true;
        $scope.config = authorizeService.config;
        $scope.target = {};
        var maDonVi = $rootScope.currentUser.idHaiQuan;
        $scope.currentUnitCustom = $rootScope.currentUser.maHaiQuan;
        $scope.target.unitCode = $scope.currentUnitCustom;
        $scope.target.typeUser = $rootScope.currentUser.typeUser;
        $scope.target.idHaiQuan = $rootScope.currentUser.idHaiQuan;
        $scope.target.maHaiQuan = $rootScope.currentUser.maHaiQuan;
        donViHaiQuanService.getHaiQuanById(maDonVi, function (response) {
            $scope.lstDonViHaiQuan = response;
        });

        $scope.onChangeMaHaiQuan = function (mahq) {
            if (mahq) {
                mahq = mahq.toUpperCase();
                var data = $filter('filter')(mdService.tempData.donViHaiQuans, { value: mahq }, true);
                if (data && data.length > 0) {
                    $scope.filtered.advanceData.maHaiQuan = data[0].value;
                    $scope.filtered.advanceData.idHaiQuan = data[0].id;

                    $scope.lstDoanhnghiep = $scope.tempData.companiesByHQ.filter(function (dn) {
                        return (dn.referenceDataId.indexOf($scope.filtered.advanceData.idHaiQuan) === 0);
                    });
                }
            }
        };
        $scope.title = function () { return 'Thêm tài khoản'; };

        $scope.save = function () {
            $scope.target.unitCode = $rootScope.currentUser.idHaiQuan;
            userService.postRegister(JSON.stringify($scope.target),
             function (response) {
                 //Fix
                 if (response.status) {
                     console.log('Create  Successfully!');
                     clientService.noticeAlert("Thành công", "success");
                     $uibModalInstance.close($scope.target);

                 } else {
                     clientService.noticeAlert(response.message, "danger");
                 }
                 //End fix
             });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

authorizeModule.controller('accountUnitEditController', [
    '$scope', '$uibModalInstance',
    'authorizeService', 'mdService', 'userService', 'targetData', 'clientService', '$rootScope',
    function ($scope, $uibModalInstance,
        authorizeService, mdService, userService, targetData, clientService, $rootScope) {
        $scope.tempData = mdService.tempData;
        $scope.target = targetData;
        $scope.config = authorizeService.config;
        $scope.title = function () { return 'Cập nhật tài khoản'; };
        var maDonVi = $rootScope.currentUser.idHaiQuan;
        $scope.currentUnitCustom = $rootScope.currentUser.maHaiQuan;
        $scope.target.unitCode = $scope.currentUnitCustom;
        $scope.onChangeMaHaiQuan = function (mahq) {
            if (mahq) {
                mahq = mahq.toUpperCase();
                var data = $filter('filter')(mdService.tempData.donViHaiQuans, { value: mahq }, true);
                if (data && data.length > 0) {
                    $scope.filtered.advanceData.maHaiQuan = data[0].value;
                    $scope.filtered.advanceData.idHaiQuan = data[0].id;

                    $scope.lstDoanhnghiep = $scope.tempData.companiesByHQ.filter(function (dn) {
                        return (dn.referenceDataId.indexOf($scope.filtered.advanceData.idHaiQuan) === 0);
                    });
                }
            }
        };
        $scope.save = function () {
            $scope.target.unitCode = $rootScope.currentUser.idHaiQuan;
            userService.update($scope.target).then(
                function (response) {
                    if (response.status && response.status == 200) {
                        if (response.data.status) {
                            console.log('Create  Successfully!');
                            clientService.noticeAlert("Thành công", "success");
                            $uibModalInstance.close($scope.target);
                        } else {
                            clientService.noticeAlert(response.data.message, "danger");
                        }
                    } else {
                        console.log('ERROR: Update failed! ' + response.errorMessage);
                        clientService.noticeAlert(response.errorMessage, "danger");
                    }
                },
                function (response) {
                    console.log('ERROR: Update failed! ' + response);
                });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
authorizeModule.controller('resetPasswordController', [
    '$scope', '$uibModalInstance', 'authorizeService', 'mdService', 'userService', 'targetData', 'clientService',
    function ($scope, $uibModalInstance, authorizeService, mdService, userService, targetData, clientService) {
        $scope.tempData = mdService.tempData;
        $scope.target = targetData;
        $scope.target.password = '';
        $scope.config = authorizeService.config;
        $scope.title = function () { return 'Cập nhật mật khẩu tài khoản [' + $scope.target.username + ']' };
        $scope.save = function () {
            userService.update($scope.target).then(
                function (response) {
                    if (response.status && response.status == 200) {
                        if (response.data.status) {
                            console.log('Create  Successfully!');
                            clientService.noticeAlert("Reset tài khoản thành công", "success");
                            $uibModalInstance.close($scope.target);
                        } else {
                            clientService.noticeAlert(response.data.message, "danger");
                        }
                    } else {
                        console.log('ERROR: Update failed! ' + response.errorMessage);
                        clientService.noticeAlert(response.errorMessage, "danger");
                    }
                },
                function (response) {
                    console.log('ERROR: Update failed! ' + response);
                });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
authorizeModule.controller('loginController', [
    '$scope', '$location', '$state', '$window',
    'authorizeService', 'userService2', 'mdService', 'clientService', '$cookies', 'accountService2', '$rootScope',
    function ($scope, $location, $state, $window,
        authorizeService, userService, mdService, clientService, $cookies, accountService, $rootScope) {
        $scope.tempData = mdService.tempData;
        $scope.loginData = {
            username: "",
            password: "",
            typeuser: 0
        };
        $scope.message = "";
        $scope.login = function () {
            if (!$scope.loginData.username || !$scope.loginData.password) {
                $scope.message = "Vui lòng điền đầy đủ thông tin!";
                return;
            }

            accountService.login($scope.loginData).then(function (data) {
                $location.path('/home');
            }, function (error) {
                if (error) {
                    $scope.message = 'Tài khoản không tồn tại';
                }
            });
        };
    }
]);

authorizeModule.controller('logOutController', [
    '$scope', '$location', '$state', '$window',
    'accountService2', 'userService2', 'mdService', 'clientService', '$cookies', 'accountService2', '$rootScope',
    function ($scope, $location, $state, $window,
        accountService2, userService, mdService, clientService, $cookies, accountService, $rootScope) {
        function logout() {
            accountService2.logout();
        }
        logout();
    }
]);
