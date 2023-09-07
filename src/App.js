import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import Chat from './Chat';

const socket = io.connect('https://socket-backend-manishya1669.onrender.com');

function App() {
  const [userName, setUserName] = useState('');
  const [room, setRoom] = useState('');
  const [show, setShow] = useState(false);

  const JoinRoom = () => {
    if (userName !== '' && room !== '') {
      socket.emit('join_room', room);
      setShow(true);
      console.log('Join room sent to server');
    } else {
      alert('Field is required!');
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col justify-center items-center">
      <div className="bg-black bg-opacity-30 p-2 rounded-lg shadow-lg text-center w-[50%] xs:w-[50%]  sm:w-[50%]  md:w-[50%] lg:w-[30%] ">
        {show === false ? (
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-4">Join the room!</h1>
            <div className="flex flex-col items-center">

              <div>
                <input
                  className="bg-gray-700 m-4 p-3 rounded-md mb-2"
                  placeholder="UserName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <input
                  className="bg-gray-700 m-4  p-3 rounded-md mb-4"
                  placeholder="RoomId"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>

              <div>
                <button
                  className="text-xl font-bold bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                  onClick={JoinRoom}
                >
                  Let's Join
                </button>
              </div>

            </div>

          </div>
        ) : (
          <Chat socket={socket} userName={userName} room={room} />
        )}
        <div>
          {show === true ? (
            <button
              className="text-xl font-bold bg-red-600 hover:bg-red-600 py-2 px-4 rounded-md text-white "
              onClick={(e) => setShow(false)}
            >
              Leave!
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
