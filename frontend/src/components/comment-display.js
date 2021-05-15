import {markdownConverter} from "../utils/markdown";
import {useState} from "react";
import {ThumbUp, ThumbUpOutlined} from "@material-ui/icons";
import {Chip, IconButton} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {getHexGradient} from "../utils/color";

export function CommentMinimizedDisplay({title, username, content, onClick}) {
    return (
        <div className={'hover-card'} onClick={onClick} style={{padding: 10, borderBottom: '1px solid #c7c7c7', cursor: "pointer"}}>
            <h6 style={{fontSize: 15, margin: '5px 0'}}>{title}</h6>
            <p style={{fontSize: 12, color: 'gray', marginBottom: 5, margin: 0, padding: '5px 0'}}>{username}</p>
            <div style={{fontSize: 12, margin: 0, padding: 0}} dangerouslySetInnerHTML={{__html: markdownConverter.makeHtml(content)}}/>
        </div>
    )
}

function generateDocumentChips(comment, allLinkedInternalDocs, allLinkedExternalDocs, history, onUpdateDocument) {
    const chips = []
    for (const docId of comment.linkedDocuments) {
        if (docId in allLinkedInternalDocs) {
            const doc = allLinkedInternalDocs[docId]
            chips.push(<Chip
                style={{textOverflow: "ellipsis", maxWidth: 150}}
                label={doc.name}
                variant='outlined'
                color={'secondary'}
                key={docId}
                onClick={() => onUpdateDocument(doc)}
            />)
        } else if (docId in allLinkedExternalDocs) {
            const doc = allLinkedExternalDocs[docId]
            chips.push(<Chip
                style={{textOverflow: "ellipsis", maxWidth: 150}}
                label={doc.name}
                variant='outlined'
                color={'secondary'}
                key={docId}
                onClick={() => window.open(doc.url, '_blank')}
            />)
        }
    }
    return chips
}

function NestedReplies({commentId, allLinkedInternalDocs, allLinkedExternalDocs, allComments, nestingLevel, onUpdateDocument}) {
    const history = useHistory();
    const comment = allComments[commentId]
    const chips = generateDocumentChips(comment, allLinkedInternalDocs, allLinkedExternalDocs, history, onUpdateDocument)
    return (
        <div>
            <p style={{margin: 0, marginBottom: 10}}><strong>{comment.author}</strong></p>
            <p style={{margin: 0, marginBottom: 10}}>{comment.content}</p>
            <div style={{display: 'flex', flexWrap: "wrap", gap: 10}}>
                {chips}
            </div>
            {comment.replies.length > 0 && (
                <div style={{marginLeft: nestingLevel * 15, borderLeft: `1px solid ${getHexGradient('#ffffff', '#1976d2', (nestingLevel + 1)/10)}`}}>
                    {comment.replies.map(replyId => (
                        <NestedReplies
                            key={replyId}
                            commentId={replyId}
                            nestingLevel={nestingLevel + 1}
                            allComments={allComments}
                            allLinkedExternalDocs={allLinkedExternalDocs}
                            allLinkedInternalDocs={allLinkedInternalDocs}
                            onUpdateDocument={onUpdateDocument}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}


export function CommentDisplay({highlight, allLinkedInternalDocs, allLinkedExternalDocs, allComments, onClickUpvote, onUpdateDocument}) {
    const [isUpvoted, setIsUpvoted] = useState(false)
    const history = useHistory();
    const selectedComment = allComments[highlight.commentId]
    console.log('selectedComment', selectedComment)

    const onThumbsUp = () => {
        setIsUpvoted(!isUpvoted);
        onClickUpvote(!isUpvoted);
    }
    const chips = generateDocumentChips(selectedComment, allLinkedInternalDocs, allLinkedExternalDocs, history, onUpdateDocument)
    return (
        <div style={{display: 'flex'}}>
            <div style={{display: 'flex', flexDirection: 'column', padding: 15}}>
                <section>
                    <div style={{display: 'flex', alignItems: "center"}}>
                        <h2 style={{fontWeight: 500, fontSize: 20, margin: 0}}>Highlight</h2>
                        {(highlight.access === 'private' || selectedComment.access === 'private') && (
                            <p style={{margin: 0, marginLeft: 15, color: 'gray', fontSize: 12}}>private</p>
                        )}
                        <IconButton style={{marginLeft: 'auto'}} onClick={onThumbsUp}>
                            {isUpvoted ? <ThumbUp/> : <ThumbUpOutlined/>}
                        </IconButton>
                    </div>
                    <p style={{margin: '5px 0'}}><span style={{fontSize: 14}}>{highlight.author}</span></p>
                    <blockquote style={{margin: 0, padding: 5, background: '#f3f2f1', borderLeft: '2px solid darkgray'}}>
                        <code style={{fontSize: 12}}>{highlight.selectedText.text}</code>
                    </blockquote>
                    <div>
                        <h3 style={{fontWeight: 500, fontSize: 14, margin: 0, padding: '5px 0', marginTop: 10, background: '#ffff00', display: 'inline-block'}}>{selectedComment.title}</h3>
                        <p style={{margin: 0, fontSize: 12}} dangerouslySetInnerHTML={{__html: markdownConverter.makeHtml(selectedComment.content)}}/>
                    </div>
                </section>
                <section>
                    <h2 style={{fontWeight: 500, fontSize: 20}}>Linked Documents</h2>
                    <div style={{display: 'flex', flexWrap: "wrap", gap: 10}}>
                        {chips}
                    </div>
                </section>
                <section>
                    <h2 style={{fontWeight: 500, fontSize: 20}}>Discussion</h2>
                    {selectedComment.replies.length > 0 && (
                        <>
                            {selectedComment.replies.map(replyId => (
                                <NestedReplies
                                    key={replyId}
                                    commentId={replyId}
                                    nestingLevel={0}
                                    allComments={allComments}
                                    allLinkedExternalDocs={allLinkedExternalDocs}
                                    allLinkedInternalDocs={allLinkedInternalDocs}
                                    onUpdateDocument={onUpdateDocument}
                                />
                            ))}
                        </>
                    )}
                </section>
            </div>

        </div>
    )
}