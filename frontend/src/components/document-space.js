import {useEffect, useState} from "react";
import {Button, Card, CardActions, CardContent} from "@material-ui/core";
import {blue} from "@material-ui/core/colors";
import {endpoints} from "../network/endpoints";
import {useHistory} from 'react-router-dom';

function AppHeader({username}) {
    return (
        <>
            <div style={{background: 'black', width: '100%', display: 'flex', alignItems: 'center'}}>
                <h2 style={{color: 'white', fontSize: 18, padding: '5px 15px', margin: 0, fontWeight: 500}}>All Documents</h2>
                <Button style={{ marginLeft: 'auto', color: '#fff1ff', textTransform: 'none', background: blue['700'], height: '100%', borderRadius: 0}}>{username}</Button>
            </div>
        </>
    )
}

function DocumentCard({info}) {
    const history = useHistory();
    const onNavigate = () => {
        history.push('/pdf', info)
    }
    return (
        <Card>
            <CardContent>
                <h2 style={{fontWeight: 300, margin: 0, marginBottom: 10}}>{info.name}</h2>
                <p style={{margin: 0, color: "gray"}}>Uploaded by {info.author}</p>
            </CardContent>
            <CardActions>
                <Button onClick={onNavigate}>View Document</Button>
            </CardActions>
        </Card>
    )
}

export function DocumentSpace({username}) {
    const [documents, setDocuments] = useState([]);
    useEffect(() => {
        endpoints.getDocuments().then(setDocuments);
    }, []);
    return (
        <div style={{width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column'}}>
            <AppHeader username={username}/>
            <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                {documents.map(d => <DocumentCard key={d.id} info={d}/>)}
            </div>
        </div>
    )
}