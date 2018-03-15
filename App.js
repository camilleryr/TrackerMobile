import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Constants, Location, Permissions, MapView } from 'expo';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: [{ coords: { latitude: 36.203235369209374, longitude: -86.7000000010001 } }],
      tracking: false,
      buttonText: { "false": "Track My Run", "true": "Im Done!" },
      trackingSubscription: {},
    };
  }

  _onButtonPress = () => {
    // console.log(this.state)
    if (!this.state.tracking) {
      this._getLocationAsync()
    } else if (this.state.tracking) {
      try {
        this.state.trackingSubscription.remove()
        this._postToFirebase().then(e =>
          console.log(e)
        )
      } catch (e) {
        console.log("Whoops", e)
      }
    }
    this.setState(prevState => ({
      tracking: !prevState.tracking
    }));
  }

  _postToFirebase = () => {
    return fetch(`http://danko.mit.edu/api/activities`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(this.state.location),
    }).then( res => console.log(res) );
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    this.state.location = []
    let _location = await Location.watchPositionAsync({
      enableHighAccuracy: true,
      timeInterval: 1000,
      distanceInterval: 10
    }, loc => {
      this.state.location.unshift(loc)
      this.setState({ location: this.state.location })
    }
    );
    this.state.trackingSubscription = _location
  };

  render() {
    // console.log(this.state.location)
    return (
      <View style={styles.container}>

        <MapView
          provider={MapView.PROVIDER_GOOGLE}
          style={{ alignSelf: 'stretch', height: '100%' }}
          customMapStyle={mapstyle}
          region={{
            latitude: this.state.location[0].coords.latitude,
            longitude: this.state.location[0].coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
        >
          <MapView.Polyline
            coordinates={this.state.location.map(x => { return { "latitude": x.coords.latitude, "longitude": x.coords.longitude } })}
            strokeColor='#19B5FE'
            strokeWidth={5}
          />
        </MapView>
        <MapView.Callout>
          <View >
            <Button
              onPress={this._onButtonPress}
              title={this.state.buttonText[this.state.tracking.toString()]}
              textStyle={{ fontWeight: "700" }}
              buttonStyle={{
                backgroundColor: "rgba(92, 99,216, .65)",
                width: 300,
                height: 60,
                borderColor: "transparent",
                borderWidth: 5,
                borderRadius: 50,
                marginTop: 550,
                marginLeft: 30
              }}
            />
          </View>
        </MapView.Callout>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapstyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
]