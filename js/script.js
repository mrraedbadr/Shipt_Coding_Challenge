function UsernameController($scope) {
	$scope.getGithubUserInfo = function() {
		$scope.page = 1;
		$scope.user = {};
		$scope.followers = [];
		$scope.getUserInfo().then(function(){});
	};

	$scope.getUserInfo = function(){
		return new Promise(function(resolve, reject){
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
			    if (xhr.readyState == XMLHttpRequest.DONE) {
			    	let objUser = JSON.parse(xhr.responseText);
			    	$scope.getFollowers(objUser.followers_url).then(function(arrFollowers){
			    		console.log(arrFollowers)
			    		$scope.$apply(function() {
	  						$scope.user = objUser;
	  						$scope.followers = arrFollowers;
	  						console.log(objUser);
						});
			    		resolve();
			    	})
			    }
			}
			xhr.open('GET', 'https://api.github.com/users/' + $scope.username, true);
			xhr.send(null);
		});
	}

	$scope.getFollowers = function(uri){
		return new Promise(function(resolve, reject){
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState == XMLHttpRequest.DONE) {
					resolve(JSON.parse(xhr.responseText));
				}
			}
			xhr.open('GET', uri + '?per_page=100&page=1', true);
			xhr.send(null);			
		});
	}

	$scope.getMoreFollowers = function(){
		$scope.page += 1;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == XMLHttpRequest.DONE) {
				let arrAdditionalFollowers = JSON.parse(xhr.responseText);
				if(arrAdditionalFollowers.length === 0){
					alert('No more followers');
				}
				else{
					// concat array
		    		$scope.$apply(function() {
  						$scope.followers = $scope.followers.concat(arrAdditionalFollowers);
					});						
				}
			}
		}
		xhr.open('GET', $scope.user.followers_url + '?per_page=100&page=' + $scope.page, true);
		xhr.send(null);			
	}
}