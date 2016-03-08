import React, {Component, View, Text, StyleSheet} from 'react-native'
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
					<Text style = {styles.commentHeader}><Text style={{color: '#36689a'}}>{this.state.data.author}</Text> {this.state.data.score} points {moment.unix(this.state.data.created).fromNow()}</Text>
					<Text style = {styles.commentBody}>{this.state.data.body}</Text>
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
	},
	commentBody: {
		fontSize: 10,
		color: '#000000',
	},
	commentHeader: {
		fontSize: 9,
		fontWeight: 'bold',
		color: '#888888',
	}
});