import React, { Component } from 'react';
import ImageDisplay from './components/ImageDisplay/ImageDisplay';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Hashtag from './components/Hashtag/Hashtag';
import './App.css';

const defaultImage = 'https://st.ilfattoquotidiano.it/wp-content/uploads/2018/03/03/instagram275.jpg'

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: defaultImage,
      hashtags: [],
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
    this.setState({hashtags: []});
    (event.target.value.match(/\.(jpg|jpeg|png|gif)$/i))
    ? this.setState({imageUrl: event.target.value})
    : this.setState({imageUrl: defaultImage})
  }

  onButtonSubmit = () => {
    fetch('/.netlify/functions/gethashtags', {
      method: 'POST',
      headers: {Accept: 'application/json',
                'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    }).then(response => response.json())
      .then(response => {
        this.setState({hashtags: response['outputs'][0]['data']['concepts'].map(concept => `#${concept.name.toLowerCase().replace(" ", "").replace("(", "").replace(")", "")}`)})
      })
      .catch(err => console.log(err));
  }

  render() {
    const { imageUrl, hashtags } = this.state;
    return (
      <div className="App">
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        <ImageDisplay imageUrl={imageUrl} />
        <Hashtag hashtags={hashtags} />        
      </div>
    );
  }
}

export default App;