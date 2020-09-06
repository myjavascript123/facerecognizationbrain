import Particles from 'react-particles-js';
import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import 'tachyons'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'

import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'
import url from './const'



const particlesOption = {
  particles: {
    number: {
      value: 300,
      density: {
        enabled: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  IsSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: '',
    joined: ''
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  loadUser = (data) => {
    console.log('loadUser', data);
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => { 
    console.log('calculateFaceLocation' + data.outputs[0].data.regions[0]);
    const calarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return {
      leftCol: calarifaiFace.left_col * width,
      topRow: calarifaiFace.top_row * height,
      rightCol: width - (width * calarifaiFace.right_col),
      bottomRow: height - (height * calarifaiFace.bottom_row)
    }
  }

  displayFaceBox = (data) => {
    console.log(data);
    this.setState({ box: data });
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ IsSignedIn: true });
    }
    this.setState({ route: route });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    // "https://samples.clarifai.com/face-det.jpg"

    fetch(`${url}/imageurl`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: this.state.input
          })
      })
        .then( res => res.json() )
        .then( response => {
          console.log(response)
          fetch(`${url}/image`, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(res => { return res.json() })
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log)
          this.displayFaceBox(this.calculateFaceLocation(response))
        })
        .catch(err => console.log(err));
  }

  render() {
    const { IsSignedIn, route, imageUrl, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOption} />
        <Navigation onRouteChange={this.onRouteChange} IsSignedIn={IsSignedIn} />
        {
          route === 'home'
            ? <div>
              <Logo />
              <Rank name={this.state.user.name} rank={this.state.user.entries} />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition imageUrl={imageUrl} box={box} />
            </div>
            : (route === 'signin'
              ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
              : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />)
        }
      </div>
    );
  }
}

export default App;
