import '../main/Main.css';
import { useEffect, useState, useRef } from 'react';
import {
    x, tick,
} from '../assets/img-import.js';
import axios from 'axios';
import io from 'socket.io-client';

export default function Notifications({ toggleNotifications }) {
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [errData, setErrData] = useState();
    const [input, setInput] = useState('');

    let newMessage = '';
    
    /* const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(`handleSubmit input: ${input}`);
        try {
            if (input !== '') {
                const res = await axios.post('/routes/guild', {input});
                console.log(res.data);
                console.log('Guilds: message sent'+ input);


                socket.emit('inputsubmit', input);
                
                socket.once('receiveinputsubmit', function(data) {

                    newMessage = data;
                    console.log(`newMessage: ${newMessage} data ${data}`);
                    setMessages(prevMessages => [...prevMessages, newMessage]);
                });
                
            }

            setInput('');
        } catch (err) {
            setErrData(err);
        }
    } */

    const handleReject = async (guild_id) => {
        try {
            console.log(guild_id);

            const res = await axios.post(`/routes/notifications`, {guild_id});

            setMessages(res.data);
            console.log(`notifications delete: ${res.data}`);

        } catch (error) {
            console.log('/notifications delete error' + error);
        }
    }

    const handleAccept = async (guild_id) => {
        try {
            const res = await axios.post(`/routes/notifications`, {guild_id});

            setMessages(res.data);
            console.log(`notifications accept: ${res.data}`);


        } catch (error) {
            console.log('/notifications delete error' + error);
        }
    }

    const scrollToBottom = () => { messagesEndRef.current?.scrollTo(0, messagesEndRef.current?.scrollHeight); };
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const onLoad = async () => {
        try {
            const res = await axios.get('/routes/notifications');

            setMessages(res.data);

            const newSocket = io(`http://localhost:8000`);
            setSocket(newSocket);

            return () => newSocket.close();


        } catch (error) {
            console.log('/notifications error' + error);
        }
    }

    useEffect(() => {
    onLoad();
    }, []);

    useEffect(() => {
        //console.log(messages[0].guild_id)
    }, [messages]);

    return (
            <div className='notifications-container'>
                <div className='notifications-title'>Notifications</div>
                <div className='notifications-messages' ref={messagesEndRef}>
                {Array.isArray(messages) && messages.map((row) => {
                    return (
                        <div className='notifications-message' key={row.id}>
                        <div className='notifications-message-text'>Guild Invitation: {row.name}</div>
                        <div>
                            <img src={x} className='notifications-message-action' onClick={() => handleReject(row.guild_id)} alt='close'></img>
                            <img src={tick} className='notifications-message-action' onClick={() => handleAccept(row.guild_id)} alt='apply'></img>
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>
    )
}