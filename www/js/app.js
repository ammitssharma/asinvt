var apiUrl = 'http://port1217.com/inventory/webservice/';
var userInfo = {};
angular.module('ionicApp', ['ionic', 'ui.router'])

    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $ionicConfigProvider.views.maxCache(0);
        
        
        $stateProvider.state('login', {
            url: '/',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        });
		
		$stateProvider.state('add-product', {
            url: '/add-product',
            templateUrl: 'templates/add-product.html',
            controller: 'AddProductController'
        });
		
		
        
        $urlRouterProvider.otherwise('/')
    })

    .directive('myclick', function() {
        return function(scope, element, attrs) {
            element.bind('touchstart click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                scope.$apply(attrs['myclick']);
            });
        };
    })
	
    .controller('AppCtrl', function($state, $scope, $ionicHistory, $ionicSideMenuDelegate, $ionicPopup, $rootScope) {
        ionic.Platform.ready(function() {
            
        });

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };
    
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };

        $scope.goToPage = function(pageId) {
            $state.go(pageId);
        };

        
        $scope.showCamera = function(destId) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Choose Method',
                template: 'Please select method to choose profile picture.',
                cancelText: 'Gallery',
                okText: 'Camera'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    openCamera(destId);
                } else {
                    openGallery(destId);
                }
            });
        };

    })


    
    .controller('LoginController', function($scope, $state, $http) {
		$scope.data = {};
        $scope.login = function(){
            if($scope.data.username==undefined){
				showAlert('Please enter username',alertDismissed,"Login","Ok");
			}
			else if($scope.data.password==undefined){
				showAlert('Please enter password',alertDismissed,"Login","Ok");
			}else{
				showLoader('Login...');
				var responseLogin = $http({
				  method  : 'POST',
				  url     : apiUrl+"user_login",
				  data    : $.param({username:$scope.data.username, password:$scope.data.password}),  // pass in data as strings
				  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
				 });

				responseLogin.success(function(data, status, headers, config) {
					hideLoader();
					if(data.status==1){
						userInfo = data.data;
						$state.go('add-product');
					}else{
						showAlert(data.message,alertDismissed,"Login","Ok");
					}
				});
				responseLogin.error(function(data, status, headers, config) {
					hideLoader();
					showAlert("Can not login, please try again later!",alertDismissed,"Login","Ok");
				});
			}
        }
  

    })
	
	
	.controller('AddProductController', function($scope, $state, $http) {
		$scope.data = {};
        $scope.add = function(){
            if($scope.data.name==undefined){
				showAlert('Please enter name',alertDismissed,"Product","Ok");
			}
			else if($scope.data.sku==undefined){
				showAlert('Please enter sku',alertDismissed,"Product","Ok");
			}
			else if($scope.data.uom==undefined){
				showAlert('Please enter uom',alertDismissed,"Product","Ok");
			}
			else if($scope.data.status==undefined){
				showAlert('Please select status',alertDismissed,"Product","Ok");
			}else{
				showLoader('Adding...');
				$scope.data.upc = $scope.data.upc==undefined?'':$scope.data.upc;
				$scope.data.mpn = $scope.data.mpn==undefined?'':$scope.data.mpn;
				$scope.data.ean = $scope.data.ean==undefined?'':$scope.data.ean;
				$scope.data.isbn = $scope.data.isbn==undefined?'':$scope.data.isbn;
				$scope.data.cost_price = $scope.data.cost_price==undefined?'':$scope.data.cost_price;
				$scope.data.selling_price = $scope.data.selling_price==undefined?'':$scope.data.selling_price;
				var responseProduct = $http({
				  method  : 'POST',
				  url     : apiUrl+"user_add_product",
				  data    : $.param({user_id:userInfo.User.id, name:$scope.data.name, upc:$scope.data.upc, sku:$scope.data.sku, mpn:$scope.data.mpn, uom:$scope.data.uom, ean:$scope.data.ean, isbn:$scope.data.isbn, cost_price:$scope.data.cost_price, selling_price:$scope.data.selling_price, status:$scope.data.status}),  // pass in data as strings
				  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
				 });

				responseProduct.success(function(data, status, headers, config) {
					hideLoader();
					if(data.status==1){
						showAlert(data.message,alertDismissed,"Product","Ok");
					}else{
						showAlert(data.message,alertDismissed,"Product","Ok");
					}
				});
				responseProduct.error(function(data, status, headers, config) {
					hideLoader();
					showAlert("Can not add product, please try again later!",alertDismissed,"Product","Ok");
				});
			}
        }
		
		$scope.scanBarcode = function(){
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    var scannedText = result.text;
					alert(scannedText);
					showLoader('Searching...');
					var responseProduct = $http({
					  method  : 'POST',
					  url     : apiUrl+"user_search_product",
					  data    : $.param({keyword:scannedText}),  // pass in data as strings
					  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
					 });

					responseProduct.success(function(data, status, headers, config) {
						hideLoader();
						if(data.status==1){
							$scope.data.name = data.data.Product.name;
							$scope.data.upc = data.data.Product.upc;
							$scope.data.sku = data.data.Product.sku;
							$scope.data.mpn = data.data.Product.mpn;
							$scope.data.uom = data.data.Product.uom;
							$scope.data.ean = data.data.Product.ean;
							$scope.data.isbn = data.data.Product.isbn;
						}else{
							showAlert(data.message,alertDismissed,"Product","Ok");
						}
					});
					responseProduct.error(function(data, status, headers, config) {
						hideLoader();
						showAlert("Can not find product, please try again later!",alertDismissed,"Product","Ok");
					});
                },
                function (error) {
                    showAlert("Scanning failed: " + error, alertDismissed, "Error", "Ok");
                });
        }
  

    })
	