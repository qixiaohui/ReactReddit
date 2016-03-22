import url from './url'
import storage from '../storage/storage'
import Events from 'react-native-simple-events';
export default {
	getRefreshToken: function(token){

	},
	getAccountInfo: function(token){
        var obj = {
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