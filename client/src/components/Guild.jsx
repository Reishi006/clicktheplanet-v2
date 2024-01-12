import '../main/Main.css';
import { useEffect, useState } from 'react';
import {
} from '../assets/img-import.js';
import axios from 'axios';
import io from 'socket.io-client';

export default function Guild() {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [errData, setErrData] = useState();
    const [input, setInput] = useState('');

    const messagesObj = '';


    const handleInput = (e) => {
        setInput(e.target.value);
        console.log(e.target.value);
      }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(`handleSubmit input: ${input}`);
        try {
            const res = await axios.post('/routes/guild', {input});
            console.log(res.data);
            console.log('Guilds: message sent'+ input);
            setInput('');
        } catch (err) {
            setErrData(err);
        }
    }

    const onLoad = async () => {
        try {
            const res = await axios.get('/routes/guild');

            setMessages(res.data);
            console.log(typeof res.data);

            /* messagesObj = messages.map((row) => {
                return (
                    <div key={row.id}>
                        {row.user}: {row.message} / {new Date(row.date_sent).toString()}
                    </div>
                );
            })
 */
            //console.log(message);

            /* const mappedMessages = messages.map((messages) => {
                <div key={messages.}></div>
            }); */

            const newSocket = io(`http://localhost:8000`);
            setSocket(newSocket);

            console.log(`guild`);

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
                    <div className='guild-chat'>
                        {messages && messages.map((row) => {

                            const date = new Date(row.date_sent);
                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                            const year = date.getFullYear();
                            const hours = String(date.getHours()).padStart(2, '0');
                            const minutes = String(date.getMinutes()).padStart(2, '0');
                        
                            const formattedDate = `${day}.${month}.${year} - ${hours}:${minutes}`;

                            return (
                                <div className='guild-message' key={row.id}>
                                    <div className='guild-message-sent'>
                                        <div className='guild-user'>{row.login}:</div> 
                                        <div className='guild-sent'>{row.message}</div>
                                    </div>
                                    <div className='sent-date'>{formattedDate/* new Date(row.date_sent).toString() */}</div>
                                </div>
                            );
                        })}

                        
                    </div>
                    <div className='guild-input-container'>
                        <form method='post' onSubmit={handleSubmit}>
                            <input className='guild-chat-input' name='input' type='text' value={input} onChange={handleInput} placeholder='Type something'></input>
                            <button type='submit' className='guild-chat-btn' name='submit'>Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}