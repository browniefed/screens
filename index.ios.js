import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image,
  Dimensions,
} from "react-native";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
// import MapStyle from "./mapstyle.json";

import WonderWoman from "./wonderwoman.jpg";

const { width } = Dimensions.get("window");

export default class screens extends Component {
  state = {
    markers: [
      {
        coordinate: {
          latitude: 45.524548,
          longitude: -122.6749817,
        },
        title: "Best Place",
        description: "This is the best place in Portland",
        image: WonderWoman,
      },
      {
        coordinate: {
          latitude: 45.524698,
          longitude: -122.6655507,
        },
        title: "Second Best Place",
        description: "This is the second best place in Portland",
        image: WonderWoman,
      },
      {
        coordinate: {
          latitude: 45.5230786,
          longitude: -122.6701034,
        },
        title: "Third Best Place",
        description: "This is the third best place in Portland",
        image: WonderWoman,
      },
      {
        coordinate: {
          latitude: 45.521016,
          longitude: -122.6561917,
        },
        title: "Fourth Best Place",
        description: "This is the fourth best place in Portland",
        image: WonderWoman,
      },
    ],
    region: {
      latitude: 45.52220671242907,
      longitude: -122.6653281029795,
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    },
  };

  componentWillMount() {
    this.animation = new Animated.Value(0);
  }

  onRegionChange = region => {
    this.setState({ region });
  };
  handleScroll = e => {
    console.log(e.nativeEvent.contentOffset.x);
  };
  render() {
    const interpolations = this.state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * 200,
        index * 200,
        (index + 1) * 200 + 1,
      ]
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [.35, 1, .35],
        extrapolate: "clamp"
      });
      return { scale, opacity }
    });

    return (
      <View style={styles.container}>
        <MapView
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          style={styles.container}
        >
          {this.state.markers.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            const opacityStyle = {
              opacity: interpolations[index].opacity
            }
            return (
              <MapView.Marker key={index} coordinate={marker.coordinate}>
                <Animated.View style={[styles.markerWrap, opacityStyle]}>
                  <Animated.View style={[styles.ring, scaleStyle]} />
                  <View style={styles.marker} />
                </Animated.View>
              </MapView.Marker>
            );
          })}
        </MapView>
        <ScrollView
          horizontal
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          snapToInterval={200}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  x: this.animation,
                },
              },
            },
          ])}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          {this.state.markers.map((marker, index) => (
            <View style={styles.card} key={index}>
              <Image
                source={marker.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textContent}>
                <Text style={styles.cardtitle}>{marker.title}</Text>
                <Text numberOfLines={2} style={styles.cardDescription}>
                  {marker.description}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: 200,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: 250,
    width: 200,
  },
  cardImage: {
    maxWidth: "100%",
    flex: 3,
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    marginTop: 10,
    fontWeight: "bold",
  },
  cardDescription: {
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
});

AppRegistry.registerComponent("screens", () => screens);
