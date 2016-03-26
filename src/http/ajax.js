import url from './url'
import storage from '../storage/storage'
import Events from 'react-native-simple-events';
import moment from 'moment'
import base64 from 'base-64'
export default {
	getAuthorizationToken: function(resolve, code){
		let obj = {
			method: 'POST',
			headers: {
				'Authorization': "Basic " + base64.encode(url.appId+":"),
				'Content-Type': "application/x-www-form-urlencoded",
			}
		};
		obj.body = "grant_type=authorization_code&code="+code+"&redirect_uri=http://reactreddit/authorize";
		fetch(url.refreshToken, obj)
		.then((response) => response.json())
		.then(function(responseData){
			resolve(JSON.stringify(responseData));
		}).done();
	},
	getStorageToken: function(resolve){
		storage.queryStorage('ACCESS_TOKEN').then((value) => {
			if(value){
				resolve(value);
			}else{
				resolve(null);
			}
		}).done();
	},
	getRefreshToken: function(resolve, refreshToken){
		let obj = {
			method: 'POST',
			headers: {
				'Authorization': "Basic " + base64.encode(url.appId+":"),
				'Content-Type': "application/x-www-form-urlencoded",				
			}
		};
		obj.body = "grant_type=refresh_token&refresh_token="+refreshToken;
		fetch(url.refreshToken, obj)
		.then((response) => response.json())
		.then(function(responseData){
            let token={timeStamp: moment().add(60, 'minutes'),
            token: responseData.access_token,
            refreshToken: responseData.refresh_token};
            storage.setStorage("ACCESS_TOKEN", token);
            resolve(JSON.stringify(responseData));
		}).done();
	},
	checkCaptcha: function(resolve, reject){
		// let promise = new Promise((resolve) => {this.getStorageToken(resolve)});
		// let token, refreshToken, timeStamp = null;
		// promise.then(function(val){
		// 	if(val){
		// 		token = JSON.parse(val).token;
		// 		refreshToken = JSON.parse(val).token;
		// 		timeStamp = JSON.parse(val).timeStamp;
		// 	}else{
		// 		reject("Sorry something is wrong");
		// 	}
		// }.bind(this));	
		// let obj = {
		// 	method: 'GET',
		// 	headers:
		// };
	},
	postComment: function(resolve, reject, id, comment, sub, thingId){
		let promise = new Promise((resolve) => {this.getStorageToken(resolve)});
		let token, refreshToken, timeStamp = null;
		promise.then(function(val){
			if(val){
				token = JSON.parse(val).token;
				refreshToken = JSON.parse(val).refreshToken;
				timeStamp = JSON.parse(val).timeStamp;
				if(moment().isAfter(timeStamp)){
					let promise1 = new Promise((resolve) => {this.getRefreshToken(resolve, refreshToken)});
					promise1.then(function(val){
						token = JSON.parse(val).token;
						refreshToken = JSON.parse(val).refreshToken;
						timeStamp = JSON.parse(val).timeStamp;	
						getComment();					
					}.bind(this));
				}else{
					getComment();
				}
			}else{
				reject("Sorry something is wrong");
			}
		}.bind(this));
		let getComment = function(){
			let obj = {
				method: 'POST',
				headers: {
					'Authorization': "bearer "+token,
					'Content-Type': "application/x-www-form-urlencoded"
				}
			};

			if(thingId){
				//reply
				obj.body = "thing_id="+thingId+
					"&text="+comment+
					"&r="+sub+
					"&id=#commentreply_"+thingId+
					"&api_type=json";
			}else{
				//comment
				obj.body = "thing_id="+id+
					"&text="+comment+
					"&r="+sub+
					"&api_type=json";
			}

			fetch(url.comment, obj)
			.then((response) => response.json()).then((responseData) => {
				if(responseData){
					if(responseData.error){
						reject(responseData.error);
					}else if(responseData.json.errors.length === 0){
						resolve(JSON.stringify(responseData.json.data.things[0]));
					}
				}else{
					reject("Sorry something is wrong");
				}
			}).done();
		};
	},
	getFriends: function(resolve, reject){
		let promise = new Promise((resolve) => {this.getStorageToken(resolve)});
		let token, refreshToken, timeStamp = null;
		promise.then(function(val){
			if(val){
				token = JSON.parse(val).token;
				refreshToken = JSON.parse(val).refreshToken;
				timeStamp = JSON.parse(val).timeStamp;
				if(moment().isAfter(timeStamp)){
					let promise1 = new Promise((resolve) => {this.getRefreshToken(resolve, refreshToken)});
					promise1.then(function(val){
						token = JSON.parse(val).token;
						refreshToken = JSON.parse(val).refreshToken;
						timeStamp = JSON.parse(val).timeStamp;	
						getFriends();					
					}.bind(this));
				}else{
					getFriends();
				}
			}else{
				reject("Sorry something is wrong");
			}
		}.bind(this));

		let getFriends = function(){
			let obj = {
				method: 'GET',
				headers: {
					'Authorization': "bearer "+token,
				}
			};

			fetch(url.friends, obj)
			.then((response) => response.json()).then((responseData) => {
				if(responseData){
					if(responseData.error){
						reject(responseData.error);
					}else if(responseData.data.children){
						console.log(JSON.stringify(responseData.data.children));
						resolve(JSON.stringify(responseData.data.children));
					}
				}else{
					reject("Something is wrong");
				}
			}).done();
		};
	},
	getAccountInfo: function(token){
        let obj = {
            method: 'GET',
            headers: {
				'Authorization': "bearer "+token,
            }
        }; 

		fetch(url.me, obj)
		  .then((response) => response.json())
		  .then((responseData) => {
		  	if(!responseData.error){
		  		storage.setStorage("ME", responseData);
		  		Events.trigger('UPDATE_INFO', {name: responseData.name});
		  	}
		  }).done();
	}
}