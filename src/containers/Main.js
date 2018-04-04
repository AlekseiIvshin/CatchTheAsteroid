import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import actions from "../actions";

class Main extends Component{
    componentDidMount() {
        this.props.startRanging(null);
    }

    componentWillUnmount() {
        this.props.stopRanging(null);
    }

    render() {
        return (
            <View>
                <Text>{this.props.beacons.isSearching ? "Searching..." : "Found:"}</Text>
                {this.props.beacons.items.map((beacon) => (
                    <Text>
                        {beacon.uuid} ({beacon.major}/{beacon.minor}) -{" "}
                        {Math.ceil(beacon.distance * 100) / 100}
                    </Text>
                ))}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return { beacons: state.beacons };
}

export default connect(mapStateToProps, actions)(Main);
