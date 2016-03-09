import React,{Component, View, Text} from 'react-native';
import { Subheader, Divider, Checkbox, Icon } from 'react-native-material-design';

export default class Settings extends Component {
	constructor(props){
		super(props);
		this.state = {
			over18: false
		};
	}
	render(){
		return(
            <View>
                <Icon name="invert-colors" /><Text>change theme</Text>
                <Divider inset />
				<Icon name="lock" />
				<Text>Allow over 18 content</Text>
				<Checkbox checked={(!this.state.over18)} onCheck={()=>{this.setState({over18: !this.state.over18})}} primary={'googleGreen'} />
                <Divider inset />
            </View>
		);
	}
}