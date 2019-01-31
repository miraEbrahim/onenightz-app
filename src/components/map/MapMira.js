import React from 'react';
import scriptLoader from 'react-async-script-loader';
//import { library } from '@fortawesome/fontawesome-svg-core';
//import { faSearch, faBars, faTimes, faDirections, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
//import { fab } from '@fortawesome/free-brands-svg-icons';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import ListView from './components/Layout/ListView';
import { GoogleKey, Putney, cafes } from './components/Map/MapData';
import './App.css';
import { mapStyles } from './components/map/MapStyles';




//library.add( fab, faSearch, faBars, faTimes , faDirections, faMoneyBill );

class MapMira extends React.Component {
  constructor(props) {
    super();
    this.state = {
        cafes: cafes,
        map:"",
        marker:"",
        markerArray:[],
        data0: {}
    };
  }

  componentWillReceiveProps({isScriptLoadSucceed}){
    if (isScriptLoadSucceed) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: Putney,
          styles: mapStyles
      });
      this.setState({map:map});

      //InfoWindo & Markers
      const  infowindow =  new window.google.maps.InfoWindow({});
      let  marker, count;
      let markerArray = [];
      for (count = 0; count < cafes.length; count++) {
          marker = new window.google.maps.Marker({
            position: new window.google.maps.LatLng(cafes[count].latitude, cafes[count].longitude),
            icon: {
              path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 5,
              strokeColor: '#ce255e'
            },
            animation: window.google.maps.Animation.DROP,
            map: map,
            title: this.state.cafes[count].name
          });
          window.google.maps.event.addListener(marker, 'click', (function (marker, count) {
            return function () {
              infowindow.setContent(
                `<div tabIndex="0" class="infoWindow">
                    <h4>${cafes[count].name}</h4>
                    <p>${cafes[count].cafeStreetAddress}</p>
                    <p>${cafes[count].cafeCity}${cafes[count].cafeZipCode}</p>
                    <p>${cafes[count].mapDirection}</p>
                  
                  </div>
                `
              );
              infowindow.open(map,marker, marker.setAnimation(window.google.maps.Animation.BOUNCE));//Add the aniamtion when the marker is clicked
              setTimeout(() => {marker.setAnimation(null);}, 400)
            };
          })(marker, count));
          markerArray.push({id: cafes[count].id, marker: marker});
        };
        this.setState({markerArray: markerArray});
    }
    else {
      //logging Map Error handeling 
      alert("Opps,,, Cann't Load Google Map!");
      console.log("Opps,,, Cann't Load Google Map!");
      this.setState({requestWasSuccessful: false});

    }
  }

  filterMarker = (filteredList) => {
    let listArray = filteredList.map( (object) => object.id );
    let markers = this.state.markerArray;
    for (let l = 0; l < markers.length; l++ ){
      if (listArray.includes(markers[l].id) ) {
      markers[l].marker.setVisible(true);
      window.google.maps.event.trigger(markers[l].marker, 'click');
    }
    else {markers[l].marker.setVisible(false);
    }}
  };

  clickedMarker = (cafeName, id) => {
    let marker = this.state.markerArray;
    for ( let m=0; m < marker.length; m++){
      if (marker[m].id === id)
      {
        window.google.maps.event.trigger(marker[m].marker, 'click');
      }
    }
  }
  //handel map error
  componentDidMount(){
    window.gm_authFailure = function() {
      alert("Google MAPS failed to load")
      console.log("Google MAPS failed to load")
    }
  }

  render(){
    return (
      <div className="App">
        <div className="app-header"><h2 className="header-title"> Putney Neighbourhood's Cafes </h2></div>
        <div className="off-canvas">
          <input id="hamburger" type='checkbox' className="hamburger-checkbox" />
          <label className="hamburger" tabIndex="1" htmlFor="hamburger" role="button" aria-label="toggle-bars"><FontAwesomeIcon icon="bars"/></label>
          <nav id="list-toggle" role="list" className="sidebar" onClick={this.toggleList}>
            <div className="list-view">
              <ListView cafes={this.state.cafes} clickedMarker={this.clickedMarker} filterMarker={this.filterMarker}  />
            </div>
            <div>
              <h2 className="price-power"> Pricing By: </h2>
              <p className="fa-p"><FontAwesomeIcon icon={['fab', 'foursquare']}/></p>
            </div>
          </nav>
          <main role="main" className="map-body">
            <div id="map" role="application"></div>
          </main>
        </div>
        <footer className="app-footer">
          <h4 className="footer-title"> Maryam Ebrahim @Udacity FEND Project </h4>
        </footer>
      </div>
    );
  }
}

export default scriptLoader(
  [`https://maps.googleapis.com/maps/api/js?key=${GoogleKey}`]
)(MapMira)