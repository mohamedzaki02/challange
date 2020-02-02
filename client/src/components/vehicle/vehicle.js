import React from 'react';
import Badge from 'react-bootstrap/Badge';



const vehicle = props => {
    return (
        <tr>
            <td>#{props.vehicleid}</td>
            <td>{props.registerno}</td>
            <td>
                <Badge id={props.vehicleid + '_btn_status'} variant="danger">Disconnected</Badge>
                <label id={props.vehicleid + '_lbl_status'} className="lblStatus"></label>
            </td>
        </tr>
    );
}


export default vehicle;