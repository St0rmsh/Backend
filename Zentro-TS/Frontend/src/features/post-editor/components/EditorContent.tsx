import React from 'react';
import { useEditor, EditorContent as TiptapEditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { EditorToolbar } from './EditorToolbar';
import { useDispatch } from 'react-redux';
import { setEditorState } from '../state/postEditorSlice';

interface EditorContentProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

export const EditorContent: React.FC<EditorContentProps> = ({ initialContent = '', onChange }) => {
  const dispatch = useDispatch();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Write your story...',
        emptyEditorClass: 'is-editor-empty',
      }),
      Underline,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl my-4 max-w-full',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-500 hover:underline cursor-pointer',
        },
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-zinc dark:prose-invert max-w-none focus:outline-none min-h-[400px] pb-32 text-lg leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) {
        onChange(html);
      }
      dispatch(setEditorState({ content: html }));
    },
  });

  return (
    <div className="w-full flex flex-col relative">
      <EditorToolbar editor={editor} />
      <div className="w-full relative">
        <TiptapEditorContent editor={editor} className="w-full" />
      </div>
    </div>
  );
};
