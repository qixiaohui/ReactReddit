import React, {AsyncStorage} from 'react-native';

export default {
    queryStorage: function(key){
        return AsyncStorage.getItem(key);
    },
    setStorage: function(key, value){
        AsyncStorage.setItem(key, JSON.stringify(value));
    },
    removeStorage: function(key){
        AsyncStorage.removeItem(key);
    },
}