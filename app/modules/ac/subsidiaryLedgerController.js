acModule.factory('subsidiaryLedgerService', ['$resource', '$http', '$window', 'configService',
function ($resource, $http, $window, configService) {
    var rootUrl = configService.rootUrlWeb;
    var serviceUrl = rootUrl + '/_vti_bin/Apps/AC/ACService.svc';
    var result = {
        postReport: function (filter, callback) {
            $http.post(serviceUrl + '/SubsidiaryLedgerReport', filter).success(callback);
        },
        getReport: function()
        {
            return $http.get(serviceUrl + '/DownloadPDF', { responseType: "arraybuffer" });
        }
    }
    return result;
}])


acModule.controller('subsidiaryLedgerController', ['$scope', '$window', '$stateParams', '$timeout', '$sce',
'mdService', 'subsidiaryLedgerService', 'clientService', '$filter',
function ($scope, $window, $stateParams, $timeout, $sce,
mdService, subsidiaryLedgerService, clientService, $filter) {
    $scope.tempData = mdService.tempData;
    $scope.target = {};
    $scope.data = {};

    //begin pdfmake
    function buildTableBody(data) {
        var body = [];
        header = 					[
						{text: 'SỐ CT', alignment:'center', id:'soCT'},
						{text: 'NGÀY' , alignment:'center', id:'ngayCT'},
						{text: 'NỘI DUNG', alignment:'center',id: 'NOIDUNG'},
						{text: 'TK ĐỐI', alignment:'center', id:'TAIKHOANDOI'},
						{text: 'NỢ', alignment:'center', id:'NO'},
						{text: 'CÓ', alignment:'center', id:'CO'}
        ];
        body.push(header);

        var subHeader = [{ text: 'SỐ DƯ ĐẦU KỲ', colSpan: 4 }, '', '', '', '', ''];
        body.push(subHeader);
        angular.forEach(data, function (v, k) {
            var strTitleSo = v.soTaiKhoan != null ? v.soTaiKhoan.toString() : "";
            var strTitleTen = v.tenTaiKhoan != null ? v.tenTaiKhoan.toString() : "";
            var soDuDauKy = 'SỐ DƯ ĐẦU KỲ - ' + strTitleSo;
            var title = [{ text: strTitleSo + " - " + strTitleTen, colSpan: 4 }, '', '', '', '', ''];
            var notice = [{ text: soDuDauKy, colSpan: 4 },
                '', '', '',
                { text: v.DuNoDauKy != null ? $filter('number')(v.DuNoDauKy) : "", alignment: 'right' }, { text: v.DuCoDauKy != null ? $filter('number')(v.DuCoDauKy) : "", alignment: 'right' }];
            body.push(title);
            body.push(notice);
            angular.forEach(v.Details, function (vd, kd) {
                var detail = [{ text: vd.SOCT != null ? vd.SOCT.toString() : "", alignment: 'center' },
                    { text: vd.ngayCT != null ? vd.ngayCT.toString() : "", alignment: 'center' },
                    { text: vd.noiDung != null ? vd.noiDung.toString() : "" },
                    { text: vd.taiKHOANDOI != null ? vd.taiKHOANDOI.toString() : "", alignment: 'center' },
                    { text: vd.NO != null ? $filter('number')(vd.NO) : "", alignment: 'right' },
                    { text: vd.CO != null ? $filter('number')(vd.CO) : "", alignment: 'right' }];
                body.push(detail);
            });
        });
        return body;
    }

    $scope.pdfMaker = function () {
        var convertData = clientService.convertToDateNumber($scope.target, ["TuNgay", "DenNgay"]);
        subsidiaryLedgerService.postReport(
            convertData, function (response) {
                $scope.data = response;
                var dd = {
                    pageSize: 'A4',
                    pageOrientation: 'landscape',
                    pageMargins: [
                        20,
                        50,
                        20,
                        45
                    ],
                    content: [
                        {
                            text: 'Địa chỉ: '
                        },
                        {
                            text: 'Mã số thuế: '
                        },
                        {
                            text: 'Sổ chi tiết kế toán',
                            fontSize: 20,
                            alignment: 'center'
                        },
                        {
                            text: $scope.data.soTaiKhoan + ' - ' + $scope.data.tenTaiKhoan,
                            alignment: 'center'
                        },
                        {
                            text: 'Tháng ' + $scope.data.ThangBC + ' Năm ' + $scope.data.NamBC,
                            alignment: 'center',
                            margin: [
                                10,
                                10,
                                10,
                                10
                            ]
                        },
                        {
                            table: {
                                widths: [
                                    '*',
                                    '*',
                                    250,
                                    '*',
                                    '*',
                                    '*',
                                ],
                                body: buildTableBody($scope.data.Data)
                            }
                        },
				{
				    table: {
				        widths: [
                                    '*',
                                    300,
                                    '*',
				        ],
				        body: [
                                [{
                                    text: 'Người lập', alignment: 'center', margin: [
                                    20,
                                    20,
                                    20,
                                    20
                                    ]
                                }, {
                                    text: 'Kế toán trưởng', alignment: 'center', margin: [
                                    20,
                                    20,
                                    20,
                                    20
                                    ]
                                }, {
                                    text: 'Giám đốc', alignment: 'center', margin: [
                                    20,
                                    20,
                                    20,
                                    20
                                    ]
                                }],
				        ]
				    },
				    layout: 'noBorders'
				}
                    ],
                }
                pdfMake.createPdf(dd).open("hello");
            })
    }

    //end pdfmake

    //$scope.btnPrint = function () {
    //    filterData();
    //}

    //$scope.print = function () {

    //    var table = document.getElementById('tmpReport').innerHTML;
    //    var myWindow = $window.open('', '', 'width=800, height=600');
    //    myWindow.document.write(table);
    //    myWindow.print();
    //}
    //$scope.pdf = function () {
    //    subsidiaryLedgerService.getReport().then(function (response) {
            
    //        var blob = new Blob([response.data], { type: "application/pdf" });
    //        var objectUrl = URL.createObjectURL(blob);
    //        $scope.content = $sce.trustAsResourceUrl(objectUrl);
    //    })
    //}
    //$scope.$on('$viewContentLoaded', function () {
    //    $scope.$watch('data', function (newVal, oldVal) {

    //        //Force angular not to fire script on load
    //        if (newVal != oldVal) {

    //            //Force script to run AFTER ng-repeat has rendered its things to the DOM
    //            $timeout(function () {

    //                //And finally setTimout to wait for browser to render the custom fonts for print preview
    //                setTimeout(function () {

    //                    //Print document
    //                    $scope.print();
    //                    //window.close();
    //                }, 100);
    //            }, 0);
    //        }
    //    }, true);
    //});

}])