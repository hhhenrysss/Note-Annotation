import {markdownConverter} from "../utils/markdown";

export function CommentDisplay({title, username, content}) {
    return (
        <div style={{padding: 5, borderBottom: '1px solid #c7c7c7'}}>
            <h6 style={{fontSize: 15, margin: 0, marginBottom: 10}}>{title}</h6>
            <p style={{fontSize: 12, color: 'gray', marginBottom: 10, margin: 0, padding: '5px 0'}}>{username}</p>
            <div style={{fontSize: 12, margin: 0, padding: '5px 0'}} dangerouslySetInnerHTML={{__html: markdownConverter.makeHtml(content)}}/>
        </div>
    )
}