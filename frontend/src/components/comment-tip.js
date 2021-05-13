import {Button, TextField, FormControl, RadioGroup, FormControlLabel, FormLabel, Radio, Chip} from "@material-ui/core";

import ReactMde from "react-mde";
import {useState} from "react";

import "react-mde/lib/styles/css/react-mde-all.css";
import {markdownConverter} from "../utils/markdown";
import Autosuggest from 'react-autosuggest';
import { v4 as uuidv4 } from 'uuid';

function InternalLinkAdd({onSelect, existingDocInfo}) {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const getSuggestions = ({value}) => {
        setSuggestions(existingDocInfo.filter(d => d.name.toLowerCase().includes(value.toLowerCase())))
    }
    return (
        <Autosuggest
            suggestions={suggestions}
            getSuggestionValue={d => d.name}
            onSuggestionsFetchRequested={getSuggestions}
            onSuggestionsClearRequested={() => setSuggestions([])}
            renderSuggestion={suggestion => <div style={{maxWidth: 450, fontSize: 12}}>{suggestion.name}</div>}
            onSuggestionSelected={(e, {suggestion}) => onSelect(suggestion)}
            inputProps={{
                placeholder: 'Search resource name',
                value,
                onChange: (e, {newValue}) => setValue(newValue)
            }}
            style={{fontSize: 12}}
            renderInputComponent={props => (<TextField fullWidth inputProps={{style: {fontSize: 12}}} {...props}/>)}
        />
    )
}

function ExternalLinkAdd({onAdd, username}) {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const onSubmit = () => {
        onAdd({
            url, name, creationDate: Date.now(), lastUpdatedDate: Date.now(), author: username, id: `external-${uuidv4().toString()}`
        })
    }
    return (
        <>
            <div style={{marginBottom: 10}}>
                <TextField inputLabelProps={{style: {fontSize: 12}}} inputProps={{style: {fontSize: 12}}} fullWidth value={url} onChange={e => setUrl(e.target.value)} label='URL'/>
            </div>
            <div style={{marginBottom: 10}}>
                <TextField inputLabelProps={{style: {fontSize: 12}}} inputProps={{style: {fontSize: 12}}} fullWidth value={name} onChange={e => setName(e.target.value)} label='Name'/>
            </div>
            <div style={{display: "flex"}}>
                <Button style={{marginLeft: 'auto'}} onClick={onSubmit}>Add</Button>
            </div>
        </>
    )
}


function LinkAdd({onAdd, onDelete, links, existingDocInfo, username}) {
    const [isInternalLink, setIsInternalLink] = useState(true);
    return (
        <>
            <FormLabel component="legend" style={{fontSize: 12}}>Links to resources</FormLabel>
            <div style={{display: 'flex', flexWrap: "wrap", gap: 10, marginTop: 10}}>
                {links.map(l => <Chip
                    style={{textOverflow: "ellipsis", maxWidth: 150}}
                    variant='outlined'
                    key={l.id}
                    label={l.name}
                    onDelete={() => onDelete(l.id)}
                />)}
            </div>
            <Button fullWidth onClick={() => setIsInternalLink(v => !v)}>{isInternalLink ? 'Add Link to External Resource' : 'Add Link to Internal Resource'}</Button>
            {isInternalLink ? (
                <InternalLinkAdd existingDocInfo={existingDocInfo} onSelect={({name, id}) => onAdd({id, name}, false)}/>
            ) : (
                <ExternalLinkAdd username={username} onAdd={l => onAdd(l, true)}/>
            )}
        </>
    )
}


export function CommentTip({onAdd, onOpen, username, existingDocInfo}) {
    const [content, setContent] = useState('');
    const [editorTab, setEditorTab] = useState('write');
    const [title, setTitle] = useState('');
    const [access, setAccess] = useState('private');
    const [links, setLinks] = useState([]);
    const onAddLink = (data, isExternal) => {
        setLinks(old => {
            const ls = [...old];
            for (const {id} of ls) {
                if (id === data.id) {
                    return ls;
                }
            }
            ls.push({
                name: data.name,
                id: data.id,
                isExternal,
                data
            })
            return ls
        })
    }
    const onDeleteLink = id => {
        setLinks(old => old.filter(d => d.id !== id));
    }
    const onAddComment = () => onAdd({title, content, access, links})
    return (
        <div style={{background: 'rgba(255,255, 255, 0.8)', backdropFilter: 'blur(10px)', padding: 10, boxShadow: '0 6.4px 14.4px 0 rgb(0 0 0 / 13%), 0 1.2px 3.6px 0 rgb(0 0 0 / 11%)'}}>
            <div style={{padding: '10px 0', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <h3 style={{fontWeight: 500, margin: 0}}>New comments</h3>
                <Button style={{marginLeft: 'auto'}} onClick={onAddComment}>Post</Button>
            </div>
            <form>
                <TextField style={{marginBottom: 10}} fullWidth label={'Title'} value={title} onChange={e => setTitle(e.target.value)}/>
                <div style={{width: 500, backdropFilter: 'blur(10px)', marginBottom: 20}}>
                    <ReactMde
                        value={content}
                        onChange={setContent}
                        selectedTab={editorTab}
                        onTabChange={setEditorTab}
                        generateMarkdownPreview={markdown => Promise.resolve(markdownConverter.makeHtml(markdown))}
                    />

                </div>
                <br/>
                <div style={{marginBottom: 20}}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" style={{fontSize: 12}}>Access Level</FormLabel>
                        <RadioGroup style={{display: "flex", flexDirection: 'row'}} aria-label="gender" name="access-level" value={access} onChange={e => setAccess(e.target.value)}>
                            <FormControlLabel style={{fontSize: 12}} value="private" control={<Radio />} label={<span style={{fontSize: 12}}>Private</span>} />
                            <FormControlLabel value="public" control={<Radio />} label={<span style={{fontSize: 12}}>Public</span>} />
                        </RadioGroup>
                    </FormControl>
                </div>
                <br/>
                <div style={{marginBottom: 10}}>
                    <LinkAdd onAdd={onAddLink} onDelete={onDeleteLink} links={links} existingDocInfo={existingDocInfo} username={username}/>
                </div>

            </form>
        </div>
    )
}