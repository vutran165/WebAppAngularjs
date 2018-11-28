var changePasswordController = authorizeModule.controller('changePasswordController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$timeout', '$mdDialog', '$state', 'authService',
'authorizeService', 'configService', 'userService', 'blockUI', 'clientService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $timeout, $mdDialog, $state, authService,
authorizeService, configService, userService, blockUI, clientService) {
    $scope.config = authorizeService.config;
    $scope.tempData = authorizeService.tempData;
    $scope.target = {};
    $scope.pass = {};
    $scope.result = false;
    $scope.newPass = false;
    var infoUnit = $rootScope.currentUser;
    $scope.title = function () {
        return 'Đổi mật khẩu tài khoản ' + '[' + infoUnit.username + ']';
    };
    $scope.target.username = infoUnit.username;
    $('#oldFocus').focus();

    $scope.certi = function (input) {
        if (input === '' || /\s/g.test(input) != 0) {
            console.log('err');
        }
        else {
            $scope.target.password = input;
            userService.getAccountByUserName($scope.target, function (response) {
                $scope.result = response;
                $scope.newPass = $scope.result;
                if ($scope.result) {
                    $('#newFocus').focus();
                }
            });
        }

    }
    $scope.cancel = function () {
        $state.go('home');
    };

    $scope.save = function () {
        $scope.target.password = $scope.target.newPassword;
        userService.changePassword($scope.target,
			function (response) {
			    //Fix
			    if (response.status) {
			        console.log('Create  Successfully!');
			        clientService.noticeAlert("Thành công", "success");
			        $scope.target.password = '';
			        $scope.target.newPassword = '';
			        alert('Hệ thống sẽ tự động đăng xuất !');
			        setTimeout(function () {
			            authService.logOut();
			            $state.go('login');
			            $scope.authPoint = authService.authentication;
			        }, 3000);
			    } else {
			        clientService.noticeAlert(response.message, "danger");
			    }
			    //End fix
			});

    };
}]);
