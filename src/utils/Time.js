import moment from 'moment'
import ajax from '../http/ajax'
export default {
	checkTokenExpire: function(utc, token){
		if(!moment().isBefore(utc)){
			ajax.getRefreshToken(token);
		}
	}
}