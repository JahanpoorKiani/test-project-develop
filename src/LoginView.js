import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Text, Font, View, Document, StyleSheet } from '@react-pdf/renderer';
import {useEffect, useState} from "react";
import axios from 'axios';


const LoginView = () => {
    const navigate = useNavigate();
    const handleClick = () => navigate('/MapView');

    const [data, setData] = useState({
        username: "",
        password: ""
    });


    let [token, setToken] = React.useState('');

    useEffect(() => {
        localStorage.setItem('tokenKey', JSON.stringify(token));
    }, [token]);


    const handleChange = (e) => {
        const value = e.target.value;
        setData({
            ...data,
            [e.target.name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            username: data.username,
            password: data.password
        };
        axios.post("https://exam.pishgamanasia.com/webapi/Account/Login", userData).then((response) => {
            console.log(response.status, response.data);

            setToken(response.data.data.userToken)
            handleClick()
        });
    };

    return (
        <div className="App">
            <header className="Login-min-view" >

                <Text style={styles.label}>
                    {/*ورود*/}
                    {localStorage.getItem('tokenKey')}
                </Text>

                <form onSubmit={handleSubmit}>
                    <p style={styles.p}>نام کاربری: </p>
                    <label htmlFor="username" inputMode={"text"} style={{color: 'red'}}>

                        <input
                            type="text"
                            name="username"
                            value={data.name}
                            onChange={handleChange}
                            style={styles.inputField}
                        />
                    </label>
                    <p style={styles.p}>کلمه عبور: </p>
                    <label htmlFor="password" inputMode={"text"}>

                        <input
                            type="text"
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                            style={styles.inputField}
                        />
                    </label>
                </form>

                <button  type="button" onClick={handleSubmit} style={styles.button}>
                    <Text >
                        {'ورود'}
                    </Text>
                </button>

            </header>
        </div>
    );
};

export default LoginView;

const styles = StyleSheet.create({
    label: {
        marginTop: 30,
        marginBottom: 10,
        color: 'black'
    },
    p: {
        width: 200,
        fontSize: 20,
        color: '#CCCCCC'
    },
    button: {
        width: 360,
        height: 50,
        marginTop: 30,
        marginBottom: 30,
        borderRadius: 30,
        fontSize: 28,
        background: 'yellow',
    },
    inputField: {
        height: 40,
        width: 350,
        fontSize: 24,
        borderRadius: 30,
        background: 'lightblue',
    }
});
