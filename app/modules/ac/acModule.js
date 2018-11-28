var acModule = angular.module('acModule', ['ui.bootstrap', 'ngFilters', 'ngServices', 'ngResource', 'blockUI', 'xeditable']);
acModule.config(['$windowProvider', '$stateProvider', '$httpProvider', '$urlRouterProvider', '$routeProvider', '$locationProvider',
    function ($windowProvider, $stateProvider, $httpProvider, $urlRouterProvider, $routeProvider, $locationProvider) {
        var window = $windowProvider.$get('$window');

        var hostname = window.location.hostname;
        var port = window.location.port;
        var rootUrl = 'http://' + hostname + ':' + port;
        $stateProvider
        .state('generalJournal', {
            url: '/ac/generalJournal',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/GeneralJournal/index.html',
            controller: 'generalJournalController'
        })
        .state('subsidiaryLedger', {
            url: '/ac/subsidiaryLedger',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/SubsidiaryLedger/index.html',
            controller: 'subsidiaryLedgerController'
        })
        .state('controlAccounts', {
            url: '/ac/controlAccounts',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/ControlAccounts/index.html',
            controller: 'controlAccountsController'
        })
        .state('cashBook', {
            url: '/ac/cashBook',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/CashBook/index.html',
            controller: 'cashBookController'
        })
        .state('closeout', {
            url: '/ac/closeout',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Closeout/index.html',
            controller: 'closeoutController'
        })
       // .state('xntTheoToKhai', {
       //     url: '/ac/xntTheoToKhai',
       //     templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/XNT/index-report-tokhai.html',
       //     controller: 'xntTheoToKhaiController'
       // })
       //.state('xntReportTheoToKhai', {
       //    url: '/ac/xnt/xntReportTheoToKhai',
       //    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/XNT/report-tokhai.html',
       //    controller: 'xntReportTheoToKhaiController',
       //    params: {
       //        obj: null
       //    }

       //})
        .state('inventory', {
            url: '/ac/xnt',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/XNT/index.html',
            controller: 'xntController'
        })
       .state('reportKinhDoanhHangMienThue', {
           url: '/ac/xnt/reportKinhDoanhHangMienThue',
           templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/XNT/report.html',
           controller: 'reportKinhDoanhHangMienThueController',
           params: {
               obj: null
           }

       })
        .state('inventoryReport', {
            url: '/ac/inventoryReport',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Inventory/report.html',
            controller: 'reportInventoryController',
            params: {
                obj: null
            }
        })
        .state('inventoryReportItem', {
            url: '/ac/inventoryReportItem',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Inventory/report-inventory-item.html',
            controller: 'reportInventoryItemController',
            params: {
                obj: null
            }
        })
        .state('inventoryByDeclaration', {
            url: '/ac/inventoryByDeclaration',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Inventory/index-by-declaration.html',
            controller: 'inventoryByDeclarationController'

        })
        .state('inventoryReportDeclaration', {
            url: '/ac/inventoryReportDeclaration',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Inventory/report-inventory-declaration.html',
            controller: 'reportInventoryByDeclarationController',
            params: {
                obj: null
            }
        })
            .state('inventoryReportDeclarationDetails', {
                url: '/ac/inventoryReportDeclarationDetails',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Inventory/report-inventory-declaration-details.html',
                controller: 'reportInventoryByDeclarationDetailsController',
                params: {
                    obj: null
                }
            })

        .state('inventoryReportByDay', {
            url: '/ac/inventoryReportByDay',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Inventory/report.html',
            controller: 'reportInventoryByDayController',
            params: {
                obj: null
            }
        })

                //THE INVENTORY REPORTS ARE SENDED BY COMPANY
             .state('inventorySendedByCompany', {
                 url: '/ac/inventorySendedByCompany',
                 templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Inventory/index-by-company.html',
                 controller: 'inventorySendedByCompanyController'
             })
          .state('inventoryReportSendedByCompany', {
              url: '/ac/inventoryReportSendedByCompany',
              templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Inventory/report-inventory-company.html',
              controller: 'reportInventoryReporSendedtByCompany',
              params: {
                  obj: null
              }
          })
             .state('inventoryReportSendedByCompanyComparision', {
                 url: '/ac/inventoryReportSendedByCompanyComparision',
                 templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Inventory/report-inventory-company-comparision.html',
                 controller: 'reportInventoryReporSendedtByCompanyComparision',
                 params: {
                     obj: null
                 }
             })
            //END
            .state('inventoryByPhieuNX', {
                url: '/ac/inventoryByPhieuNX',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/XNT/index-report-nx.html',
                controller: 'inventoryByPhieuNXController'
            })
                .state('inventoryReportByPhieuNX', {
                    url: '/ac/inventoryReportByPhieuNX',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/XNT/reportPhieuNXCTMAHS.html',
                    controller: 'reportInventoryByPhieuNXController',
                    params: {
                        obj: null
                    }
                })
                    .state('inventoryReportByPhieuNXChiTiet', {
                        url: '/ac/inventoryReportByPhieuNXChiTiet',
                        templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/XNT/reportPhieuNXChiTietHS.html',
                        controller: 'reportInventoryByPhieuNXChiTietController',
                        params: {
                            obj: null
                        }
                    })

            .state('inventoryReporTotaltByCompany', {
                url: '/ac/inventoryReporTotaltByCompany',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/XNT/reportTotal.html',
                controller: 'reportInventoryTotalByCompanyController',
                params: {
                    obj: null
                }
            })
        .state('cashier', {
            url: '/ac/cashier',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Cashier/index.html',
            controller: 'cashierController'
        })
        .state('cashierReport', {
            url: '/ac/cashierReport',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Cashier/report.html',
            controller: 'reportCashierController',
            params: {
                obj: null
            }
        })
        .state('input', {
            url: '/ac/input',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Input/index.html',
            controller: 'inputController'
        })
        .state('hangphatsinh', {
            url: '/ac/hangphatsinh',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/HangPhatSinh/index.html',
            controller: 'hangphatsinhController'
        })
        .state('reportHangPhatSinh', {
            url: '/ac/reportHangPhatSinh',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/HangPhatSinh/report.html',
            controller: 'reportHangPhatSinhController',
            params: {
                obj: null
            }
        })
        .state('keKhaiHangHoaHetHanTamNhap', {
            url: '/ac/keKhaiHangHoaHetHanTamNhap',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/KeKhaiHangHoaHetHanTamNhap/index.html',
            controller: 'keKhaiHangHoaHetHanTamNhapController'
        })
       .state('reportKeKhaiHangHoaHetHanTamNhap', {
           url: '/ac/keKhaiHangHoaHetHanTamNhap/reportKeKhaiHangHoaHetHanTamNhap',
           templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/KeKhaiHangHoaHetHanTamNhap/report.html',
           controller: 'reportKeKhaiHangHoaHetHanTamNhapController',
           params: {
               obj: null
           }

       })
       .state('reportKeKhaiHangHoaHetHanTamNhapByCustomUnit', {
           url: '/ac/keKhaiHangHoaHetHanTamNhap/reportKeKhaiHangHoaHetHanTamNhapByCustomUnit',
           templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/KeKhaiHangHoaHetHanTamNhap/reportByCustomUnit.html',
           controller: 'reportKeKhaiHangHoaHetHanTamNhapByCustomUnitController',
           params: {
               obj: null
           }

       })
       .state('reportKeKhaiHangHoaHetHanTamNhapByCompany', {
           url: '/ac/keKhaiHangHoaHetHanTamNhap/reportKeKhaiHangHoaHetHanTamNhapByCompany',
           templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/KeKhaiHangHoaHetHanTamNhap/reportByCompany.html',
           controller: 'reportKeKhaiHangHoaHetHanTamNhapByCompanyController',
           params: {
               obj: null
           }

       })
       .state('reportKeKhaiHangHoaHetHanTamNhapByCodeHs', {
           url: '/ac/keKhaiHangHoaHetHanTamNhap/reportKeKhaiHangHoaHetHanTamNhapByCodeHs',
           templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/KeKhaiHangHoaHetHanTamNhap/reportByCodeHs.html',
           controller: 'reportKeKhaiHangHoaHetHanTamNhapByCodeHsController',
           params: {
               obj: null
           }

       })
        .state('keKhaiHangHoaHetHanTamXuat', {
            url: '/ac/keKhaiHangHoaHetHanTamXuat',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/KeKhaiHangHoaHetHanTamXuat/index.html',
            controller: 'keKhaiHangHoaHetHanTamXuatController'
        })
       .state('reportKeKhaiHangHoaHetHanTamXuat', {
           url: '/ac/keKhaiHangHoaHetHanTamXuat/reportKeKhaiHangHoaHetHanTamXuat',
           templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/KeKhaiHangHoaHetHanTamXuat/report.html',
           controller: 'reportKeKhaiHangHoaHetHanTamXuatController',
           params: {
               obj: null
           }

       })
       .state('reportKeKhaiHangHoaHetHanTamXuatByCustomUnit', {
           url: '/ac/keKhaiHangHoaHetHanTamXuat/reportKeKhaiHangHoaHetHanTamXuatByCustomUnit',
           templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/KeKhaiHangHoaHetHanTamXuat/reportByCustomUnit.html',
           controller: 'reportKeKhaiHangHoaHetHanTamXuatByCustomUnitController',
           params: {
               obj: null
           }

       })
       .state('reportKeKhaiHangHoaHetHanTamXuatByCompany', {
           url: '/ac/keKhaiHangHoaHetHanTamXuat/reportKeKhaiHangHoaHetHanTamXuatByCompany',
           templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/KeKhaiHangHoaHetHanTamXuat/reportByCompany.html',
           controller: 'reportKeKhaiHangHoaHetHanTamXuatByCompanyController',
           params: {
               obj: null
           }

       })
       .state('reportKeKhaiHangHoaHetHanTamXuatByCodeHs', {
           url: '/ac/keKhaiHangHoaHetHanTamXuat/reportKeKhaiHangHoaHetHanTamXuatByCodeHs',
           templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/KeKhaiHangHoaHetHanTamXuat/reportByCodeHs.html',
           controller: 'reportKeKhaiHangHoaHetHanTamXuatByCodeHsController',
           params: {
               obj: null
           }

       })
        .state('inputReport', {
            url: '/ac/inputReport',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Input/report.html',
            controller: 'reportInputController',
            params: {
                obj: null
            }
        }).state('reportInputByCustomUnit', {
            url: '/ac/reportByUnitCustom',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Input/reportByCustomUnit.html',
            controller: 'reportInputByCustomUnitController',
            params: {
                obj: null
            }
        })
        .state('reportInputByCompany', {
            url: '/ac/reportByCompany',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Input/reportByCompany.html',
            controller: 'reportInputByCompanyController',
            params: {
                obj: null
            }
        })
             .state('reportInputByCodeHs', {
                 url: '/ac/reportInputByCodeHs',
                 templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Input/reportByCodeHs.html',
                 controller: 'reportInputByCodeHsController',
                 params: {
                     obj: null
                 }
             })

          .state('output', {
              url: '/ac/output',
              templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Output/index.html',
              controller: 'outputController'
          })
        .state('outputReport', {
            url: '/ac/outputReport',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Output/report.html',
            controller: 'reportOutputController',
            params: {
                obj: null
            }
        })
         .state('reportOuputByCustomUnit', {
             url: '/ac/reportOuputByCustomUnit',
             templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Output/reportByCustomUnit.html',
             controller: 'reportOutputByCustomUnitController',
             params: {
                 obj: null
             }
         })
          .state('reportOutputByCompany', {
              url: '/ac/reportOutputByCompany',
              templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Output/reportByCompany.html',
              controller: 'reportOutputByCompanyController',
              params: {
                  obj: null
              }
          })
          .state('reportOutputByCodeHs', {
              url: '/ac/reportOutputByCodeHs',
              templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Output/reportByCodeHs.html',
              controller: 'reportOutputByCodeHsController',
              params: {
                  obj: null
              }
          })
          .state('testReport', {
              url: '/ac/testReport',
              templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/TestReport/userReport.html',
              controller: 'testReportController',
          })
        .state('outputToPlane', {
            url: '/ac/outputToPlane',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Output/index-to-Plane.html',
            controller: 'exportToPlaneController'
        })
        .state('reportOutputToPlane', {
            url: '/ac/reportOutputToPlane',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/Output/report-to-Plane.html',
            controller: 'reportExportToPlaneController',
            params: {
                obj: null
            }
        })

        .state('acVuotDinhMuc', {
            url: '/ac/acVuotDinhMuc',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/VuotDinhMuc/index.html',
            controller: 'acVuotDinhMucController'
        })
        .state('acVuotDinhMucReport', {
            url: '/ac/acVuotDinhMucReport',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/VuotDinhMuc/report.html',
            controller: 'reportVuotDinhMucController',
            params: {
                obj: null
            }
        })
        .state('acQuaHanToKhai', {
            url: '/ac/acQuaHanToKhai',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/QuaHanToKhai/index.html',
            controller: 'acQuaHanToKhaiController'
        })
        .state('acQuaHanToKhaiReport', {
            url: '/ac/acQuaHanToKhaiReport',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/QuaHanToKhai/report.html',
            controller: 'reportQuaHanToKhaiController',
            params: {
                obj: null
            }
        })
        .state('xuatBanKH', {
            url: '/ac/xuatBanKH',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/XuatBanKH/index.html',
            controller: 'xuatBanKHController'
        })
       .state('reportXuatBanKH', {
           url: '/ac/reportXuatBanKH',
           templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/XuatBanKH/report.html',
           controller: 'reportXuatBanKHController',
           params: {
               obj: null
           }
       })
        .state('xuatBanKHNoiThanh', {
            url: '/ac/xuatBanKHNoiThanh',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/XuatBanKHNoiThanh/index.html',
            controller: 'xuatBanKHNoiThanhController'
        })
       .state('reportXuatBanKHNoiThanh', {
           url: '/ac/reportXuatBanKHNoiThanh',
           templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/XuatBanKHNoiThanh/report.html',
           controller: 'reportXuatBanKHNoiThanhController',
           params: {
               obj: null
           }
       })
        .state('tinhHinhKinhDoanh', {
            url: '/ac/tinhHinhKinhDoanh',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/TinhHinhKinhDoanh/index.html',
            controller: 'tinhHinhKinhDoanhController'
        })
        .state('tinhHinhKinhDoanhReport', {
            url: '/ac/tinhHinhKinhDoanhReport',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/TinhHinhKinhDoanh/report.html',
            controller: 'reportTinhHinhKinhDoanhController',
            params: {
                obj: null
            }
        })
        .state('bangKeTienMatCachLy', {
            url: '/ac/bangKeTienMatCachLy',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/BangKeTienMatCachLy/index.html',
            controller: 'bangKeTienMatCachLyController'
        })
        .state('bangKeTienMatCachLyReport', {
            url: '/ac/bangKeTienMatCachLyReport',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/BangKeTienMatCachLy/report.html',
            controller: 'reportBangKeTienMatCachLyController',
            params: {
                obj: null
            }
        })
        .state('bangKeTienMatKhoLenTauBay', {
            url: '/ac/bangKeTienMatKhoLenTauBay',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/BangKeTienMatKhoLenTauBay/index.html',
            controller: 'bangKeTienMatKhoLenTauBayController'
        })
        .state('bangKeTienMatKhoLenTauBayReport', {
            url: '/ac/bangKeTienMatKhoLenTauBayReport',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/BangKeTienMatKhoLenTauBay/report.html',
            controller: 'reportBangKeTienMatKhoLenTauBayController',
            params: {
                obj: null
            }
        })
        .state('tienBanHangTrenMayBay', {
            url: '/ac/tienBanHangTrenMayBay',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/TienBanHangTrenMayBay/index.html',
            controller: 'tienBanHangTrenMayBayController'
        })
        .state('tienBanHangTrenMayBayReport', {
            url: '/ac/tienBanHangTrenMayBayReport',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/TienBanHangTrenMayBay/report.html',
            controller: 'reportTienBanHangTrenMayBayController',
            params: {
                obj: null
            }
        })
        .state('doanhNghiepKeKhaiTem', {
            url: '/ac/doanhNghiepKeKhaiTemController',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/DoanhNghiepKeKhaiTem/index.html',
            controller: 'doanhNghiepKeKhaiTemController'
        })
        .state('doanhNghiepKeKhaiTemReport', {
            url: '/ac/doanhNghiepKeKhaiTemReport',
            templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/AC/DoanhNghiepKeKhaiTem/report.html',
            controller: 'reportDoanhNghiepKeKhaiTemController',
            params: {
                obj: null
            }
        });
    }
]);


acModule.factory('acService', [
    '$resource', '$http', '$window', 'clientService', 'configService',
    function ($resource, $http, $window, clientService, configService) {
        var hostname = window.location.hostname;
        var port = window.location.port;
        var rootUrl = 'http://' + hostname + ':' + port;
        var result = {
            config: configService,
            client: clientService,
        };
        result.buildUrl = function (module, action) {
            return rootUrl + '/_layouts/15/BTS.SP.ERP/AC/' + module + '/' + action + '.html';
        };
        return result;
    }
]);
acModule.factory('serviceInventoryAndWareHouse', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);

acModule.factory('serviceInventoryAndMerchandiseType', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);
acModule.factory('serviceInventoryAndMerchandise', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);
acModule.factory('serviceInventoryAndMerchandiseGroup', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);


acModule.factory('serviceInventoryAndCompany', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);


acModule.factory('serviceSelectCompany', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);

acModule.factory('serviceInventoryAndDonViHaiQuan', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);
acModule.factory('serviceInventoryAndUnitUser', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);

acModule.factory('serviceInventoryAndDoiTuong', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);