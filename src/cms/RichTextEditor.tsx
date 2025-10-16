"use client";
/* eslint-disable no-unused-vars */

import React, { useRef, useEffect, useContext } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ThemeContext } from "@/context/ThemeContext";
import type { Editor } from '@ckeditor/ckeditor5-core';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
    const editorRef = useRef<Editor | null>(null);
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error("RichTextEditor debe usarse dentro de ThemeProvider");
    }

    const { isDark } = themeContext;

    const updateEditorStyle = (editor: Editor, isDark: boolean) => {
        const root = editor.editing.view.document.getRoot();
        if (root) {
            editor.editing.view.change((writer) => {
                writer.setStyle(
                    "background-color",
                    isDark ? "#2d3748" : "#ffffff",
                    root
                );
                writer.setStyle(
                    "color",
                    isDark ? "#ffffff" : "#000000",
                    root
                );
            });
        }
    };

    useEffect(() => {
        if (editorRef.current) {
            updateEditorStyle(editorRef.current, isDark);
        }
    }, [isDark]);

    return (
        <CKEditor
            editor={ClassicEditor}
            data={value}
            onReady={(editor) => {
                editorRef.current = editor;
                updateEditorStyle(editor, isDark);
            }}
            onChange={(_, editor) => {
                const content = editor.getData();
                onChange(content);
            }}
            config={{
                toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "bulletedList",
                    "numberedList",
                    "blockQuote",
                    "|",
                    "insertTable",
                    "mediaEmbed",
                    "|",
                    "undo",
                    "redo",
                ],
            }}
        />
    );
};

export default RichTextEditor;