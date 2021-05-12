import {useState} from "react";
import {endpoints} from "../network/endpoints";
import {TextField, Button, FormLabel, RadioGroup, FormControlLabel, Radio, FormControl} from "@material-ui/core";
import {useHistory} from "react-router-dom";


function BaseLayout({children, title, onRegisterClick}) {
    return (
        <div style={{width: '100%', height: '100%'}}>
            <section style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', height: 'calc(40% - 25px)', width: '100%', background: 'black', paddingBottom: 25}}>
                <div style={{width: '40%', display: 'flex', flexDirection: 'row'}}>
                    <h1 style={{alignSelf: 'flex-end', margin: 0, padding: 0, textAlign: 'start', color: 'white', fontWeight: 300, fontSize: 40}}>{title}</h1>
                    {onRegisterClick && (<Button onClick={onRegisterClick} style={{alignSelf: 'flex-end', marginLeft: "auto", color: 'white'}}>Register</Button>)}
                </div>
            </section>
            <section style={{display: 'flex', justifyContent: 'center', height: 'calc(60% - 25px)', width: '100%', paddingTop: 25}}>
                <div style={{width: '40%'}}>{children}</div>
            </section>
        </div>
    )
}

export function Login({onAuthenticated}) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const history = useHistory();

    const authenticate = () => {
        if (!username || !password) {
            return;
        }
        endpoints.login(username, password).then(() => onAuthenticated(username));
    }
    return (
        <BaseLayout title='Login' onRegisterClick={() => history.push('/register')}>
            <form>
                <div style={{marginBottom: 10}}>
                    <TextField fullWidth variant='filled' label='Username' onChange={e => setUsername(e.target.value)}/>
                </div>
                <div style={{marginBottom: 20}}>
                    <TextField type='password' fullWidth variant='filled' label='Password' onChange={e => setPassword(e.target.value)}/>
                </div>
                <div style={{display: 'flex'}}>
                    <Button onClick={authenticate} style={{marginLeft: 'auto'}}>Submit</Button>
                </div>
            </form>
        </BaseLayout>
    )
}

export function Register({onAuthenticated}) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [role, setRole] = useState('student');
    const authenticate = () => {
        if (!username || !password || !role) {
            return;
        }
        endpoints.register(username, password, role).then(() => onAuthenticated(username));
    }
    return (
        <BaseLayout title='Register'>
            <form>
                <div style={{marginBottom: 10}}>
                    <TextField fullWidth variant='filled' label='Username' onChange={e => setUsername(e.target.value)}/>
                </div>
                <div style={{marginBottom: 20}}>
                    <TextField type='password' fullWidth variant='filled' label='Password' onChange={e => setPassword(e.target.value)}/>
                </div>
                <div style={{marginBottom: 20}}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Role</FormLabel>
                        <RadioGroup style={{display: "flex", flexDirection: 'row'}} aria-label="gender" name="access-level" value={role} onChange={e => setRole(e.target.value)}>
                            <FormControlLabel value="instructor" control={<Radio />} label='Instructor' />
                            <FormControlLabel value="student" control={<Radio />} label='Student' />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div style={{display: 'flex'}}>
                    <Button onClick={authenticate} style={{marginLeft: 'auto'}}>Submit</Button>
                </div>
            </form>
        </BaseLayout>
    )
}