import React from 'react';

const customer = props => {


    return (
        <div className="customers">
            <h3>Customer : {props.fullName} </h3>
            <p>address : {props.address}</p>
        </div>
    );

}

export default customer;
