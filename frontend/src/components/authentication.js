import {useState} from "react";
import {endpoints} from "../network/endpoints";
import {TextField, Button} from "@material-ui/core";


function BaseLayout({children, title}) {
    return (
        <div style={{width: '100%', height: '100%'}}>
            <section style={{display: 'flex', justifyContent: 'center', height: '40%', width: '100%', background: 'black', paddingBottom: 25}}>
                <h1 style={{alignSelf: 'flex-end', margin: 0, padding: 0, width: '40%', textAlign: 'start', color: 'white', fontWeight: 300, fontSize: 30}}>{title}</h1>
            </section>
            <section style={{display: 'flex', justifyContent: 'center', height: '60%', width: '100%', paddingTop: 25}}>
                <div style={{width: '40%'}}>{children}</div>
            </section>
        </div>
    )
}

export function Login({onAuthenticated}) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const authenticate = () => {
        if (!username || !password) {
            return;
        }
        endpoints.login(username, password).then(() => onAuthenticated(username));
    }
    return (
        <BaseLayout title='Login'>
            <form>
                <div style={{marginBottom: 10}}>
                    <TextField fullWidth variant='filled' label='Username' onChange={e => setUsername(e.target.value)}/>
                </div>
                <div style={{marginBottom: 20}}>
                    <TextField fullWidth variant='filled' label='Password' onChange={e => setPassword(e.target.value)}/>
                </div>
                <div style={{display: 'flex'}}>
                    <Button onClick={authenticate} style={{marginLeft: 'auto'}}>Submit</Button>
                </div>
            </form>
        </BaseLayout>
    )
}