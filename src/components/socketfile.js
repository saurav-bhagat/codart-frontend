import openSocket from 'socket.io-client';
const socket = openSocket('http://192.168.137.1:3000');



function listenToQuestion(cb) {
    socket.on('connect',()=>{
        socket.emit('join',localStorage.getItem('token'), (res)=>{
            console.log(res);
        });
    });
    socket.on('question', question => cb(question))
}

export { listenToQuestion,  };
