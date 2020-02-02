import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
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
    const vehicles = await axios.post('/api/vehicles');
    customers = customers.data.map(cust => cust.vehicles = vehicles.filter(v => v.customerId == cust.customerId));
    this.setState({
      customers: customers
    });
  }



  render() {

    this.socket.on('connect', function () {
      console.log('Client Connected');
    });

    this.socket.on('vehicle_connected', function (data) {
      console.log(data);
      $('#' + data.vehicleId + '_btn_status').css({ 'background-color': 'green' });
    });

    return (
      <div className="App">
        <h3>Client App Is Working Fine</h3>




        <div>
          <ListGroup>
            <ListGroup.Item disabled>
              {
                this.state.customers.forEach(customer =>
                  <Customer name={customer.fullName} address={customer.address} vehicles={this.props.vehicles}></Customer>
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
