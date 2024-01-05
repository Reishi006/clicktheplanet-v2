import '../App/App.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Unauthorized() {
    const [error, setError] = useState();

    //const navigate = useNavigate();

    const onLogin = async () => {
        try {
            await axios.get('/routes/main');

        } catch (error) {
            setError(error.message);
            return console.log(error);
        }
    }

    useEffect(() => {
        onLogin();
    }, []);

    return (
    <>
        <div className='big-container'>
            <h1>Unauthorized</h1>
            <h3>Please login, session might have expired</h3>
            <h2 className='error'>{error}</h2>
            <h3>Go back to the <Link to='/'>main page</Link></h3>
        </div>
    </>
    );
}

export default Unauthorized;
