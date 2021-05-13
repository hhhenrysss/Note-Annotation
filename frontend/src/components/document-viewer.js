import {Button, Dialog, IconButton, TextField} from "@material-ui/core";
import {PDFViewer} from "./pdf-viewer";
import {useEffect, useState} from "react";
import {endpoints} from "../network/endpoints";
import {CommentMinimizedDisplay} from "./comment-display";
import {InfoOutlined, SettingsOutlined} from "@material-ui/icons";
import {blue} from "@material-ui/core/colors";
import {useHistory} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';


function AppHeader({username, document, onUpdateDocument}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <>
            <div style={{background: 'black', width: '100%', display: 'flex', alignItems: 'center'}}>
                <h2 style={{color: 'white', fontSize: 18, padding: '5px 15px', margin: 0, fontWeight: 500}}>Document
                    View</h2>
                <IconButton style={{marginLeft: 'auto'}} onClick={() => setIsDialogOpen(true)}><InfoOutlined
                    style={{color: 'white'}}/></IconButton>
                <Button style={{
                    color: '#fff1ff',
                    textTransform: 'none',
                    background: blue['700'],
                    height: '100%',
                    borderRadius: 0
                }}>{username}</Button>
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
        <div style={{padding: 15, width: 400}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <h1 style={{fontSize: 25, fontWeight: 500}}>Document Info</h1>
                <Button style={{marginLeft: 'auto'}} onClick={onEdit}>{mode === 'edit' ? 'Done' : 'Edit'}</Button>
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <p style={{width: 150}}><strong>Document Name</strong></p>
                {mode === 'edit' ? <TextField value={documentName} onChange={e => setDocumentName(e.target.value)}/> :
                    <p>{documentName}</p>}
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

export function DocumentViewer({username}) {
    const {selectedDoc, existingDocInfo} = useHistory().location.state
    const [document, setDocument] = useState(selectedDoc);
    const [values, setValues] = useState({});
    const [filteredHighlights, setFilteredHighlights] = useState([]);
    const [isSettingOpen, setIsSettingOpen] = useState(false);
    const [highlightsFilter, setHighlightsFilter] = useState({author: '', role: '', currentUser: true})
    const [selectedHighlight, setSelectedHighlight] = useState(null);
    const addHighlight = combined => {
        console.log('combined', combined)
        const time = Date.now()
        const comment = {
            id: `comment-${uuidv4().toString()}`,
            content: combined.comment.content,
            title: combined.comment.title,
            access: combined.comment.access,
            replies: [],
            author: username,
            linkedDocuments: combined.comment.links.map(l => l.id)
        }
        const highlight = {
            selectedText: combined.selectedText,
            position: combined.position,
            id: `highlight-${uuidv4().toString()}`,
            documentId: document.id,
            author: username,
            commentId: comment.id,
            upvotes: 0,
            access: comment.access
        }
        const externalLinks = [];
        for (const link of combined.comment.links) {
            if (link.isExternal) {
                externalLinks.push({
                    url: link.data.url,
                    name: link.name,
                    creationDate: time,
                    author: username,
                    id: link.id,
                    lastUpdatedDate: time
                })
            }
        }
        endpoints.addHighlight(highlight, comment, externalLinks).then(({highlight, comment, externalDocs}) => {
            setValues(old => {
                const newValue = {...old};
                newValue.highlights = [...newValue.highlights, highlight];
                newValue.comments = {...newValue.comments, [comment.id]: comment}
                newValue.linkedExternalResources = {...newValue.linkedExternalResources};
                for (const d of externalDocs) {
                    newValue.linkedExternalResources[d.id] = d
                }
                return newValue
            })
            setFilteredHighlights(old => [...old, highlight]);
        })
    };
    useEffect(() => {
        if (!document) {
            return
        }
        endpoints.getAllHighlights(document.id, username).then(val => {
            setValues(val);
            setFilteredHighlights(val.highlights)
        })
    }, [document])
    return (
        <div style={{width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column'}}>
            <AppHeader username={username} document={document} onUpdateDocument={setDocument}/>
            <div style={{display: 'flex', height: '100%'}}>
                {document ? (
                    <>
                        <PDFViewer existingDocInfo={existingDocInfo} username={username} highlights={filteredHighlights}
                                   url={document.url} onAddHighlight={addHighlight}/>
                        <div style={{
                            width: 'calc(40% - 1px)',
                            borderLeft: '1px solid gray',
                        }}>
                            <div style={{padding: 10, background: '#e1dfdd'}}>
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <h1 style={{fontSize: 25, fontWeight: 500, margin: 0}}>Highlights</h1>
                                    <IconButton style={{marginLeft: 'auto'}}
                                                onClick={() => setIsSettingOpen(s => !s)}><SettingsOutlined
                                        style={{color: 'black'}}/></IconButton>
                                </div>
                            </div>
                            <div style={{padding: 10}}>
                                {filteredHighlights.map(h => {
                                    const comment = values.comments[h.commentId]
                                    return (
                                        <CommentMinimizedDisplay
                                            key={h.id}
                                            username={comment.author}
                                            title={comment.title}
                                            content={comment.content}
                                            onClick={() => setSelectedHighlight(h)}
                                        />
                                    )
                                })}
                            </div>

                        </div>
                    </>
                ) : (
                    <div>Loading</div>
                )}
            </div>
        </div>
    )
}