"use client";
/* eslint-disable no-unused-vars */

import React, { useRef, useEffect, useContext } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ThemeContext } from "@/context/ThemeContext";

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
    // Use `any` for the editor reference to avoid type conflicts between
    // multiple nested @ckeditor/ckeditor5-core package instances.
    const editorRef = useRef<any | null>(null);
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error("RichTextEditor debe usarse dentro de ThemeProvider");
    }

    const { isDark } = themeContext;

    const updateEditorStyle = (editor: any, isDark: boolean) => {
        const root = editor.editing.view.document.getRoot();
        if (root) {
            editor.editing.view.change((writer: any) => {
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
            // ClassicEditor build's typing doesn't match the React wrapper's expected shape
            // Cast to `any` here to satisfy TypeScript while keeping runtime behavior.
            editor={ClassicEditor as unknown as any}
            data={value}
            onReady={(editor: any) => {
                editorRef.current = editor;
                updateEditorStyle(editor, isDark);
            }}
            onChange={(_: any, editor: any) => {
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