import {BrowserRouter as Router, Redirect, Route} from 'react-router-dom';


import './App.css';
import {Login, Register} from "./components/authentication";
import {useState} from "react";
import {DocumentSpace} from "./components/document-space";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import {blue, blueGrey} from "@material-ui/core/colors";
import {DocumentViewer} from "./components/document-viewer";

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

function ProtectedRoute({username, path, defined, notDefined}) {
    return (
        <Route exact path={path}>
            {username ? (defined) : (notDefined)}
        </Route>
    )
}

function App() {
    const [username, setUsername] = useState(null);
    return (
        <MuiThemeProvider theme={theme}>
            <Router>
                <ProtectedRoute username={username} path={'/'} defined={<Redirect to={'/pdfs'}/>}
                                notDefined={<Login onAuthenticated={setUsername}/>}/>
                <ProtectedRoute username={username} path={'/register'} defined={<Redirect to={'/pdfs'}/>}
                                notDefined={<Register onAuthenticated={setUsername}/>}/>
                <ProtectedRoute username={username} path={'/pdfs'} defined={<DocumentSpace username={username}/>}
                                notDefined={<Redirect to={'/'}/>}/>
                <ProtectedRoute username={username} path={'/pdf'} defined={<DocumentViewer username={username}/>}
                                notDefined={<Redirect to={'/'}/>}/>
            </Router>
        </MuiThemeProvider>
    );
}

export default App;
