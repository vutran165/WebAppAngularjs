nvModule.factory('thanhKhoanService',
    ['$resource', '$http', '$window', 'configService', 'clientService',
  function ($resource, $http, $window, configService, clientService) {
      var rootUrl = configService.apiServiceBaseUri;
      this.parameterPrint = {};
      function getParameterPrint() {
          return this.parameterPrint;
      }
      var serviceUrl = rootUrl + '/api/Nv/ThanhKhoan';

      var calc = {
          sum: function (obj, name) {
              var total = 0
              if (obj && obj.length > 0) {
                  angular.forEach(obj, function (v, k) {
                      var increase = v[name];
                      if (!increase) {
                          increase = 0;
                      }
                      total += increase;
                  });
              }
              return total;
          },
          sumVat: function (tyGia, target) {
              var tienVat = 0;
              if (tyGia) {
                  tienVat = (target.thanhTienTruocVatSauCK * tyGia) / 100;
              }
              return tienVat;
          },
          changeChietKhau: function (target) {
              if (!target.thanhTienTruocVat) {
                  target.thanhTienTruocVat = 0;
              }
              if (!target.chietKhau) {
                  target.chietKhau = 0;
              }
              target.tienChietKhau = (target.thanhTienTruocVat * target.chietKhau) / 100;
          },
          changeTienChietKhau: function (target) {
              target.chietKhau = 100 * (target.tienChietKhau / target.thanhTienTruocVat);
          },
          changeSoLuongBao: function (item) {
              if (!item.soLuongLe) {
                  item.soLuongLe = 0;
              }
              if (!item.maBaoBi) {
                  item.luongBao = 1;
              }
              if (!item.soLuong) {
                  item.soLuong = 0;
              }
              if (!item.giamGia) {
                  item.giamGia = 0;
              }
              if (!item.donGia) {
                  item.donGia = 0;
              }
              item.soLuong = item.soLuongBao * item.luongBao + item.soLuongLe;
              item.tienTruocGiamGia = item.soLuong * item.donGia;
              item.tienGiamGia = item.soLuong * item.giamGia;
              item.thanhTien = item.soLuong * item.donGia - item.tienGiamGia;
          },
          changeSoLuongLe: function (item) {
              if (!item.soLuong) {
                  item.soLuong = 0;
              }
              if (!item.donGia) {
                  item.donGia = 0;
              }
              if (!item.maBaoBi) {
                  item.luongBao = 1;
              }
              if (!item.soLuongBao) {
                  item.soLuongBao = 0;
              }
              if (!item.giamGia) {
                  item.giamGia = 0;
              }
              item.soLuong = item.soLuongBao * item.luongBao + item.soLuongLe;
              item.tienTruocGiamGia = item.soLuong * item.donGia;
              item.tienGiamGia = item.soLuong * item.giamGia;
              item.thanhTien = item.soLuong * item.donGia - item.tienGiamGia;
          },
          changeDonGia: function (item) {
              if (!item.soLuong) {
                  item.soLuong = 0;
              }
              if (!item.giamGia) {
                  item.giamGia = 0;
              }
              item.tienTruocGiamGia = item.soLuong * item.donGia;
              item.tienGiamGia = item.soLuong * item.giamGia;
              item.thanhTien = item.soLuong * item.donGia - item.tienGiamGia;
          },
          changeGiamGia: function (item) {
              if (!item.soLuong) {
                  item.soLuong = 0;
              }
              if (!item.donGia) {
                  item.donGia = 0;
              }
              item.tienGiamGia = item.soLuong * item.giamGia;
              item.thanhTien = item.soLuong * item.donGia - item.tienGiamGia;
          }

      }

      var result = {
          robot: calc,
          setParameterPrint: function (data) {
              parameterPrint = data;
          },
          getParameterPrint: function () {
              return parameterPrint;
          },
          post: function (data, callback) {
              $http.post(serviceUrl + '/Post', data).success(callback);
          },
          postQuery: function (data, callback) {
              $http.post(serviceUrl + '/PostQuery', data).success(callback);
          },
          postQueryDaThanhKhoan: function (data, callback) {
              $http.post(serviceUrl + '/PostQueryDaThanhKhoan', data).success(callback);
          },

          postPrint: function (callback) {
              $http.post(serviceUrl + '/PostPrint', getParameterPrint()).success(callback);
          },
          postPrintDetail: function (callback) {
              $http.post(serviceUrl + '/PostPrintDetail', getParameterPrint()).success(callback);
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
          getSelectDataType: function (type, callback) {
              $http.get(rootUrl + '/api/Md/TypeReason/GetSelectDataType/' + type).success(callback);
          },
          getCustomer: function (id, callback) {
              $http.get(rootUrl + '/api/Md/Customer/' + id).success(callback);
          },
          postApproval: function (id, callback) {
              $http.post(serviceUrl + '/PostApproval', id).success(callback);
          },
          update: function (params) {
              return $http.put(serviceUrl + '/' + params.id, params);
          },
          getMerchandiseForNvByCode: function (code) {
              return $http.get(rootUrl + '/api/Md/Merchandise/GetForNvByCode/' + code);
          },
          deleteItem: function (params) {
              return $http.delete(serviceUrl + '/' + params.id, params);
          },
          postLiquidity: function (id, callback) {
              $http.post(serviceUrl + '/PostLiquidity', id).success(callback);
          },
          postSynchronize: function (data, callback) {
              $http.post(serviceUrl + '/PostSynchronize', data).success(callback);
          },
          postUpdateQuantity: function (id, callback) {
              $http.post(serviceUrl + '/PostUpdateQuantity', id).success(callback);
          },
          postInsertData: function (data, callback) {
              $http.post(serviceUrl + '/PostInsertData', data).success(callback);
          },
          postListDataTK: function (data, callback) {
              $http.post(serviceUrl + '/PostListDataTK', data).success(callback);
          },
          postSynchronizeData: function (data, callback) {
              $http.post(serviceUrl + '/PostSynchronizeData', data).success(callback);
          },
          postReportLiquited: function (data, callback) {
              $http.post(serviceUrl + '/PostReportLiquited', data).success(callback);
          },
      };
      return result;
  }]);

nvModule.controller('thanhKhoanController', [
'$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
'thanhKhoanService', 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', 'serviceXuatKhacAndMerchandise', '$mdDialog', 'authorizeService',
function (
    $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
thanhKhoanService, configService, clientService, nvService, mdService, blockUI, serviceXuatKhacAndMerchandise, $mdDialog, authorizeService
    ) {
    $scope.config = nvService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.paged1 = angular.copy(configService.pageDefault);
    $scope.paged2 = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.permission = authorizeService.permissionModel.permission;
    $scope.tempData = mdService.tempData;

    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.setPage1 = function (pageNo) {
        $scope.paged1.currentPage = pageNo;
        filterData1();
    };
    $scope.setPage2 = function (pageNo) {
        $scope.paged2.currentPage = pageNo;
        filterData2();
    };
    $scope.sortType = 'maChungTu'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.doSearch = function () {
        $scope.filtered.isAdvance = true;
        $scope.paged1.currentPage = 1
        $scope.paged2.currentPage = 1;
        filterData1();
        filterData2();
    };

    $scope.pageChanged = function () {
        filterData();
    };
    $scope.pageChanged1 = function () {
        filterData1();
    };
    $scope.pageChanged2 = function () {
        filterData2();
    };
    $scope.sum = function () {
        var total = 0;
        if ($scope.data) {
            angular.forEach($scope.data, function (v, k) {
                total = total + v.thanhTienSauVat;
            })
        }
        return total;
    };
    $scope.print = function () {
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        thanhKhoanService.setParameterPrint(
            postdata);
        $state.go("nvPrintthanhKhoan");
    }
    $scope.printDetail = function () {
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        thanhKhoanService.setParameterPrint(
            postdata);
        $state.go("nvPrintDetailthanhKhoan");
    }
    $scope.goHome = function () {
        $state.go('home');
    };
    $scope.refresh = function () {
        $scope.setPage($scope.paged.currentPage);
        $scope.setPage1($scope.paged1.currentPage);
        $scope.setPage2($scope.paged2.currentPage);
    };
    $scope.title = function () {
        return 'Thanh khoản';
    };
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return " ";
    }
    $scope.formatLabel = function (model, module, displayModel) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            displayModel = data[0].text;
            return data[0].text;
        }
        return "Empty!";
    };
    $scope.create = function () {

        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('thanhKhoan', 'add'),
            controller: 'thanhKhoanCreateController',
            windowClass: 'app-modal-window',
            resolve: {}

        });

        modalInstance.result.then(function (updatedData) {
            serviceXuatKhacAndMerchandise.getSelectData().clear();
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.liquidity = function (ev, item) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Cảnh báo')
              .textContent('Bạn có muốn thanh khoản tờ khai này không?')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Ok')
              .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            thanhKhoanService.postLiquidity(item, function (data) {
                console.log(data);
                $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Thông báo')
                .textContent('Thanh khoản thành công')
                .ariaLabel('Alert')
                .ok('Ok')
                .targetEvent(ev))
                    .finally(function () {
                        filterData1();
                        filterData2();
                    });
            });
        }, function () {
            console.log('Không thanh khoản');
        });
    };
    $scope.synchronize = function (data) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('thanhKhoan', 'selectDataSynchronize'),
            controller: 'thanhKhoanSynchronizeController',
            windowClass: 'thanhkhoan-modal-window',
            resolve: {
                targetData: function () {
                    return data;
                }
            }
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
            templateUrl: nvService.buildUrl('thanhKhoan', 'update'),
            controller: 'thanhKhoanEditController',
            windowClass: 'app-modal-window',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });

        modalInstance.result.then(function (updatedData) {
            serviceXuatKhacAndMerchandise.getSelectData().clear();
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.details = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('thanhKhoan', 'details'),
            controller: 'thanhKhoanDetailsController',
            windowClass: 'thanhkhoan-modal-window',
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
    $scope.updateQuantity = function (item) {
        thanhKhoanService.postUpdateQuantity(item, function(response) {
            if (response.status) {
                filterData1();
                filterData2();
                clientService.noticeAlert("Thành công", "success");
                $uibModalInstance.close($scope.target);
            } else {
                clientService.noticeAlert(response.message, "danger");
            }
        });
    };

    filterData1();
    filterData2();
    function filterData() {
        $scope.isLoading = true;
        var postdata = { paged: $scope.paged1, filtered: $scope.filtered };
        thanhKhoanService.postQuery(
            JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    $scope.data = response.data.data;
                    angular.extend($scope.paged1, response.data);
                    console.log($scope.paged);
                }
            });
    };
    function filterData1() {
        $scope.isLoading = true;
        var postdata = { paged: $scope.paged1, filtered: $scope.filtered };
        thanhKhoanService.postQuery(
            JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    $scope.data = response.data.data;
                    angular.extend($scope.paged1, response.data);
                    console.log($scope.paged1);
                }
            });
    };
    function filterData2() {
        $scope.isLoading = true;
        var postdata = { paged: $scope.paged2, filtered: $scope.filtered };
        thanhKhoanService.postQueryDaThanhKhoan(
            JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    $scope.data2 = response.data.data;
                    angular.extend($scope.paged2, response.data);
                    console.log($scope.paged2);
                }
            });
    };

}])
nvModule.controller('thanhKhoanSynchronizeController', [
'$scope', '$uibModalInstance',
'mdService', 'thanhKhoanService', 'targetData', 'clientService', '$filter', 'configService',
function ($scope, $uibModalInstance,
    mdService, thanhKhoanService, targetData, clientService, $filter, configService) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.paged1 = angular.copy(configService.pageDefault);
    $scope.paged2 = angular.copy(configService.pageDefault);
    $scope.target = targetData;
    console.log($scope.target);
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Danh sách tờ khai đồng bộ';
    };
    fillterData();
    $scope.dataInput = [];
    $scope.data2 = [];
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };
    $scope.synchronize = function () {
        $scope.isLoading = true;
        thanhKhoanService.postListDataTK($scope.dataInput, function (response) {
            console.log(response);
            $scope.isLoading = false;
            if (response.status) {
                $scope.data = response.data;
            }
            $scope.pageChanged();
        });
    };
    $scope.updateData = function () {
        $scope.isLoading = true;
        if ($scope.dataInput == null) {
            clientService.noticeAlert("Không có dữ liệu", "danger");
        }
        else {
            thanhKhoanService.postSynchronizeData($scope.data, function (response) {
                console.log(response);
                $scope.isLoading = false;
                if (response.status) {
                    clientService.noticeAlert("Thành công", "success");
                    $scope.data2 = response.data;
                    $scope.pageChanged2();

                } else {
                    clientService.noticeAlert(response.message, "danger");
                }
            });
        }
    };
    $scope.save = function () {
        $scope.isLoading = true;
        if ($scope.dataInput == null) {
            clientService.noticeAlert("Không có dữ liệu", "danger");
        }
        else {
            thanhKhoanService.postInsertData($scope.data2, function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    clientService.noticeAlert("Thành công", "success");
                    $scope.data2 = response.data;
                    $uibModalInstance.close($scope.target);
                } else {
                    clientService.noticeAlert(response.message, "danger");
                }
            });
        }
    };
    function fillterData() {
        thanhKhoanService.getNewInstance(function (response) {
            $scope.dataInput = response;
        });

    }
    $scope.pageChanged = function () {
        var currentPage = $scope.paged1.currentPage;
        var itemsPerPage = $scope.paged1.itemsPerPage;
        $scope.paged1.totalItems = $scope.data.length;
        console.log($scope.data.length);
        $scope.data1 = [];
        if ($scope.data) {
            for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < $scope.data.length; i++) {
                $scope.data1.push($scope.data[i])
            }
        }
    }
    $scope.pageChanged2 = function () {
        var currentPage = $scope.paged2.currentPage;
        var itemsPerPage = $scope.paged2.itemsPerPage;
        $scope.paged2.totalItems = $scope.data2.length;
        $scope.data22 = [];
        if ($scope.data2) {
            for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < $scope.data2.length; i++) {
                $scope.data22.push($scope.data2[i]);
            }
        }
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);
nvModule.controller('thanhKhoanDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'thanhKhoanService', 'targetData', 'clientService', '$filter', 'configService',
function ($scope, $uibModalInstance,
    mdService, thanhKhoanService, targetData, clientService, $filter, configService) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Thanh khoản';
    };
    fillterData();
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };

    $scope.liquited = function () {
        thanhKhoanService.postLiquidity($scope.target, function (response) {
            if (response.status) {
                clientService.noticeAlert("Thành công", "success");
                $uibModalInstance.close($scope.target);
            }
            else {
                clientService.noticeAlert(response.message, "danger");
            }
        });
    };

    function fillterData() {
        $scope.isLoading = true;
        thanhKhoanService.getDetails($scope.target.id, function (response) {
            if (response.status) {
                $scope.target = response.data;
            }
            $scope.isLoading = false;
            $scope.pageChanged();
        });
    }
    $scope.pageChanged = function () {
        var currentPage = $scope.paged.currentPage;
        var itemsPerPage = $scope.paged.itemsPerPage;
        $scope.paged.totalItems = $scope.target.dataDetails.length;
        $scope.data = [];
        if ($scope.target.dataDetails) {
            for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < $scope.target.dataDetails.length; i++) {
                $scope.data.push($scope.target.dataDetails[i])
            }
        }
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);
nvModule.controller('indexReportThanhKhoanController', [
    '$scope', '$rootScope', '$window', '$stateParams', '$timeout', '$sce', '$state', '$uibModal', '$log',
    'mdService', 'thanhKhoanService', 'clientService', 'configService', '$filter', 'serviceThanhKhoanAndDonViHaiQuan', 'serviceThanhKhoanAndCompany', 'tinhHinhKinhDoanhService',
    function ($scope, $rootScope, $window, $stateParams, $timeout, $sce, $state, $uibModal, $log,
        mdService, thanhKhoanService, clientService, configService, $filter, serviceThanhKhoanAndDonViHaiQuan, serviceThanhKhoanAndCompany, tinhHinhKinhDoanhService) {
        $scope.tempData = mdService.tempData;
        $scope.robot = angular.copy(thanhKhoanService.robot);
        $scope.config = configService;
        $scope.target = {};
        $scope.tagWareHouses = [];
        $scope.tagMerchandiseTypes = [];
        $scope.tagMerchandises = [];
        $scope.tagMerchandiseGroups = [];
        $scope.tagUnitUsers = [];

        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.validButton = function () {
            if ($scope.target.companyCodes == null || $scope.target.companyCodes == "") {
                return false;
            }
            else {
                return false;
            }
        }

        //Nhóm hàng
        //$scope.selectCompany = function () {
        //    var modalInstance = $uibModal.open({
        //        backdrop: 'static',
        //        templateUrl: mdService.buildUrl('mdCompany', 'selectData'),
        //        controller: 'companySelectDataController',
        //        resolve: {
        //            serviceSelectData: function () {
        //                return serviceThanhKhoanAndCompany;
        //            },
        //            filterObject: function () {
        //                return {

        //                }
        //            }
        //        }
        //    });
        //    modalInstance.result.then(function (updatedData) {
        //        console.log(updatedData);
        //    }, function () {
        //        $log.info('Modal dismissed at: ' + new Date());
        //    });
        //}
        $scope.selectCompany = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdCompany', 'selectData'),
                controller: 'companySelectDataController',
                resolve: {
                    selectedDoanhNghiep: function () {
                        return $scope.tagCompanies;
                    },
                    selectedHaiQuan: function () {
                        return $scope.filtered.advanceData;
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {
                console.log(updatedData);
                $scope.tagCompanies = updatedData;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.onChangeMaHaiQuan = function (mahq) {
            if (mahq) {
                mahq = mahq.toUpperCase();
                var data = $filter('filter')(mdService.tempData.donViHaiQuans, { value: mahq }, true);
                if (data && data.length > 0) {
                    $scope.filtered.advanceData.maHaiQuan = data[0].value;
                    $scope.filtered.advanceData.idHaiQuan = data[0].id;
                    $scope.target.donViHaiQuanCodes = data[0].id;
                    //$scope.lstDoanhnghiep = $scope.tempData.companiesByHQ.filter(function (dn) {
                    //    return (dn.referenceDataId.indexOf($scope.filtered.advanceData.idHaiQuan) === 0);
                    //});
                }
            }
        };

        $scope.selectDonViHaiQuan = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdDonViHaiQuan', 'selectData'),
                controller: 'donViHaiQuanSelectDataController',
                resolve: {
                    serviceSelectData: function () {
                        return serviceThanhKhoanAndDonViHaiQuan;
                    },
                    filterObject: function () {
                        return {

                        }
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
        $scope.removeCompany = function (index) {
            $scope.tagCompanies.splice(index, 1);
            $scope.validButton();
        }
        $scope.removeDonViHaiQuan = function (index) {
            $scope.tagDonViHaiQuans.splice(index, 1);
        }
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (code) {
                if (data.length == 1) {
                    $scope.target.tenDoanhNghiep = data[0].text;
                    return $scope.target.tenDoanhNghiep;
                }
            }
            else {
                $scope.target.tenDoanhNghiep = null;
            }
            return "Empty!";
        };

        $scope.$watch('tagCompanies', function (newValue, oldValue) {
            var values = $scope.tagCompanies.map(function (element) {
                return element.id;
            });
            $scope.target.companyCodes = values.join();
            $scope.validButton();


        }, true);
        $scope.$watch('tagDonViHaiQuans', function (newValue, oldValue) {
            var values = $scope.tagDonViHaiQuans.map(function (element) {
                return element.id;
            });
            $scope.target.donViHaiQuanCodes = values.join();

        }, true);
        $rootScope.$on('$locationChangeStart',
            function (event, next, current) {
                $scope.tagWareHouses.clear();
                $scope.tagMerchandiseTypes.clear();
                $scope.tagMerchandises.clear();
                $scope.tagMerchandiseGroups.clear();
                $scope.tagCompanies.clear();
                $scope.tagDonViHaiQuans.clear();
                $scope.tagUnitUsers.clear();
            });

        function filterData() {
            $scope.tagCompanies = serviceThanhKhoanAndCompany.getSelectData();
            $scope.tagDonViHaiQuans = serviceThanhKhoanAndDonViHaiQuan.getSelectData();

            thanhKhoanService.getNewInstance(function (response) {
                $scope.data = response;
                $scope.target.fromDate = $scope.data.fromDate;
                $scope.target.toDate = $scope.data.toDate;
            });
        }

        filterData();
        $scope.report = function () {
            if ($scope.target.donViHaiQuanCodes == "") {
                $scope.target.donViHaiQuanCodes = $scope.data.maHaiQuan;
            }
            //tinhHinhKinhDoanhService.getReport($scope.target);
            $state.go('reportThanhKhoan', { obj: $scope.target });
        }
        $scope.printExcel = function () {
            tinhHinhKinhDoanhService.postExportExcel($scope.target, "BaoCaoTinhHinhKinhDoanh");
        }
    }
]);
nvModule.controller('reportThanhKhoanController', [
    '$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'thanhKhoanService', 'mdService', 'clientService',
    function($scope, $window, $stateParams, $timeout, $state,
        nvService, thanhKhoanService, mdService, clientService) {
        var para = $state.params.obj;
        console.log(para);
        $scope.robot = angular.copy(thanhKhoanService.robot);
        $scope.tempData = mdService.tempData;
        $scope.target = [];
        $scope.goIndex = function() {
            $state.go('indexReportThanhKhoan');
        }
        $scope.target.data = [];

        function filterData() {
            $scope.title = "Báo cáo thanh khoản";
            if (para) {
                thanhKhoanService.postReportLiquited(para, function(response) {
                    $scope.target = response.data;
                });
            }
        };

        $scope.print = function() {
            var table = document.getElementById('main-report').innerHTML;
            var myWindow = $window.open('', '', 'width=800, height=600');
            myWindow.document.write(table);
            myWindow.print();
        }

        filterData();
    }
]);

