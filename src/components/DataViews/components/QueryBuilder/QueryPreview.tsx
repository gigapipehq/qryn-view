import { cx, css } from "@emotion/css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-sql";
import { createEditor, Text } from "slate";
import { withHistory } from "slate-history";

import { Slate, Editable, withReact } from "slate-react";
import { useTheme } from "./hooks";

interface Props {
    queryText: string;
}

const QueryPreviewContainer = (theme: any) => css`
padding:10px;
display:flex;
flex:1;
align-items:center;
border-bottom: 1px solid ${theme.buttonBorder};
background: ${theme.widgetContainer};
label  {
    
    font-size : 12px;
    color: ${theme.textColor};
  
    padding: 4px 10px;
}
`

const CustomEditor = (theme: any) => css`
    flex: 1;
    //   height: 100%;
    background: ${theme.inputBg};
   // border: 1px solid ${theme.buttonBorder};
    color: ${theme.textColor};
    padding: 4px 8px;
    font-size: 1em;
    font-family: monospace;
    margin: 0px 5px;
    // margin-bottom: 20px;
    border-radius: 3px;
    line-height: 1.5;
    line-break: anywhere;
    overflow-y: scroll;
`;
function Leaf({ attributes, children, leaf, theme }: any) {
    return (
        <span
            {...attributes}
            className={css`
                font-family: monospace;
                // background: black;
                ${leaf.comment &&
                css`
                    color: blue;
                `}
                ${(leaf.operator || leaf.url) &&
                css`
                    color: ${theme.textOff};
                `}
        ${leaf.keyword &&
                css`
                    color: #57aed4;
                `}
        ${(leaf.variable || leaf.regex) &&
                css`
                    color: #e90;
                `}
        ${(leaf.number ||
                    leaf.boolean ||
                    leaf.tag ||
                    leaf.constant ||
                    leaf.symbol ||
                    leaf["attr-name"] ||
                    leaf.selector) &&
                css`
                    color: #dd4a68;
                `}
        ${leaf.punctuation &&
                css`
                    color: orange;
                `}
        ${(leaf.string || leaf.char) &&
                css`
                    color: green;
                `}
        ${(leaf.function || leaf["class-name"] || leaf["attr-name"]) &&
                css`
                    color: #dd4a68;
                `}
          ${leaf["context-labels"] &&
                css`
                    color: orange;
                `}
          ${leaf["label-key"] &&
                css`
                    color: green;
                `}
            `}
        >
            {children}
        </span>
    );
}

export function getTokenLength(token: any) {
    if (typeof token === "string") {
        return token?.length;
    }

    if (typeof token?.content === "string") {
        return token?.content.length;
    }

    return token?.content?.reduce((l: any, t: any) => l + getTokenLength(t), 0);
}

export default function QueryPreview(props: Props) {
    const theme = useTheme();

    const { queryText } = props;
    const [initialValue, setInitialValue] = useState([
        { type: "paragraph", children: [{ text: queryText }] },
    ]);
    const [language] = useState("sql")

    const decorate = useCallback(
        ([node, path]: any) => {
            const ranges: any[] = [];
            if (!Text.isText(node) || (node as any)?.length < 1) {
                return ranges;
            }
            const tokens = Prism.tokenize(node.text, Prism.languages[language]);
            let start = 0;
            for (const token of tokens) {
                const length = getTokenLength(token);
                const end = start + length;

                if (typeof token !== "string") {
                    ranges.push({
                        [token.type]: true,
                        anchor: { path, offset: start },
                        focus: { path, offset: end },
                    });
                }
                start = end;
            }
            return ranges;
        },
        [language]
    );



    const renderLeaf = useCallback(
        (props) => <Leaf {...props} theme={theme} />,
          // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useEffect(() => {
        //   console.log(queryText)
        setInitialValue([
            { type: "paragraph", children: [{ text: props.queryText }] },
        ]);
        console.log(props.queryText)
        editor.children = [{ text: props.queryText }];
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.queryText]);


    const onChange = useCallback(
        (e) => {
            setInitialValue(e);
        },
          // eslint-disable-next-line react-hooks/exhaustive-deps
        [initialValue]
    );

    const editor = useMemo(
        () => withHistory(withReact(createEditor() as any)),
        []
    );

    return (<div className={cx(QueryPreviewContainer(theme))}>
        <label>Raw Query</label>
        <Slate editor={editor} value={initialValue} onChange={onChange}>
            <Editable
                renderLeaf={renderLeaf}
                decorate={decorate}
                className={cx(CustomEditor(theme))}
                readOnly
                placeholder={queryText}
            />
        </Slate>

    </div>

    );
}
