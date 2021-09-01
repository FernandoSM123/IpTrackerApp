import './App.css';
import arrowIcon from './images/icon-arrow.svg';
import locationIcon from './images/icon-location.svg';
import React, { Component } from 'react';
import axios from 'axios';
import LoadingScreen from 'react-loading-screen';
//Leaflet
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const icon = new L.Icon({
  iconUrl: locationIcon,
  iconSize: [46, 56],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76]
});

class App extends Component {

  inputRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      ipData: null,
      ipAddress: '',
      dataObtained: false
    }
    this.getInputIP = this.getInputIP.bind(this);
  }

  getInputIP() {
    let newIP = this.inputRef.current.value;
    this.setState({
      ipAddress: newIP,
      dataObtained: false
    }, () => {
      //actualizar info con nueva IP
      this.getIP();
    });
  }

  componentDidMount() {
    this.getIP();
  }

  async getIP() {
    var url = "http://ip-api.com/json/" + this.state.ipAddress;

    const response = await axios.get(url);
    window.setTimeout(() => this.setState({
      ipData: response.data,
      dataObtained: true
    }, () => {
      console.log("=== FULL RESPONSE ===");
      console.log(response);
      console.log("=== DATA NEEDED ===");
      console.log(this.state.ipData);
      console.log("=== STATUS ===");
      console.log(this.state.ipData.status);
    }), 3000);
  }


  async getIP2() {
    var url = "http://ip-api.com/json/" + this.state.ipAddress;

    const response = await axios.get(url);
    window.setTimeout(() => this.setState({
      ipData: response.data,
      dataObtained: true
    }, () => {
      console.log("=== FULL RESPONSE ===");
      console.log(response);
      console.log("=== DATA NEEDED ===");
      console.log(this.state.ipData);
      console.log("=== STATUS ===");
      console.log(this.state.ipData.status);
    }), 3000);
  }

  renderMainInfo() {
    if (this.state.dataObtained) {
      return <div className="MainContainer">
        {/*header */}
        <header>
          <div className="headerWrapper">
            <h1>IP Address Tracker</h1>
            <div className="inputBox">
              <input type="text" placeholder="Search for any IP address or domain" ref={this.inputRef}></input>
              <div>
                <button onClick={this.getInputIP} title="Search"><img src={arrowIcon} alt="arrow"></img></button>
              </div>
            </div>

            {/*Show ipData*/}
            {this.renderIpInfo()}
          </div>
        </header>
        {/* section */}
        <section>
         {this.renderMapInfo()}
        </section>

        {/* footer */}
        <footer>
          <p>created by <u>FernandoSM123</u> - FrontMentor.io</p>
        </footer>
      </div>
    }
    else {
      return <LoadingScreen
        loading={true}
        bgColor='#f1f1f1'
        spinnerColor='#000000'
        textColor='#000000'
        text='Loading'
      >
      </LoadingScreen>
    }
  }

  renderIpInfo() {
    if (this.state.ipData.status === "success") {
      return <div className="infoBox">
        <div>
          <h2>ip address</h2>
          <p>{this.state.ipData.query}</p>
        </div>

        <div>
          <h2>location<br /></h2>
          <p>
            {this.state.ipData.country},<br />
            {this.state.ipData.regionName},<br />
            {this.state.ipData.city},<br />
            {this.state.ipData.zip}
          </p>
        </div>

        <div>
          <h2>timezone</h2>
          <p>{this.state.ipData.timezone}</p>
        </div>

        <div>
          <h2>isp</h2>
          <p>{this.state.ipData.isp}</p>
        </div>
      </div>
    }
    else {
      return <div className="errorBox">
        <h3>Error</h3>
        <p className="errorText">Message: {this.state.ipData.message}</p>
        <p className="errorText">Query: {this.state.ipData.query}</p>
      </div>
    }
  }

  renderMapInfo() {
    if (this.state.ipData.status === "success") {
      return <MapContainer center={[this.state.ipData.lat, this.state.ipData.lon]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[this.state.ipData.lat, this.state.ipData.lon]} icon={icon}>
          <Popup>
            Current Location
          </Popup>
        </Marker>
      </MapContainer>
    }
    else {
      return <div className="noMapBox">
        <div>
          <h3>No map available to display</h3>
        </div>
      </div>
    }
  }

  render() {

    return (
      <div className="App">
        {this.renderMainInfo()}
      </div>
    )
  }
}

export default App;
