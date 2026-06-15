import { Editor } from "@tinymce/tinymce-react";

const RichTextEditor = ({ value, onChange }) => {
  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY || ""}
      value={value}
      onEditorChange={onChange}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
          "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
          "insertdatetime", "media", "table", "help", "wordcount",
        ],
        toolbar:
          "undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | " +
          "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
          "link image media table | removeformat code fullscreen | help",
        content_style:
          "body { font-family: Georgia, serif; font-size: 16px; line-height: 1.8; color: #1f2937; max-width: 800px; margin: 0 auto; padding: 16px; }",
        image_uploadtab: false,
      }}
    />
  );
};

export default RichTextEditor;
