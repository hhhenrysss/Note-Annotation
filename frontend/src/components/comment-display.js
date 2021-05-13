import {markdownConverter} from "../utils/markdown";

export function CommentMinimizedDisplay({title, username, content, onClick}) {
    return (
        <div className={'hover-card'} onClick={onClick} style={{padding: 10, borderBottom: '1px solid #c7c7c7', cursor: "pointer"}}>
            <h6 style={{fontSize: 15, margin: '5px 0'}}>{title}</h6>
            <p style={{fontSize: 12, color: 'gray', marginBottom: 5, margin: 0, padding: '5px 0'}}>{username}</p>
            <div style={{fontSize: 12, margin: 0, padding: 0}} dangerouslySetInnerHTML={{__html: markdownConverter.makeHtml(content)}}/>
        </div>
    )
}