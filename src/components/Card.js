import React, { Component, PropTypes, View, Text, Image } from 'react-native';
import { Card, Button } from 'react-native-material-design';

render() {

    

    return (
            <View>
                <Card>
                    <Card.Media
                        image={<Image source={require('./../img/welcome.jpg')} />}
                        overlay
                    />
                    <Card.Body>
                        <Text>Some text to go in the body.</Text>
                    </Card.Body>
                    <Card.Actions position="right">
                        <Button value="ACTION" />
                    </Card.Actions>
                </Card>
            </View>
    );
}