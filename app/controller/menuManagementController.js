ngControllers.controller('menuManagementController', [
'$scope', '$state','authService',
'authorizeService', 'userService',
function ($scope, $state, authService,
    authorizeService, userService) {
    $scope.logOut = function () {
        authService.logOut();
        $state.go('login');
    }
    $scope.authPoint = authService.authentication;
}
]);