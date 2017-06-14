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
  TouchableOpacity,
} from "react-native";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import WonderWoman2 from "./wonderwoman.jpg";

const WonderWoman = { uri: "https://i.imgur.com/sNam9iJ.jpg" };

Image.prefetch("https://i.imgur.com/sNam9iJ.jpg")

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export default class screens extends Component {
  state = {
    openIndex: null,
    render: false,
    show: false,
    overlayImage: false,
    coords: {
      left: new Animated.Value(0),
      top: new Animated.Value(0),
      width: new Animated.Value(0),
      height: new Animated.Value(0),
    },
    transition: {},
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
    this.index = 0;
    this.images = {};
    this.animation = new Animated.Value(0);
    this.opacityAnimation = new Animated.Value(0);
  }
  componentDidMount() {
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.state.markers[index];
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }

  handleClose = () => {
    const { openIndex: index } = this.state;

    this.tImage.measure(
      (tframeX, tframeY, tframeWidth, tframeHeight, tpageX, tpageY) => {
        this.state.coords.top.setValue(tpageY);
        this.state.coords.left.setValue(tpageX);
        this.state.coords.width.setValue(tframeWidth);
        this.state.coords.height.setValue(tframeHeight);
        Animated.timing(this.opacityAnimation, {
          toValue: 0,
          duration: 100, // THIS SHOULD BE INTERPOLATION FROM X AND Y!
        }).start();

        this.setState(
          {
            overlayImage: true,
          },
          () => {
            this.images[
              index
            ].measure(
              (frameX, frameY, frameWidth, frameHeight, pageX, pageY) => {
                Animated.parallel([
                  Animated.timing(this.state.coords.top, {
                    toValue: pageY,
                    duration: 250,
                  }),
                  Animated.timing(this.state.coords.left, {
                    toValue: pageX,
                    duration: 250,
                  }),
                  Animated.timing(this.state.coords.width, {
                    toValue: frameWidth,
                    duration: 250,
                  }),
                  Animated.timing(this.state.coords.height, {
                    toValue: frameHeight,
                    duration: 250,
                  }),
                ]).start(() => {
                  this.setState({
                    overlayImage: false,
                    render: false,
                    openIndex: null,
                  });
                });
              }
            );
          }
        );
      }
    );
  };

  handleShow = index => {
    this.setState(
      {
        openIndex: index,
        render: true,
        transition: this.state.markers[index],
      },
      () => {
        this.images[
          index
        ].measure((frameX, frameY, frameWidth, frameHeight, pageX, pageY) => {
          this.state.coords.top.setValue(pageY);
          this.state.coords.left.setValue(pageX);
          this.state.coords.width.setValue(frameWidth);
          this.state.coords.height.setValue(frameHeight);
          this.setState(
            {
              overlayImage: true,
            },
            () => {
              this.tImage.measure(
                (
                  tframeX,
                  tframeY,
                  tframeWidth,
                  tframeHeight,
                  tpageX,
                  tpageY
                ) => {
                  Animated.parallel([
                    Animated.timing(this.state.coords.top, {
                      toValue: tpageY,
                      duration: 250,
                    }),
                    Animated.timing(this.state.coords.left, {
                      toValue: tpageX,
                      duration: 250,
                    }),
                    Animated.timing(this.state.coords.width, {
                      toValue: tframeWidth,
                      duration: 250,
                    }),
                    Animated.timing(this.state.coords.height, {
                      toValue: tframeHeight,
                      duration: 250,
                    }),
                  ]).start(() => {
                    this.opacityAnimation.setValue(1);
                    this.setState({
                      overlayImage: false,
                    });

                  });
                }
              );
            }
          );
        });
      }
    );
  };

  render() {
    const interpolations = this.state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        (index + 1) * CARD_WIDTH + 1,
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });

    return (
      <View style={styles.container}>
        <MapView
          ref={map => this.map = map}
          initialRegion={this.state.region}
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
              opacity: interpolations[index].opacity,
            };
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
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          {this.state.markers.map((marker, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => this.handleShow(index)}
            >
              <View style={styles.card}>
                <Image
                  source={marker.image}
                  style={styles.cardImage}
                  resizeMode="cover"
                  ref={img => this.images[index] = img}
                />
                <View style={styles.textContent}>
                  <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
                  <Text numberOfLines={1} style={styles.cardDescription}>
                    {marker.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
        {this.state.overlayImage &&
          <Animated.Image
            resizeMode="cover"
            style={{
              position: "absolute",
              top: this.state.coords.top,
              left: this.state.coords.left,
              width: this.state.coords.width,
              height: this.state.coords.height,
            }}
            source={this.state.transition.image}
          />}
        {this.state.render &&
          <Animated.View
            style={[
              styles.transitionContainer,
              StyleSheet.absoluteFill,
              { opacity: this.opacityAnimation },
            ]}
          >
            <TouchableOpacity onPress={this.handleClose}>
              <View><Text>Close</Text></View>
            </TouchableOpacity>
            <Image
              source={this.state.transition.image}
              style={styles.transitionImage}
              ref={tImage => this.tImage = tImage}
              resizeMode="cover"
            />
            <View style={{flex: 3}}>
              <Text>{this.state.transition.title}</Text>
              <Text>{this.state.transition.description}</Text>
            </View>
          </Animated.View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hide: {
    opacity: 0,
  },
  transitionContainer: {
    backgroundColor: "#FFF",
    padding: 10,
  },
  transitionImage: {
    width: "100%",
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
    paddingRight: width - CARD_WIDTH,
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
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
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
