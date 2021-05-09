import {AppBar, Button, Dialog, IconButton, TextField, Toolbar} from "@material-ui/core";
import {PDFViewer} from "./pdf-viewer";
import {useEffect, useState} from "react";
import {endpoints} from "../network/endpoints";
import {CommentDisplay} from "./comment-display";
import {InfoOutlined} from "@material-ui/icons";
import {blue} from "@material-ui/core/colors";

function AppHeader({username, document, onUpdateDocument}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <>
            <div style={{background: 'black', width: '100%', display: 'flex', alignItems: 'center'}}>
                <h2 style={{color: 'white', fontSize: 18, padding: '5px 15px', margin: 0, fontWeight: 500}}>Document View</h2>
                <IconButton style={{marginLeft: 'auto'}} onClick={() => setIsDialogOpen(true)}><InfoOutlined style={{color: 'white'}}/></IconButton>
                <Button style={{ color: '#fff1ff', textTransform: 'none', background: blue['700'], height: '100%', borderRadius: 0}}>{username}</Button>
            </div>
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DocumentInfo info={document} onUpdateInfo={onUpdateDocument}/>
            </Dialog>
        </>
    )
}

function DocumentInfo({info, onUpdateInfo}) {
    const [mode, setMode] = useState(null);
    const [documentName, setDocumentName] = useState(info.name);
    const onEdit = async () => {
        if (mode === 'edit') {
            const result = await endpoints.modifyDocument({name: documentName, id: info.id});
            if (result) {
                setMode(false);
                onUpdateInfo(result);
            }
        } else {
            setMode('edit');
        }
    }
    return (
        <div style={{padding: 10, width: 400}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <h1 style={{fontSize: 25, fontWeight: 500}}>Document Info</h1>
                <Button style={{marginLeft: 'auto'}} onClick={onEdit}>{mode === 'edit' ? 'Done' : 'Edit'}</Button>
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <p style={{width: 150}}><strong>Document Name</strong></p>
                {mode === 'edit' ? <TextField value={documentName} onChange={e => setDocumentName(e.target.value)}/> : <p>{documentName}</p>}
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <p style={{width: 150}}><strong>Author</strong></p>
                <p>{info.author}</p>
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <p style={{width: 150}}><strong>Creation Date</strong></p>
                <p>{new Date(info.creationDate).toLocaleDateString("en-US")}</p>
            </div>
        </div>
    )
}

export function DocumentSpace({username}) {
    const [document, setDocument] = useState(null);
    const [highlights, setHighlights] = useState([]);
    const addHighlight = highlight => setHighlights(old => [...old, highlight]);
    useEffect(() => {
        endpoints.getDocument().then(setDocument).catch(console.error);
    }, []);
    return (
        <div style={{width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column'}}>
            <AppHeader username={username} document={document} onUpdateDocument={setDocument}/>
            <div style={{display: 'flex', height: '100%'}}>
                {document ? (
                    <>
                        <PDFViewer highlights={highlights} url={document.url} onAddHighlight={addHighlight}/>
                        <div style={{width: 'calc(40% - 1px)', padding: 10, borderLeft: '1px solid gray', background: '#fafafa'}}>
                            {highlights.map(c => <CommentDisplay
                                username={c.comment.username ?? username}
                                title={c.comment.title}
                                content={c.comment.content}
                            />)}
                        </div>
                    </>
                ) : (
                    <div>Loading</div>
                )}
            </div>
        </div>
    )
}