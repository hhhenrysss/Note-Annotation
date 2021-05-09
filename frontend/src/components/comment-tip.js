import {Button, TextField, FormControl, RadioGroup, FormControlLabel, FormLabel, Radio} from "@material-ui/core";

import ReactMde from "react-mde";
import {useState} from "react";

import "react-mde/lib/styles/css/react-mde-all.css";
import {markdownConverter} from "../utils/markdown";


export function CommentTip({onAdd, onOpen}) {
    const [content, setContent] = useState('');
    const [editorTab, setEditorTab] = useState('write');
    const [title, setTitle] = useState('');
    const [access, setAccess] = useState('private');

    return (
        <div style={{background: 'rgba(255,255, 255, 0.8)', backdropFilter: 'blur(10px)', padding: 10, boxShadow: '0 6.4px 14.4px 0 rgb(0 0 0 / 13%), 0 1.2px 3.6px 0 rgb(0 0 0 / 11%)'}}>
            <div style={{padding: '10px 0', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <h3 style={{fontWeight: 500, margin: 0}}>New comments</h3>
                <Button style={{marginLeft: 'auto'}} onClick={() => onAdd({title, content})}>Post</Button>
            </div>
            <form>
                <TextField style={{marginBottom: 10}} fullWidth label={'Title'} value={title} onChange={e => setTitle(e.target.value)}/>
                <div style={{width: 500, backdropFilter: 'blur(10px)', marginBottom: 10}}>
                    <ReactMde
                        value={content}
                        onChange={setContent}
                        selectedTab={editorTab}
                        onTabChange={setEditorTab}
                        generateMarkdownPreview={markdown => Promise.resolve(markdownConverter.makeHtml(markdown))}
                    />
                </div>
                <div style={{marginBottom: 10}}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" style={{fontSize: 12}}>Access Level</FormLabel>
                        <RadioGroup style={{display: "flex", flexDirection: 'row'}} aria-label="gender" name="access-level" value={access} onChange={e => setAccess(e.target.value)}>
                            <FormControlLabel style={{fontSize: 12}} value="private" control={<Radio />} label={<span style={{fontSize: 12}}>Private</span>} />
                            <FormControlLabel value="public" control={<Radio />} label={<span style={{fontSize: 12}}>Public</span>} />
                        </RadioGroup>
                    </FormControl>
                </div>


            </form>
        </div>
    )
}