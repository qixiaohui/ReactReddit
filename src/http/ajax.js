import url from './url'
import storage from '../storage/storage'
import Events from 'react-native-simple-events';
import moment from 'moment'
import base64 from 'base-64'
export default {
	getAuthorizationToken: function(resolve, code){
		let obj = {
			method: 'POST',
			timeout: 10,
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
		}).catch((e) => {console.error(e)}).done();
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
			timeout: 10,
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
            refreshToken: refreshToken};
            resolve(JSON.stringify(token));
            storage.setStorage("ACCESS_TOKEN", token);
		}).catch((e) => {console.error(e)}).done();
	},
	checkCaptcha: function(resolve, reject){
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
						checkCaptcha();					
					}.bind(this));
				}else{
					checkCaptcha();
				}
			}else{
				reject("Sorry something is wrong");
			}
		}.bind(this));	
		let checkCaptcha = function(){
			let obj = {
				method: 'GET',
				timeout: 10,
				headers: {
					'Authorization': "bearer "+token,
					'Content-Type': "application/x-www-form-urlencoded"
				}
			};
			fetch(url.captcha, obj)
			.then((response) => response._bodyText).then((responseData) => {
				if(responseData){
					if(responseData.error){
						reject(responseData.error);
					}else{
						resolve(responseData);
					}
				}else{
					reject("Something is wrong");
				}
			}).catch((e) => {
				console.error(e);
			}).done();

		};
	},
	newCaptcha: function(resolve, reject){
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
						newCaptcha();					
					}.bind(this));
				}else{
					newCaptcha();
				}
			}else{
				reject("Sorry something is wrong");
			}
		}.bind(this));
		let newCaptcha = function() {
			let obj = {
				method: 'POST',
				timeout: 10,
				headers: {
					'Authorization': "bearer "+token,
					'Content-Type': "application/x-www-form-urlencoded"
				}
			};

			fetch(url.newCaptcha, obj)
			.then((response) => response.json()).then((responseData) => {
				if(responseData){
					if(responseData.error){
						reject(responseData.error);
					}else if(responseData.jquery[11][2] === "call"){
						resolve(responseData.jquery[11][3][0]);
					}
				}else{
					reject("Sorry something is wrong");
				}
			}).catch((e) => {
				console.error(e);
			}).done();			
		};
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
				timeout: 10,
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
					console.log("^&*^*"+JSON.stringify(responseData));
					if(responseData.error){
						reject(responseData.error);
					}else if(responseData.json.errors.length === 0){
						console.log("resolve comment");
						resolve(JSON.stringify(responseData.json.data.things[0]));
					}else{
						reject(responseData.json.errors[0]);
					}
				}else{
					reject("Sorry something is wrong");
				}
			}).catch((e) => {
				console.error(e);
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
				timeout: 10,
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
						resolve(JSON.stringify(responseData.data.children));
					}
				}else{
					reject("Something is wrong");
				}
			}).catch((e) => {
				console.error(e);
			}).done();
		};
	},
	getAccountInfo: function(token){
        let obj = {
            method: 'GET',
            timeout: 10,
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
		  }).catch((e) => {
		  	console.error(e);
		  }).done();
	},
	submitPost: function(resolve, reject, kind, data){
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
						submitPost();				
					}.bind(this));
				}else{
					submitPost();
				}
			}else{
				reject("Sorry something is wrong");
			}
		}.bind(this));	

		let submitPost = function(){
			let obj = {
				method: 'POST',
				timeout: 10,
				headers: {
					'Authorization': "bearer "+token,
					'Content-Type': "application/x-www-form-urlencoded"
				}
			};
			if(kind === 'url'){
				if(data.iden){
					obj.body = "api_type=json&kind=link&resubmit=true&sr="+
					data.sr+
					"&title="+data.title+
					"&url="+data.url+
					"&captcha="+data.captchaText+
					"&iden="+data.iden;
				}else{
					obj.body = "api_type=json&kind=link&resubmit=true&sr="+
					data.sr+
					"&title="+data.title+
					"&url="+data.url;
				}
			}else if(kind === 'text'){
				if(data.iden){
					obj.body = "api_type=json&kind=self&resubmit=true&sr="+
					data.sr+
					"&title="+data.title+
					"&text="+data.text+
					"&captcha="+data.captchaText+
					"&iden="+data.iden;
				}else{
					obj.body = "api_type=json&kind=self&resubmit=true&sr="+
					data.sr+
					"&title="+data.title+
					"&text="+data.text;
				}
			}
			fetch(url.submit, obj)
			.then((response) => response.json())
			.then((responseData) => {
				if(responseData){
					if(responseData.error){
						reject(responseData.error);
					}else if(responseData.json.errors.length === 0){
						resolve(responseData.json.data.url);
					}else if(responseData.json.captcha){
						reject({captcha: responseData.json.captcha});
					}else{
						reject(responseData.json.errors[0]);
					}
				}else{
					reject("Sorry something is wrong");
				}
			}).catch((e) => {
				console.error(e);
			}).done();
		};	
	},
	fetchMySub: function(resolve, reject){
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
						fetchMySub();				
					}.bind(this));
				}else{
					fetchMySub();
				}
			}else{
				reject("Sorry something is wrong");
			}
		}.bind(this));	

		let fetchMySub = function(){
			let obj = {
				method: 'GET',
				timeout: 10,
				headers: {
					'Authorization': "bearer "+token,
					'Content-Type': "application/x-www-form-urlencoded"
				}
			};

			fetch(url.mySub, obj)
			.then((response) => response.json()).then((responseData) => {
				if(responseData){
					if(responseData.error){
						reject(responseData.error);
					}else if(responseData.data.children){
						resolve(JSON.stringify(responseData.data.children));
					}
				}else{
					reject("Something is wrong");
				}
			}).catch((e) => {
				console.error(e);
			}).done();			
		};	
	}
}