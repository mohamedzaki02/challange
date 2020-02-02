import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Customer from '../components/customer/customer';
import Table from 'react-bootstrap/Table';

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
        {/* {
          this.state.customers.forEach(customer =>
            <Customer name={customer.fullName} address={customer.address}></Customer>
          )
        } */}



        <div>
          <Table responsive="sm">
            <thead>
              <tr>
                <th colSpan="3">
                  <div>
                      <h3>this is a test</h3>
                  </div>
                </th>

              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Table cell</td>
                <td>Table cell</td>

              </tr>
              <tr>
                <td>2</td>
                <td>Table cell</td>
                <td>Table cell</td>

              </tr>
              <tr>
                <td>3</td>
                <td>Table cell</td>
                <td>Table cell</td>

              </tr>
            </tbody>
          </Table>

        </div>














      </div>
    );
  }
}

export default App;
