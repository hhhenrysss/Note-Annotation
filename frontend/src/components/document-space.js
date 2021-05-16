import {useEffect, useState} from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Dialog, FormControl, FormControlLabel,
    FormLabel,
    IconButton, Radio,
    RadioGroup,
    TextField
} from "@material-ui/core";
import {blue} from "@material-ui/core/colors";
import {endpoints} from "../network/endpoints";
import {useHistory} from 'react-router-dom';
import {AddOutlined} from "@material-ui/icons";
import { v4 as uuidv4 } from 'uuid';

function DocumentAdd({onAdd, username}) {
    const [doc, setDoc] = useState({})
    const onChange = (e, key) => {
        setDoc(old => ({...old, [key]: e.target.value}));
    }
    const onSubmit = () => {
        const newDoc = {...doc};
        newDoc.creationDate = Date.now()
        newDoc.lastUpdatedDate = Date.now()
        newDoc.author = username;
        newDoc.id = `document-${uuidv4().toString()}`
        onAdd(newDoc)
    }
    return (
        <div style={{padding: 15, minWidth: 300}}>
            <h1 style={{fontWeight: 500, fontSize: 20}}>Add New Document</h1>
            <form>
                <div style={{marginBottom: 10}}>
                    <TextField fullWidth label='Document name' value={doc.name} onChange={e => onChange(e, 'name')}/>
                </div>
                <div style={{marginBottom: 20}}>
                    <TextField fullWidth label='Url' value={doc.url} onChange={e => onChange(e, 'url')}/>
                </div>
                <div style={{marginBottom: 20}}>
                    <FormControl fullWidth component="fieldset">
                        <FormLabel component="legend">Role</FormLabel>
                        <RadioGroup style={{display: "flex", flexDirection: 'row'}} aria-label="gender" name="access-level" value={doc.access} onChange={e => onChange(e, 'access')}>
                            <FormControlLabel value="private" control={<Radio />} label='Private' />
                            <FormControlLabel value="public" control={<Radio />} label='Public' />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div style={{display: 'flex'}}>
                    <Button style={{marginLeft: "auto", marginRight: 0}} onClick={onSubmit}>Submit</Button>
                </div>
            </form>
        </div>
    )
}

function AppHeader({username, onAddDocument}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const onAdd = doc => {
        setIsDialogOpen(false);
        onAddDocument(doc)
    }
    return (
        <>
            <div style={{background: 'black', width: '100%', display: 'flex', alignItems: 'center', height: 48}}>
                <h2 style={{color: 'white', fontSize: 18, padding: '5px 15px', margin: 0, fontWeight: 500}}>All Documents</h2>
                <IconButton style={{marginLeft: 'auto'}} onClick={() => setIsDialogOpen(true)}><AddOutlined style={{color: 'white'}}/></IconButton>
                <Button onClick={() => window.location.reload()} style={{ color: '#fff1ff', textTransform: 'none', background: blue['700'], height: '100%', borderRadius: 0}}>{username}</Button>
            </div>
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DocumentAdd onAdd={onAdd} username={username}/>
            </Dialog>
        </>
    )
}

function DocumentCard({info, existingDocInfo}) {
    const history = useHistory();
    const onNavigate = () => {
        history.push(`/pdf/${info.id}`, {selectedDoc: info, existingDocInfo})
    }
    return (
        <Card style={{display: "flex", flexDirection: 'column', justifyContent: "space-between", minHeight: 220}}>
            <CardContent>
                <h3 style={{fontWeight: 300, margin: 0, marginBottom: 10}}>{info.name}</h3>
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
        endpoints.getDocuments(username).then(setDocuments);
    }, []);
    const onAddDocument = doc => {
        endpoints.createDocument(doc).then(addedDoc => setDocuments(old => [...old, addedDoc]));
    }
    return (
        <div style={{width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column'}}>
            <AppHeader username={username} onAddDocument={onAddDocument}/>
            <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridGap: 15, padding: 15}}>
                {documents.map(d => <DocumentCard key={d.id} info={d} existingDocInfo={documents.map(({name, id}) => ({name, id}))}/>)}
            </div>
        </div>
    )
}