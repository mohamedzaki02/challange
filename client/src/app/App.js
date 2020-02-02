import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Customer from '../components/customer/customer';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import socketIOClient from 'socket.io-client';


class App extends Component {

  socket = socketIOClient(window.location.hostname);

  state = {
    customers: [],
    customerId: null,
    vehicleStatus: null
  };

  componentDidMount() {
    this.fetchCustomerVehicles();
  }

  async fetchCustomerVehicles(customerId, vehicleStatus) {
    let queryParams = {};
    if (customerId) queryParams.customerId = customerId;
    if (vehicleStatus) queryParams.vehicleStatus = vehicleStatus;
    let customers = await axios.post('/api/customers', queryParams);
    let vehicles = await axios.post('/api/vehicles', queryParams);
    customers = customers.data.map(cust => cust.vehicles = vehicles.data.filter(v => v.customerId == cust.customerId));
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
      $('#' + data.vehicleId + '_btn_status').text('Connected');
    });

    return (
      <div className="App">
        <h3>Challange Demo</h3>




        <div>
          <div className="filters">
            <DropdownButton id="customersDDL" size="sm" className="mt-3" title="Customers List" variant="info"
              key="customersDDL"
            >
              {
                this.state.customers.forEach(cust =>
                  <Dropdown.Item eventKey={cust.customerId}
                    onClick={this.fetchCustomerVehicles.bind(this, this.state.vehicleStatus, cust.customerId)}>
                    {cust.fullName}</Dropdown.Item>
                )
              }
              <Dropdown.Divider />
              <Dropdown.Item eventKey="basic" active>ALL</Dropdown.Item>
            </DropdownButton>

            <ButtonGroup id="vstatus" aria-label="Vehicle Status" size="sm" className="mt-3">
              <Button onClick={this.fetchCustomerVehicles.bind(this, 'connected', this.state.customerId)} variant="success">connected</Button>
              <Button onClick={this.fetchCustomerVehicles.bind(this, null, this.state.customerId)} variant="warning" active>All</Button>
              <Button onClick={this.fetchCustomerVehicles.bind(this, 'disConnected', this.state.customerId)} variant="danger">Disconnected</Button>
            </ButtonGroup>


          </div>


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
