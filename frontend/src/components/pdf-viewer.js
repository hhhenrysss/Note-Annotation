/* eslint import/no-webpack-loader-syntax: 0 */

import {AreaHighlight, Highlight, PdfHighlighter, PdfLoader, Popup, Tip, setPdfWorker} from "react-pdf-highlighter";
import PDFWorker from "worker-loader!pdfjs-dist/lib/pdf.worker";


import {useCallback, useState} from "react";
import {CommentTip} from "./comment-tip";

setPdfWorker(PDFWorker);

const resetHash = () => {
    document.location.hash = "";
};

export function PDFViewer({url, highlights, onAddHighlight, username, existingDocInfo}) {
    return (
        <div style={{width: '100%', height: '100%', position: 'relative'}}>
            <PdfLoader url={url} beforeLoad={<div>Loading</div>}>
                {pdfDocument => (
                    <PdfHighlighter
                        pdfDocument={pdfDocument}
                        enableAreaSelection={event => event.altKey}
                        onScrollChange={resetHash}
                        // pdfScaleValue="page-width"
                        scrollRef={() => {}}
                        onSelectionFinished={(
                            position,
                            content,
                            hideTipAndSelection,
                            transformSelection
                        ) => (
                            <CommentTip
                                onOpen={transformSelection}
                                onAdd={comment => {
                                    onAddHighlight({selectedText: content, position, comment});
                                    hideTipAndSelection();
                                }}
                                username={username}
                                existingDocInfo={existingDocInfo}
                            />
                        )}
                        highlightTransform={(
                            highlight,
                            index,
                            setTip,
                            hideTip,
                            viewportToScaled,
                            screenshot,
                            isScrolledTo
                        ) => {
                            const isTextHighlight = !Boolean(
                                highlight.content && highlight.content.image
                            );

                            const component = isTextHighlight ? (
                                <Highlight
                                    isScrolledTo={isScrolledTo}
                                    position={highlight.position}
                                    comment={highlight.comment}
                                />
                            ) : (
                                <AreaHighlight
                                    highlight={highlight}
                                    onChange={boundingRect => {
                                        // updateHighlight(
                                        //     highlight.id,
                                        //     {boundingRect: viewportToScaled(boundingRect)},
                                        //     {image: screenshot(boundingRect)}
                                        // );
                                    }}
                                />
                            );

                            return (
                                <Popup
                                    popupContent={<div>This is popup</div>}
                                    onMouseOver={popupContent =>
                                        setTip(highlight, highlight => popupContent)
                                    }
                                    onMouseOut={hideTip}
                                    key={index}
                                    children={component}
                                />
                            );
                        }}
                        highlights={highlights}
                    />
                )}
            </PdfLoader>
        </div>
    )
}