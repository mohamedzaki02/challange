import React from 'react';
import Vehicle from '../vehicle/vehicle'
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';

const customer = props => {


    return (
        <ListGroup.Item disabled>
            <div className="customerDetails">
                <h3>{props.fullName}</h3>
                <p>{props.address}</p>
            </div>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Vehicle ID</th>
                        <th>Register Number</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.vehicles.forEach(veh =>
                            <Vehicle vehicleId={veh.vehicleId} registerNo={veh.registerNo}></Vehicle>
                        )
                    }
                </tbody>
            </Table>
        </ListGroup.Item>
    );

}

export default customer;
