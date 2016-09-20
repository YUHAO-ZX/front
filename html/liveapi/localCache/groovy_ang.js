var app = angular.module('myApp', []);
app.controller('AppCtrl', function($scope) {
    var list1 = [{"scriptId":"ttt1","scriptName":"name1"},{"scriptId":"ttt2","scriptName":"name2"}];
    var list2 = [{"scriptId":"ttt1","scriptName":"name1"},{"scriptId":"ttt2","scriptName":"name2"},{"scriptId":"ttt3","scriptName":"name3"}];
    $scope.scripList = list1;
    $scope.selectScript = function(scriptId){
        $scope.codeArea = scriptId;
    }
    $scope.change1 = function(){
        alert("change");
        $scope.scripList = list2;
    }
});