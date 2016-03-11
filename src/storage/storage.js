import React, {AsyncStorage} from 'react-native';

export default {
    queryStorage: function(key){
        return AsyncStorage.getItem(key);
    },
    setStorage: function(key, value){
    	if(typeof value !== 'string'){
        	AsyncStorage.setItem(key, JSON.stringify(value));
    	}else{
    		AsyncStorage.setItem(key, value);
    	}
    },
    removeStorage: function(key){
        AsyncStorage.removeItem(key);
    },
}