import '../main/Main.css';
import { useEffect, useState, useRef } from 'react';
import {
} from '../assets/img-import.js';
import axios from 'axios';
import io from 'socket.io-client';

export default function Guild() {
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [errData, setErrData] = useState();
    const [input, setInput] = useState('');



    const handleInput = (e) => {
        setInput(e.target.value);
        console.log(e.target.value);
      }

    let newMessage = '';
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(`handleSubmit input: ${input}`);
        try {
            if (input !== '') {
                const res = await axios.post('/routes/guild', {input});
                console.log(res.data[0].user);
                console.log('Guilds: message sent'+ input);


                socket.emit('inputsubmit', {input: input, id: res.data[0].user});
                console.log(res.data[0].user);
                
                socket.once('receiveinputsubmit', function(data) {

                    newMessage = data;
                    console.log(`newMessage: ${newMessage} data ${data}`);
                    setMessages(prevMessages => [...prevMessages, newMessage]);
                });
                
            }

            setInput('');
        } catch (err) {
            setErrData(err);
            console.log(err);
        }
    }

    const scrollToBottom = () => { messagesEndRef.current?.scrollTo(0, messagesEndRef.current?.scrollHeight); };
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const onLoad = async () => {
        try {
            const res = await axios.get('/routes/guild');

            setMessages(res.data);
            console.log(`messages: ${res.data}`);

            const newSocket = io(`http://localhost:8000`);
            setSocket(newSocket);

            return () => newSocket.close();


        } catch (error) {
            console.log('/guild error' + error);
        }
    }

    useEffect(() => {
    onLoad();
    }, []);

    return (
        <>
            <div className='menu-container'>
                <div className='title'>Guild</div>
                <div className='guild-container'>
                    <div className='guild-chat' ref={messagesEndRef}>
                        {Array.isArray(messages) && messages.map((row) => {

                            const date = new Date(row.date_sent);
                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                            const year = date.getFullYear();
                            const hours = String(date.getHours()).padStart(2, '0');
                            const minutes = String(date.getMinutes()).padStart(2, '0');
                        
                            const formattedDate = `${day}.${month}.${year} - ${hours}:${minutes}`;


                            return (
                                <div className='guild-message' key={row.id}>
                                    <div className='guild-message-upper'>
                                        <div className='guild-user'>{row.login}:</div>
                                        <div className='sent-date'>{formattedDate/* new Date(row.date_sent).toString() */}</div>
                                    </div>
                                    <div className='guild-message-sent'>
                                        <div className='guild-sent'>{row.message}</div>
                                    </div>
                                </div>
                            );
                        })}
                        <div />      
                    </div>
                    <div className='guild-input-container'>
                        <form method='post' autoComplete="off" onSubmit={handleSubmit}>
                            <input className='guild-chat-input' name='input' type='text' value={input} onChange={handleInput} placeholder='Type something'></input>
                            <button type='submit' className='guild-chat-btn' name='submit'>Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}