import React, {View, Component} from 'react-native'
export default class flex extends Component{
	render(){
		return(
			<View style={{flex: 1, flexDirection: 'column'}}>
				<View style={{flex: 1, backgroundColor: '#565656'}}></View>
				<View style={{flex: 1, backgroundColor: '#787878'}}></View>
			</View>
		);
	}
}