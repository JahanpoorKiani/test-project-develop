import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Text, Font, View, Document, StyleSheet } from '@react-pdf/renderer';
import {useEffect, useState} from "react";
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";


const LoginView = () => {
    const navigate = useNavigate();
    const handleClick = () => navigate('/MapView');

    const [data, setData] = useState({
        username: "",
        password: ""
    });


    let [token, setToken] = React.useState('');

    useEffect(() => {
        getStorage()
    }, []);

    const getStorage = () => {
        setData({
            username: localStorage.getItem('usernameKey'),
            password: '' //localStorage.getItem('passwordKey')
        })
    }

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

            localStorage.setItem('usernameKey', data.username);
            // localStorage.setItem('passwordKey', data.password);

            secureLocalStorage.setItem('tokenKey', response.data.data.userToken);
        });
    };

    return (
        <div className="App">
            <header className="Login-min-view" >

                <Text style={styles.label}>
                    ورود
                </Text>

                <form onSubmit={handleSubmit}>
                    <p style={styles.p}>نام کاربری: </p>
                    <label htmlFor="username" inputMode={"text"} style={{color: 'red'}}>

                        <input
                            type="text"
                            name="username"
                            value={data.username}
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
        height: 20,
        marginTop: 30,
        marginBottom: 0,
        color: 'black'
    },
    p: {
        height: 20,
        width: 200,
        fontSize: 16,
        color: '#CCCCCC'
    },
    inputField: {
        height: 40,
        width: 350,
        fontSize: 24,
        borderRadius: 30,
        background: '#BBDEFB',
    },
    button: {
        width: 360,
        height: 50,
        marginTop: 20,
        marginBottom: 40,
        borderRadius: 30,
        fontSize: 28,
        background: '#FBC02D',
    }
});
