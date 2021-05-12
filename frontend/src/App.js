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
    const [user, setUser] = useState({});
    return (
        <MuiThemeProvider theme={theme}>
            <Router>
                <ProtectedRoute username={user.username} path={'/'} defined={<Redirect to={'/pdfs'}/>}
                                notDefined={<Login onAuthenticated={setUser}/>}/>
                <ProtectedRoute username={user.username} path={'/register'} defined={<Redirect to={'/pdfs'}/>}
                                notDefined={<Register onAuthenticated={setUser}/>}/>
                <ProtectedRoute username={user.username} path={'/pdfs'} defined={<DocumentSpace username={user.username}/>}
                                notDefined={<Redirect to={'/'}/>}/>
                <ProtectedRoute username={user.username} path={'/pdf'} defined={<DocumentViewer username={user.username}/>}
                                notDefined={<Redirect to={'/'}/>}/>
            </Router>
        </MuiThemeProvider>
    );
}

export default App;
