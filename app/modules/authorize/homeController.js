authorizeModule.controller('homeController', ['$scope', '$location', 'userService2', 'accountService2', 'localStorageService', '$rootScope', function ($scope, $location, userService2, accountService2, localStorageService, $rootScope) {

    function loadData() {
        if (!userService2.GetCurrentUser()) {
            $location.path('/login');
        }
    }

    loadData();
    $scope.logOut = function () {
        console.log("LOGOUT");
        logout();
    }
    function logout() {
        accountService2.logout();
    }
}]);