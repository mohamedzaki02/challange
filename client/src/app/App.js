import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Customer from '../components/customer/customer';
import Table from 'react-bootstrap/Table';
import ListGroup from 'react-bootstrap/ListGroup';

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
    const customers = await axios.post('/api/customers');
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




        <div>
          <ListGroup>
            <ListGroup.Item disabled>
              {
                this.state.customers.forEach(customer =>
                  <Customer name={customer.fullName} address={customer.address}></Customer>
                )
              }
            </ListGroup.Item>
          </ListGroup>
        </div>



      </div>
    );
  }
}

export default App;
