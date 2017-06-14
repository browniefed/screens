import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-native";

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
// import MapStyle from "./mapstyle.json";

export default class screens extends Component {
  state = {
    items: [
      
    ],
    region: {
      latitude: 45.522954,
      longitude: -122.6699177,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  };

  onRegionChange = (region) => {
    this.setState({ region });
  }
  render() {
    return (
      <View style={styles.container}>
        <MapView 
          region={this.state.region} 
          onRegionChange={this.onRegionChange} 
          style={styles.container}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

AppRegistry.registerComponent("screens", () => screens);
