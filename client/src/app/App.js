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

  async fetchCustomerVehicles(vehicleStatus, customerId) {
    let queryParams = {};
    if (customerId) queryParams.customerId = customerId;
    if (vehicleStatus) queryParams.vehicleStatus = vehicleStatus;
    let customers = await axios.post('/api/customers', queryParams);
    let vehicles = await axios.post('/api/vehicles', queryParams);
    customers = customers.data.map(cust => {
      cust.vehicles = vehicles.data.filter(v => v.customerid == cust.customerid)
      return cust;
    });
    this.setState({
      customers: customers,
      customerId: customerId,
      vehicleStatus: vehicleStatus
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
      $('#' + data.vehicleId + '_lbl_status').text('60');
      if (!counterInterval) {
        let counterInterval = setInterval(() => {
          let _counter = $('#' + data.vehicleId + '_lbl_status');
          let counterVal = _counter.text();
          if (!counterVal) _counter.text('00');
          else {
            let newCounterVal = Number(_counter.text()) - 1;
            _counter.text(newCounterVal < 10 ? ('0' + newCounterVal) : newCounterVal);
          }
        }, 1000);
      }
    });

    let selectedCustomerVal = this.state.customers && this.state.customerId ? this.state.customers.filter(c => c.customerid == this.state.customerId)[0].fullname : 'Customers List';

    return (
      <div className="App">
        <h3>Challange Demo</h3>




        <div>
          <div className="filters">
            <DropdownButton id="customersDDL" size="sm" className="mt-3"
              title={selectedCustomerVal} variant="info"
              key="customersDDL"
            >
              {
                this.state.customers.map(cust =>
                  <Dropdown.Item eventKey={cust.customerid}
                    onClick={this.fetchCustomerVehicles.bind(this, this.state.vehicleStatus, cust.customerid)}>
                    {cust.fullname}
                  </Dropdown.Item>
                )
              }
              <Dropdown.Divider />
              <Dropdown.Item eventKey="basic" onClick={this.fetchCustomerVehicles.bind(this, this.state.vehicleStatus, null)} active>ALL</Dropdown.Item>
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
                this.state.customers.map(customer =>
                  <Customer name={customer.fullname} address={customer.address} vehicles={customer.vehicles}></Customer>
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
