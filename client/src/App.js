import React from 'react';
import './App.css';

import socketIOClient from 'socket.io-client';


function App() {
  
  const socket = socketIOClient(window.location.hostname);
  
  socket.on('connect', function(){
    console.log('Client Connected');
  });

  socket.on('someEvent', function(data){
    console.log(data);
  });
  

  return (
    <div className="App">
        <h3>Client App Is Working Fine</h3>
    </div>
  );
}

export default App;
