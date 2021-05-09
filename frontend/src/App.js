import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';


import './App.css';
import {Login} from "./components/authentication";
import {PDFViewer} from "./components/pdf-viewer";
import {useState} from "react";
import {DocumentSpace} from "./components/document-space";
import {prettyDOM} from "@testing-library/react";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import {blue, blueGrey} from "@material-ui/core/colors";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: blueGrey["700"]
        },
        secondary: {
            main: blue['700']
        }
    },
    typography: {
        fontFamily: ['"IBM Plex Sans"', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(', ')
    }
})

function App() {
    const [username, setUsername] = useState(null);
    return (
        <MuiThemeProvider theme={theme}>
            <Router>
                <Route exact path='/'>
                    {() => {
                        if (username) {
                            return <Redirect to={'/pdf'}/>
                        } else {
                            return <Login onAuthenticated={setUsername}/>
                        }
                    }}
                </Route>
                <Route exact path='/pdf'>
                    {
                        () => {
                            if (username) {
                                return <DocumentSpace username={username}/>;
                            } else {
                                return <Redirect to={'/'}/>
                            }
                        }
                    }
                </Route>
            </Router>
        </MuiThemeProvider>
    );
}

export default App;
