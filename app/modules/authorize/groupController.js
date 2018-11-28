mdModule.factory('groupService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var serviceUrl = configService.rootUrlWebApi + '/Authorize/Group';
        var result = {
            postQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            post: function (data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback)
                    .error(function (msg) {
                        clientService.noticeAlert("Lỗi không xác định", "danger");
                    });
            },
            postQuerryData: function (data, callback) {
                $http.post(serviceUrl + '/PostQuerryData', data).success(callback)
                    .error(function (msg) {
                        clientService.noticeAlert("Lỗi không xác định", "danger");
                    });
            },
            postAuPhanQuyen: function (data, callback) {
                $http.post(serviceUrl + '/PostAuPhanQuyen', data).success(callback)
                    .error(function (msg) {
                        clientService.noticeAlert("Lỗi không xác định", "danger");
                    });
            },

            update: function (params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
            getMenu: function () {
                return $http.get(serviceUrl + '/GetMenu');
            },
            getUserByGroup: function (idGroup, callback) {
                $http.get(serviceUrl + '/GetUserByGroup/' + idGroup).success(callback);
            },
            getGroup: function (callback) {
                $http.get(serviceUrl + '/GetGroup').success(callback);
            },
            getMenuInGroup: function (para, callback) {
                $http.post(serviceUrl + '/GetMenuInGroup/', para).success(callback);
            },
            getUserInGroup: function (idGroup, callback) {
                $http.get(serviceUrl + '/GetUserInGroup/' + idGroup).success(callback);
            },
            getMenuByUnitCode: function (idGroup, callback) {
                $http.get(serviceUrl + '/GetMenuByUnitCode/' + idGroup).success(callback);
            },
            checkUserInGroup: function (idGroup, callback) {
                $http.post(serviceUrl + '/CheckUserInGroup/' + idGroup).success(callback);
            }
        }
        return result;
    }
]);

var groupController = mdModule.controller('groupController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'groupService', 'configService', 'authorizeService', 'blockUI', 'localStorageService', 'clientService', '$rootScope', 'donViHaiQuanService', '$filter', 'mdService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
groupService, configService, authorizeService, blockUI, localStorageService, clientService, $rootScope, donViHaiQuanService, $filter, mdService) {
    $scope.config = authorizeService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.paged.itemsPerPage = 20;
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        //filterData();
    };
    $scope.sortType = 'IDgroup'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.doSearch = function (input) {
        $scope.paged.currentPage = 1;
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
        return 'Nhóm quyền';
    };

    $scope.create = function () {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: authorizeService.buildUrl('group', 'add'),
            controller: 'groupCreateController',
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
            templateUrl: authorizeService.buildUrl('group', 'update'),
            controller: 'groupEditController',
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
            templateUrl: authorizeService.buildUrl('group', 'details'),
            controller: 'groupDetailsController',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
    };

    $scope.disThietLapNhom = true;
    $scope.disThietLapQuyen = true;
    //check click check box group
    $scope.usercheck = {};
    $scope.checkGroup = function (index, item) {
        $scope.disThietLapNhom = false;
        $scope.disThietLapQuyen = false;
        if (item.selected) {
            $scope.usercheck = item;
            angular.forEach($scope.data, function (it, idx) {
                if (index != idx)
                    it.selected = false;
            });
        }
    }

    $scope.addUsers = function () {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: authorizeService.buildUrl('group', 'groupSetting'),
            controller: 'groupSettingController',
            size: 'lg',
            resolve: {
                targetData: function () {
                    return $scope.usercheck;
                }
            }
        });
        modalInstance.result.then(function (updatedData) {
        }, function () {
            $scope.refresh();
            $scope.disThietLapNhom = true;
            $scope.disThietLapQuyen = true;
            $('#check').attr('checked', false);
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.addRole = function () {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: authorizeService.buildUrl('group', 'addGroup'),
            controller: 'groupAuthenticateSettingController',
            size: 'lg',
            resolve: {
                targetData: function () {
                    return $scope.usercheck;
                }
            }
        });
        modalInstance.result.then(function (updatedData) {
        }, function () {
            $scope.refresh();
            $scope.disThietLapNhom = true;
            $scope.disThietLapQuyen = true;
            $('#check').attr('checked', false);
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    //delete
    $scope.deleteItem = function (ev, item) {
        //check user in nhóm quyền
        groupService.checkUserInGroup(item.idGroup, function (response) {
            if (response == false) {
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm()
                    .title('Cảnh báo')
                    .textContent('Dữ liệu có thể liên kết với các dữ liệu khác, bạn có chắc muốn xóa?')
                    .ariaLabel('Lucky day')
                    .targetEvent(ev)
                    .ok('Ok')
                    .cancel('Cancel');
                $mdDialog.show(confirm).then(function () {
                    groupService.deleteItem(item).then(function (data) {
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
                });
            }
            else {
                alert('Không thể xóa nhóm quyền này !');
            }
        });

    };

    var maDonVi = $rootScope.currentUser.idHaiQuan;
    console.log(maDonVi);
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
            }
        }
    };
    $scope.filtered.advanceData.maHaiQuan = $rootScope.currentUser.maHaiQuan;
    $scope.filtered.advanceData.idHaiQuan = $rootScope.currentUser.idHaiQuan;
    //end check grant
    //filterData();
    //$scope.filtered.advanceData.maHaiQuan = 
    function filterData(input) {
        $scope.isLoading = true;
        var postdata = { paged: $scope.paged, filtered: input, maDonVi: maDonVi };
        groupService.postQuery(
            JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    $scope.data = response.data.data;
                    angular.forEach($scope.data, function (value, index) {
                        value.tenHaiQuan = $scope.tenHaiQuan;
                    });
                    angular.extend($scope.paged, response.data);
                }
            });
    };
}]);

mdModule.controller('groupDetailsController', [
'$scope', '$uibModalInstance',
'authorizeService', 'groupService', 'targetData', '$filter',
function ($scope, $uibModalInstance,
    authorizeService, groupService, targetData, $filter) {
    $scope.config = authorizeService.config;
    groupService.getUserByGroup(targetData.id, function (response) {
        $scope.lstUser = response;

    });
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(authorizeService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };

    $scope.title = function () { return 'Thông tin người sử dụng nhóm quyền'; };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

mdModule.controller('groupCreateController', [
    '$scope', '$uibModalInstance',
    'authorizeService', 'groupService', 'clientService', '$uibModal', '$rootScope',
    function ($scope, $uibModalInstance,
        authorizeService, groupService, clientService, $uibModal, $rootScope) {
        $scope.config = authorizeService.config;
        $scope.target = {};
        $scope.tempData = authorizeService.tempData;
        $scope.title = function () { return 'Thêm nhóm quyền'; };
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
            console.log($scope.target);
            groupService.post(
                JSON.stringify($scope.target),
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

mdModule.controller('groupEditController', [
    '$scope', '$uibModalInstance',
    'authorizeService', 'groupService', 'targetData', 'clientService', '$uibModal',
    function ($scope, $uibModalInstance,
        authorizeService, groupService, targetData, clientService, $uibModal) {
        $scope.config = authorizeService.config;
        $scope.target = targetData;
        $scope.tempData = authorizeService.tempData;
        $scope.title = function () { return 'Cập nhập quyền: ' + '[' + $scope.target.nameGroup + ']' };

        $scope.save = function () {
            groupService.update($scope.target).then(
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

mdModule.controller('groupAuthenticateSettingController', [
'$scope', '$uibModalInstance',
'authorizeService', 'groupService', 'targetData', '$filter', 'menuService', 'clientService', 'userService', '$rootScope',
function ($scope, $uibModalInstance,
    authorizeService, groupService, targetData, $filter, menuService, clientService, userService, $rootScope) {
    $scope.config = authorizeService.config;
    $scope.target = targetData;
    $scope.title = function () { return 'Thiết lập quyền: ' + $scope.target.nameGroup + ' [' + $scope.target.idGroup + ']'; };
    $scope.lstUserIsExist = [];
    $scope.lstUserNotIn = [];
    var maDonVi = $rootScope.currentUser.idHaiQuan;
    //lấy danh sách các user đã phân quyền trong nhóm này
    groupService.getUserInGroup($scope.target.idGroup, function (response) {
        $scope.datas = response;
        if ($scope.datas) {
            for (var i = 0; i < $scope.datas.length; i++) {
                $scope.datas[i].userid = $scope.datas[i].id;
                $scope.datas[i].groupId = $scope.target.idGroup;
                $scope.datas[i].groupName = $scope.target.nameGroup;
                $scope.lstUserIsExist.push($scope.datas[i]);
            }
        }
        //lấy danh sách menu phân cấp 
        userService.getAllUser(maDonVi, function (responses) {
            $scope.data = responses;
            for (var i = 0; i < $scope.data.length; i++) {
                $scope.data[i].userid = $scope.data[i].id;
                $scope.data[i].groupId = $scope.target.idGroup;
                $scope.data[i].groupName = $scope.target.nameGroup;
                $scope.data[i].userName = $scope.data[i].username;
                $scope.lstUserNotIn.push($scope.data[i]);
            }

            //check menu đã tồn tại để add vào list
            if ($scope.lstUserIsExist.length > 0) {
                for (var a = 0; a < $scope.lstUserIsExist.length; a++) {
                    $scope.lstUserIsExist[a].groupId = $scope.target.idGroup;
                    var ma = $scope.lstUserIsExist[a].userName;
                    angular.forEach($scope.lstUserNotIn, function (value, index) {
                        if (value.userName === ma) {
                            $scope.lstUserNotIn.splice(index, 1);
                        }
                    });
                }
            }

            $scope.models = {
                basket: $scope.lstUserIsExist,
                cars: $scope.lstUserNotIn
            };

        });

    });

    $scope.choiceAll = function () {
        $scope.models.basket = $scope.models.cars;
        $scope.models.cars = [];
    }

    $scope.unChoiceAll = function () {
        $scope.models.cars = $scope.models.basket;
        $scope.models.basket = [];
    }

    $scope.dataIndex = [];
    $scope.choiceMenu = function (item) {
        $scope.dataIndex.push(item);
    }
    $scope.choiceOne = function () {
        for (var i = 0; i < $scope.dataIndex.length; i++) {
            $scope.models.basket.push($scope.dataIndex[i]);
            var ma = $scope.dataIndex[i].userName;
            angular.forEach($scope.models.cars, function (value, index) {
                if (value.userName === ma)
                    $scope.models.cars.splice(index, 1);
            });
        }
        $scope.dataIndex = [];
    }

    $scope.removeList = function (item, index) {
        $scope.models.cars.push(item);
        $scope.models.basket.splice(index, 1);
    }

    $scope.save = function () {
        if ($scope.models.basket.length > 0) {
            groupService.postAuPhanQuyen(JSON.stringify($scope.models.basket),
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
        }
        else {
            clientService.noticeAlert('Chưa chọn tài khoản !', "danger");
        }

    };


    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

mdModule.controller('groupSettingController', [
'$scope', '$uibModalInstance',
'authorizeService', 'groupService', 'targetData', '$filter', 'menuService', 'clientService', '$rootScope',
function ($scope, $uibModalInstance,
    authorizeService, groupService, targetData, $filter, menuService, clientService, $rootScope) {
    $scope.config = authorizeService.config;
    $scope.lstMenuIsExist = [];
    $scope.lstMenuNotIn = [];
    $scope.target = targetData;
    $scope.title = function () { return 'Thiết lập nhóm quyền: ' + $scope.target.nameGroup + ' [' + $scope.target.idGroup + ']'; };
    var maDonVi = $rootScope.currentUser.idHaiQuan;
    var user = $rootScope.currentUser.username;
    //lấy danh sách các quyền đã phân quyền trong nhóm này
    $scope.para = {
        idGroup: $scope.target.idGroup,
        maDonVi: maDonVi,
        userName: user
    };
    groupService.getMenuInGroup($scope.para, function (response) {
        if (response) {
            for (var i = 0; i < response.length; i++) {
                response[i].tenMenu = response[i].description;
                $scope.lstMenuIsExist.push(response[i]);
            }
        }


        //lấy danh sách menu phân cấp 

        $scope.lst = [];
        if (maDonVi === '01') {
            menuService.getTreeMenu(function (responses) {
                $scope.data = responses;
                for (var i = 0; i < $scope.data.length; i++) {
                    $scope.data[i].idGroup = $scope.target.idGroup;
                    $scope.data[i].description = $scope.data[i].tenMenu;
                    $scope.lstMenuNotIn.push($scope.data[i]);
                }

                //check menu đã tồn tại để add vào list
                if ($scope.lstMenuIsExist.length > 0) {
                    for (var a = 0; a < $scope.lstMenuIsExist.length; a++) {
                        $scope.lstMenuIsExist[a].idGroup = $scope.target.idGroup;
                        $scope.lstMenuIsExist[a].tenMenu = $scope.lstMenuIsExist[a].description;
                        var ma = $scope.lstMenuIsExist[a].maMenu;
                        angular.forEach($scope.lstMenuNotIn, function (value, index) {
                            if (value.maMenu === ma) {
                                $scope.lstMenuNotIn.splice(index, 1);
                            }
                        });
                    }
                }
                $scope.models = {
                    basket: $scope.lstMenuIsExist,
                    cars: $scope.lstMenuNotIn
                };

            });
        }
        else {
            $scope.lstMenuInGroup = [];
            $scope.lstMenuOfGroup = $scope.lstMenuIsExist;

            groupService.getMenuByUnitCode($scope.target.idGroup, function (response) {
                if (response) {
                    for (var i = 0; i < response.length; i++) {
                        response[i].tenMenu = response[i].description;
                        $scope.lstMenuInGroup.push(response[i]);
                    }

                }
                if ($scope.lstMenuInGroup.length > 0) {
                    for (var a = 0; a < $scope.lstMenuInGroup.length; a++) {
                        var ma = $scope.lstMenuInGroup[a].maMenu;
                        angular.forEach($scope.lstMenuOfGroup, function (value, index) {
                            if (value.maMenu === ma) {
                                $scope.lstMenuOfGroup.splice(index, 1);
                            }
                        });
                    }
                }
                $scope.models = {
                    basket: $scope.lstMenuInGroup,
                    cars: $scope.lstMenuOfGroup
                };
            });
        }
    });

    $scope.choiceAll = function () {
        $scope.models.basket = $scope.models.cars;
        $scope.models.cars = [];
    }

    $scope.unChoiceAll = function () {
        $scope.models.cars = $scope.models.basket;
        $scope.models.basket = [];
    }

    $scope.dataIndex = [];
    $scope.choiceMenu = function (item) {
        $scope.dataIndex.push(item);
    }
    $scope.choiceOne = function () {
        for (var i = 0; i < $scope.dataIndex.length; i++) {
            $scope.models.basket.push($scope.dataIndex[i]);
            var ma = $scope.dataIndex[i].maMenu;
            angular.forEach($scope.models.cars, function (value, index) {
                if (value.maMenu === ma) {
                    $scope.models.cars.splice(index, 1);
                }
            });
        }
        $scope.dataIndex = [];
    }

    $scope.removeList = function (item, index) {
        $scope.models.cars.push(item);
        $scope.models.basket.splice(index, 1);
    }

    $scope.save = function () {
        if ($scope.models.basket.length > 0) {
            angular.forEach($scope.models.basket, function (value, index) {
                value.unitCode = maDonVi;
                value.idGroup = $scope.target.idGroup;
            });
            groupService.postQuerryData(JSON.stringify($scope.models.basket),
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
        }
        else {
            clientService.noticeAlert('Chưa chọn menu !', "danger");
        }

    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);


mdModule.controller('groupAddUsersController', [
    '$scope', '$uibModalInstance', 'authorizeService', 'clientService', 'userService', 'configService', '$filter', '$uibModal',
    function ($scope, $uibModalInstance, authorizeService, clientService, userService, configService, $filter, $uibModal) {
        $scope.config = authorizeService.config;
        $scope.target = {};
        $scope.tempData = authorizeService.tempData;
        $scope.title = function () { return 'Thêm người sử dụng'; };
        $scope.idDonVi = 0;
        $scope.lstUser = [];
        $scope.filter = function () {
            userService.getUserByMaDonVi($scope.idDonVi, function (response) {
                $scope.tmp = response;
                $scope.lstUser = response;
                $scope.lstUser = angular.copy($scope.tmp);
            });
        };
        $scope.checkAll = function () {
            if ($scope.check === true) {
                angular.forEach($scope.lstUser, function (item) {
                    item.Selected = $scope.check;
                });
            } else {
                angular.forEach($scope.lstUser, function (item) {
                    item.Selected = $scope.check;
                });
            }
        };
        $scope.check = {};
        $scope.checkUser = [];
        $scope.choice = function () {
            $scope.target = $filter('filter')($scope.lstUser, { Selected: true }, true);
            $uibModalInstance.close($scope.target);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);




mdModule.controller('groupAddAuthorController', [
    '$scope', '$uibModalInstance', 'authorizeService', 'clientService', 'targetData', '$uibModal', 'groupService', '$filter',
    function ($scope, $uibModalInstance, authorizeService, clientService, targetData, $uibModal, groupService, $filter) {
        $scope.config = authorizeService.config;
        $scope.target = {};
        $scope.tempData = authorizeService.tempData;
        $scope.title = function () { return 'Thêm nhóm quyền'; };
        $scope.currentNode = targetData;
        $scope.isLoading = true;
        groupService.getGroup(function (response) {
            $scope.isLoading = false;
            $scope.groupRoles = response;
            $scope.groupRoles = angular.copy(response);
        });
        $scope.check = {};
        $scope.groupRoles = [];
        $scope.checkAll = function () {
            if ($scope.check === true) {
                angular.forEach($scope.groupRoles, function (item) {
                    item.Selected = $scope.check;
                });
            } else {
                angular.forEach($scope.groupRoles, function (item) {
                    item.Selected = $scope.check;
                });
            }
        };

        $scope.choiceGroup = function () {
            $scope.target = $filter('filter')($scope.groupRoles, { Selected: true }, true);
            $uibModalInstance.close($scope.target);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);


