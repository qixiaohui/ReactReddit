import url from './url'
import storage from '../storage/storage'
import Events from 'react-native-simple-events';
export default {
	postComment: function(resolve, reject, token, id, comment, sub){
		let obj = {
			method: 'POST',
			headers: {
				'Authorization': "bearer "+token,
				'Content-Type': "application/x-www-form-urlencoded"
			}
		};

		obj.body = "thing_id="+id+
			"&text="+comment+
			"&r="+sub+
			"&api_type=json";

		fetch(url.comment, obj)
		.then((response) => response.json()).then((responseData) => {
			if(responseData.error){
				reject(responseData.error);
			}else if(responseData){
				if(responseData.json.errors.length === 0){
					resolve(JSON.stringify(responseData.json.data.things[0]));
					console.log("resolve");
				}
			}else{
				reject("Something is wrong");
			}
		}).done();
	},
	getRefreshToken: function(token){

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