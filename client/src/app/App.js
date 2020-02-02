import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import Customer from '../components/customer/customer';

import socketIOClient from 'socket.io-client';


class App extends Component {

  socket = socketIOClient(window.location.hostname);

  state = {
    customers: []
  };

  componentDidMount() {
    this.fetchCustomers();
  }

  async fetchCustomers() {
    const customers = await axios.get('/api/customers');
    this.setState({
      customers: customers.data
    });
  }



  render() {

    this.socket.on('connect', function () {
      console.log('Client Connected');
    });

    this.socket.on('someEvent', function (data) {
      console.log(data);
    });

    return (
      <div className="App">
        <h3>Client App Is Working Fine</h3>
        <Customer></Customer>
      </div>
    );
  }
}

export default App;
