import React, {Component, View, Text, StyleSheet} from 'react-native'
import { Icon } from 'react-native-material-design';
import moment from 'moment'

export default class CommentCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.data,
		};
	}

	render() {
		return(
			<View style={{marginLeft: this.state.data.indent*15}}>
				<View style={styles.commentContainer}>
					<View style={{flex: 4}}>
						<Text style = {styles.commentHeader}><Text style={{color: '#36689a'}}>{this.state.data.author}</Text> {this.state.data.score} points {moment.unix(this.state.data.created).fromNow()}</Text>
						<Text style = {styles.commentBody}>{this.state.data.body}</Text>
					</View>
					<View style={styles.reply}>
							<Icon style={styles.icon} name="reply" />
					</View>
				</View>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	commentContainer: {
		marginLeft: 15,
		marginRight: 10,
		marginTop: 5,
		marginBottom: 5,
		borderWidth: 1,
		padding: 5,
		borderColor: '#888888',
		borderRadius: 5,
		flex: 1,
		flexDirection: 'row'
	},
	commentBody: {
		fontSize: 12,
		color: '#000000',
	},
	commentHeader: {
		fontSize: 10,
		fontWeight: 'bold',
		color: '#888888',
	},
	reply: {
		flex: 1,
	},
	icon: {
		alignSelf: 'flex-end',
	}
});