import React from 'react';
import Alert from 'react-bootstrap/Alert';

const customer = props => {


    return (
        <Alert className="customers">
            <h3>Customer : {props.fullName} </h3>
            <p>address : {props.address}</p>
        </Alert>
    );

}

export default customer;
