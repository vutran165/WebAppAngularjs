var phieuXuatNVLSanXuatService = nvModule.factory('phieuXuatNVLSanXuatService',
    ['$resource', '$http', '$window', 'configService', 'clientService',
  function ($resource, $http, $window, configService, clientService) {
      var rootUrl = configService.apiServiceBaseUri;
      var serviceUrl = rootUrl + '/api/Nv/XuatNVLSanXuat';
      var result = {
          post: function (data, callback) {
              $http.post(serviceUrl + '/Post', data).success(callback)
			    .error(function (msg) {
			        clientService.noticeAlert("Lỗi không xác định", "danger");
			    });
          },
          postQuery: function (data, callback) {
              $http.post(serviceUrl + '/PostQuery', data).success(callback);
          },
          getNewInstance: function (callback) {
              $http.get(serviceUrl + '/GetNewInstance').success(callback);
          },
          getReport: function (id, callback) {
              $http.get(serviceUrl + '/GetReport/' + id).success(callback);
          },
          getDetails: function (id, callback) {
              $http.get(serviceUrl + '/GetDetails/' + id).success(callback);
          },
          getWareHouse: function (id, callback) {
              $http.get(rootUrl + '/api/Md/WareHouse/' + id).success(callback);
          },
          getMerchandise: function (id, callback) {
              $http.get(rootUrl + '/api/Md/Merchandise/Get/' + id).success(callback);
          },
          postApproval: function (id, callback) {
              $http.post(serviceUrl + '/PostApproval', id).success(callback);
          },
          update: function (params) {
              return $http.put(serviceUrl + '/' + params.id, params);
          }
      };
      return result;

  }
])

nvModule.controller('phieuXuatNVLSanXuatController', [
'$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
'phieuXuatNVLSanXuatService', 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', function (
    $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
phieuXuatNVLSanXuatService, configService, clientService, nvService, mdService, blockUI
    ) {
    $scope.config = nvService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'maChungTu'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.doSearch = function () {
        $scope.paged.currentPage = 1;
        filterData();
    };
    $scope.pageChanged = function () {
        filterData();
    };

    $scope.goHome = function () {
        $state.go('home');
    };
    $scope.refresh = function () {
        $scope.setPage($scope.paged.currentPage);
    };
    $scope.title = function () {
        return 'Phiếu xuất nguyên vật liệu sản xuất';
    }
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    }
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };
    $scope.create = function () {

        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('NvPhieuXuatNVLSanXuat', 'add'),
            controller: 'phieuXuatNVLSanXuatCreateController',
            windowClass: 'app-modal-window',
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
            templateUrl: nvService.buildUrl('NvPhieuXuatNVLSanXuat', 'update'),
            controller: 'phieuXuatNVLSanXuatEditController',
            windowClass: 'app-modal-window',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });

        modalInstance.result.then(function (updatedData) {
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.details = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('NvPhieuXuatNVLSanXuat', 'details'),
            controller: 'phieuXuatNVLSanXuatDetailsController',
            windowClass: 'app-modal-window',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
    };

    filterData();
    function filterData() {
        $scope.isLoading = true;
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        phieuXuatNVLSanXuatService.postQuery(
            JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    $scope.data = response.data.data;
                    angular.extend($scope.paged, response.data);
                    console.log($scope.paged);
                }
            });
    };
}])
nvModule.controller('phieuXuatNVLSanXuatDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'phieuXuatNVLSanXuatService', 'targetData', 'clientService', '$filter',
function ($scope, $uibModalInstance,
    mdService, phieuXuatNVLSanXuatService, targetData, clientService, $filter) {

    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Phiếu xuất nguyên vật liệu sản xuất';
    };
    fillterData();
    $scope.formatLabel = function (model, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };
    $scope.approval = function () {
        phieuXuatNVLSanXuatService.postApproval($scope.target, function (response) {
            if (response) {
                alert("Duyệt thành công!");
                fillterData();
            }
            else { alert("Thất bại! - Xảy ra lỗi hoặc phiếu này đã duyệt"); }
        });
    };
    function fillterData() {
        phieuXuatNVLSanXuatService.getDetails($scope.target.id, function (response) {
            if (response.status) {

                $scope.target = response.data;
            }
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);
nvModule.controller('phieuXuatNVLSanXuatCreateController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log',
    'nvService', 'phieuXuatNVLSanXuatService', 'mdService',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log,
        nvService, phieuXuatNVLSanXuatService, mdService) {
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.target = { dataDetails: [], dataClauseDetails: [] };
        $scope.tkKtKhoXuat = "";
        $scope.countIndex = 0;
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.addRow = function (defaultValue) {
            $scope.countIndex++;

            var item = {
                index: $scope.countIndex,
                maHang: '',
                soLuong: 0,
                donGia: 0, //default
                thanhTien: 0
            };
            if (defaultValue) { item = defaultValue };
            var itemClause = {
                index: $scope.countIndex,
                tkNo: '621',
                tkCo: '152',
                doiTuongCo: null,
                doiTuongNo: null,
                soTien: 0
            }
            if ($scope.target.dataClauseDetails.length > 0) {
                var preItem = $scope.target.dataClauseDetails[$scope.target.dataClauseDetails.length - 1];
                itemClause = angular.copy(preItem);
                itemClause.index = $scope.countIndex;
                itemClause.tkNo = '621';
                itemClause.tkCo = '152';
                itemClause.soTien = 0;
            };
            $scope.target.dataDetails.push(item);
            $scope.target.dataClauseDetails.push(itemClause);
        };
        $scope.removeRow = function (index) {
            $scope.target.dataDetails.splice(index, 1);
            $scope.target.dataClauseDetails.splice(index, 1);
        };
        $scope.totalItem = function (index) {
            var itemFocus = $scope.target.dataDetails[index];
            itemFocus.thanhTien = itemFocus.soLuong * itemFocus.donGia;
            $scope.target.thanhTien = sumDataDetail();
            updateClause(itemFocus.index, itemFocus);
        };
        function updateClause(index, itemFocus) {
            angular.forEach($scope.target.dataClauseDetails, function (value, key) {
                if (value.index == index) {
                    value.soTien = itemFocus.thanhTien;
                }
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.title = function () {
            return 'Phiếu xuất nguyên vật liệu sản xuất';
        }
        $scope.updateDetails = function () {
            angular.forEach($scope.target.dataDetails, function (value, key) {
                angular.extend(value, { tkKtKhoXuat: $scope.tkKtKhoXuat });
            });
        };
        $scope.selectedMaHang = function (item, index) {
            var data = $filter('filter')(mdService.tempData.merchandises, { value: item }, true);
            if (data && data.length == 1) {
                phieuXuatNVLSanXuatService.getMerchandise(data.id, function (response) {
                    $scope.target.dataClauseDetails[index].tkCo = response.tkHangHoa == null ? '152' : response.tkHangHoa;
                });
            }

        };

        $scope.selectedKhoXuat = function (item) {
            $scope.target.maKhoXuat = item.value;

            phieuXuatNVLSanXuatService.getWareHouse(item.id, function (response) {
                angular.forEach($scope.target.dataClauseDetails, function (value, key) {
                    value.doiTuongCo = $scope.target.maKhoXuat;
                });
                $scope.tkKtKhoXuat = response.taiKhoanKt;
            })
        };


        function sumDataDetail() {
            if ($scope.target.dataDetails.length > 0) {
                var total = 0;
                angular.forEach($scope.target.dataDetails, function (value, key) {
                    total = total + value.thanhTien;
                });
                return total;
            }
            return 0;
        };
        $scope.save = function () {
            $scope.updateDetails();
            phieuXuatNVLSanXuatService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        $uibModalInstance.close($scope.target);
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
        };
        $scope.saveAndKeep = function () {
            $scope.updateDetails();
            var tempData = angular.copy($scope.target);
            phieuXuatNVLSanXuatService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        phieuXuatNVLSanXuatService.getNewInstance(function (response) {
                            var expectData = response;
                            tempData.maChungTu = expectData.maChungTu;
                            tempData.ngay = expectData.ngay;
                            $scope.target = tempData;
                        })
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
        };

        $scope.saveAndPrint = function () {
            $scope.updateDetails();
            phieuXuatNVLSanXuatService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        console.log(response);
                        var url = $state.href('reportphieuXuatNVLSanXuat', { id: response.id });
                        window.open(url, 'Report Viewer');
                        $uibModalInstance.close($scope.target);
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
        };
        $scope.createWareHouse = function () {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdWareHouse', 'add'),
                controller: 'wareHouseCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('wareHouses');
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.createMerchandise = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'add'),
                controller: 'merchandiseCreateController',
                windowClass: 'app-modal-window',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('merchandises');
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        function filterData() {
            phieuXuatNVLSanXuatService.getNewInstance(function (response) {

                $scope.target = response;
                if ($scope.target.dataDetails.length == 0) {
                    $scope.addRow();
                }
            })
        };
        filterData();


    }
]);
nvModule.controller('phieuXuatNVLSanXuatEditController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log',
    'nvService', 'phieuXuatNVLSanXuatService', 'mdService', 'targetData',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log,
        nvService, phieuXuatNVLSanXuatService, mdService, targetData) {
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.target = targetData;
        $scope.tkKtKhoXuat = "";
        $scope.countIndex = 0;
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.addRow = function (defaultValue) {
            $scope.countIndex++;

            var item = {
                index: $scope.countIndex,
                maHang: '',
                soLuong: 0,
                donGia: 0, //default
                thanhTien: 0
            };
            if (defaultValue) { item = defaultValue };
            var itemClause = {
                index: $scope.countIndex,
                tkNo: '621',
                tkCo: '152',
                doiTuongCo: null,
                doiTuongNo: null,
                soTien: 0
            }
            if ($scope.target.dataClauseDetails.length > 0) {
                var preItem = $scope.target.dataClauseDetails[$scope.target.dataClauseDetails.length - 1];
                itemClause = angular.copy(preItem);
                itemClause.index = $scope.countIndex;
                itemClause.tkNo = '621';
                itemClause.tkCo = '152';
                itemClause.soTien = 0;
            }

            $scope.target.dataDetails.push(item);
            $scope.target.dataClauseDetails.push(itemClause);
        };
        $scope.removeRow = function (index) {
            $scope.target.dataDetails.splice(index, 1);
            $scope.target.dataClauseDetails.splice(index, 1);
        };
        $scope.totalItem = function (index) {
            var itemFocus = $scope.target.dataDetails[index];
            itemFocus.thanhTien = itemFocus.soLuong * itemFocus.donGia;
            $scope.target.thanhTien = sumDataDetail();
            updateClause(itemFocus.index, itemFocus);
        };

        function updateClause(index, itemFocus) {
            angular.forEach($scope.target.dataClauseDetails, function (value, key) {
                if (value.index == index) {
                    value.soTien = itemFocus.thanhTien;
                }
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.title = function () {
            return 'Phiếu xuất nguyên vật liệu sản xuất';
        }
        $scope.updateDetails = function () {
            angular.forEach($scope.target.dataDetails, function (value, key) {
                angular.extend(value, { tkKtKhoXuat: $scope.tkKtKhoXuat });
            });
        };
        $scope.selectedMaHang = function (item, index) {
            var data = $filter('filter')(mdService.tempData.merchandises, { value: item }, true);
            if (data && data.length == 1) {
                phieuXuatNVLSanXuatService.getMerchandise(data.id, function (response) {
                    $scope.target.dataClauseDetails[index].tkCo = response.tkHangHoa == null ? '152' : response.tkHangHoa;
                });
            }

        };
        $scope.selectedKhoXuat = function (item) {
            $scope.target.maKhoXuat = item.value;

            phieuXuatNVLSanXuatService.getWareHouse(item.id, function (response) {
                angular.forEach($scope.target.dataClauseDetails, function (value, key) {
                    value.doiTuongCo = $scope.target.maKhoXuat;
                });
                $scope.tkKtKhoXuat = response.taiKhoanKt;
            })
        };
        function sumDataDetail() {
            if ($scope.target.dataDetails.length > 0) {
                var total = 0;
                angular.forEach($scope.target.dataDetails, function (value, key) {
                    total = total + value.thanhTien;
                });
                return total;
            }
            return 0;
        };
        $scope.save = function () {
            $scope.updateDetails();
            phieuXuatNVLSanXuatService.update($scope.target).then(
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
        function filterData() {
            phieuXuatNVLSanXuatService.getDetails($scope.target.id, function (response) {
                if (response.status) {
                    $scope.target = response.data;
                    var max = 0;
                    angular.forEach($scope.target.dataDetails, function (value, key) {
                        if (value.index > max) {
                            $scope.countIndex = value.index;
                            max = value.index;;
                        }
                    })
                    init();
                }
            });

        };
        function init() {
        }
        $scope.createWareHouse = function () {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdWareHouse', 'add'),
                controller: 'wareHouseCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('wareHouses');
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.createMerchandise = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'add'),
                controller: 'merchandiseCreateController',
                windowClass: 'app-modal-window',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('merchandises');
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        filterData();
    }
]);
nvModule.controller('reportphieuXuatNVLSanXuatController', ['$scope', '$window', '$stateParams', '$timeout',
'mdService', 'phieuXuatNVLSanXuatService', 'clientService',
function ($scope, $window, $stateParams, $timeout,
mdService, phieuXuatNVLSanXuatService, clientService) {
    var id = $stateParams.id;
    $scope.target = {};

    function filterData() {
        if (id) {
            phieuXuatNVLSanXuatService.getReport(id, function (response) {

                if (response.status) {
                    $scope.target = response.data;

                }
            });
        }
    };

    $scope.print = function () {
        var table = document.getElementById('test').innerHTML;
        var myWindow = $window.open('', '', 'width=800, height=600');
        myWindow.document.write(table);
        myWindow.print();
    }

    $scope.$on('$viewContentLoaded', function () {
        $scope.$watch('target', function (newVal, oldVal) {

            //Force angular not to fire script on load
            if (newVal != oldVal) {

                //Force script to run AFTER ng-repeat has rendered its things to the DOM
                $timeout(function () {

                    //And finally setTimout to wait for browser to render the custom fonts for print preview
                    setTimeout(function () {

                        //Print document
                        $scope.print();
                        //window.close();
                    }, 100);
                }, 0);
            }
        }, true);
    });
    filterData();
}]);




