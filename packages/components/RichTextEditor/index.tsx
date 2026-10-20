"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Quill touches `document`, so it must not render on the server
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 242 }} />,
});

const FORMATS = [
  "header", "bold", "italic", "underline", "strike",
  "blockquote", "code-block", "list", "indent",
  "link", "image",
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something…",
  readOnly = false,
  minHeight = 200,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: number;
}) {
  // modules must be memoized, otherwise Quill re-mounts on every render
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ],
      clipboard: { matchVisual: false },
    }),
    []
  );

  return (
    <div className="rte" style={{ "--rte-min-height": `${minHeight}px` }}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={FORMATS}
        placeholder={placeholder}
        readOnly={readOnly}
      />
      <style>{`.rte .ql-editor { min-height: var(--rte-min-height); }`}</style>
    </div>
  );
}

/* Install: npm i react-quill-new

Usage (any page or component, App Router or Pages Router):

"use client";
import { useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";

export default function Example() {
  const [html, setHtml] = useState("");
  return <RichTextEditor value={html} onChange={setHtml} />;
}

The value is HTML — sanitize before storing/rendering.
*/