import * as React from 'react';
import { useNavigate } from 'react-router-dom';
// import {TextField} from '@adobe/react-spectrum'
import Flex from '@react-css/flex'
import { Page, Text, Font, View, Document, StyleSheet } from '@react-pdf/renderer';

import TextField from "@material-ui/core/TextField";

import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";
import {createMuiTheme} from "@material-ui/core";
import createTheme from "@material-ui/core/styles/createTheme";
import styled from "@material-ui/core/styles/styled";

const StyledTextField = styled(TextField)({
    "& label": {
        left: "unset",
        right: "1.75rem",
        transformOrigin: "right",
        fontSize: "0.8rem",
    },
    "& legend": {
        textAlign: "right",
        fontSize: "0.6rem",
    },
});

const theme = createTheme({
    typography: {
        allVariants: {
            fontFamily: 'IRANSansWeb',
            textTransform: 'none',
            fontSize: 16,
        },
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiFilledInput-root": {
            backgroundColor: "rgb(232, 241, 250)"
        },
        "& .MuiFilledInput-root:hover": {
            backgroundColor: "rgb(250, 232, 241)",
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": {
                backgroundColor: "rgb(232, 241, 250)"
            }
        },
        "& .MuiFilledInput-root.Mui-focused": {
            backgroundColor: "rgb(250, 241, 232)"
        }
    }
}));



const LoginView = () => {
    const navigate = useNavigate();
    const handleClick = () => navigate('/MapView');

    let [text, setText] = React.useState('');
    let [password, setPassword] = React.useState('');


    return (
        <div className="App">
            <header className="App-header">

                <Text style={styles.label}>
                    {'ورود'}
                </Text>

                <StyledTextField
                    fontSize={"50rem"}
                    variant="filled"
                    style={styles.textField}
                    alignSelf={'center'}
                    textAlign={'center'}
                    justifySelf={'flex-end'}
                    height={100}
                    marginBottom={10}
                    onChange={setText}
                    label="نام کاربری"
                    type={'text'}/>

                <StyledTextField
                    variant="filled"
                    style={styles.textField}
                    alignSelf={'center'}
                    height={100}
                    marginBottom={30}
                    onChange={setPassword}
                    label="کلمه عبور"
                    type={'password'}/>

                <button  type="button" onClick={handleClick} style={styles.button}>
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
        marginBottom: 30
    },
    textField: {
        width: 360,
        borderRadius: 30,
        paddingRight: 0,
        marginBottom: 30,
        background: 'lightblue',
        fontFamily: "IRANSansWeb",
        fontSize: 50
    },
    button: {
        width: 180,
        height: 50,
        fontSize: 18,
        background: 'yellow',
    },
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 10
    }
});
