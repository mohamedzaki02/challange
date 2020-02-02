import React from 'react';
import Badge from 'react-bootstrap/Badge';



const vehicle = props => {
    return (
        <tr>
            <td>#{props.vehicleId}</td>
            <td>{props.registerNo}</td>
            <td>
                <Badge id={props.vehicleId + '_btn_status'} variant="danger">Disconnected</Badge>
            </td>
        </tr>
    );
}


export default vehicle;