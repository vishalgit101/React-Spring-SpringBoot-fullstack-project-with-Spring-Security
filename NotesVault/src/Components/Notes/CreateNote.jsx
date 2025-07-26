import React, { useState } from "react";
import ReactQuill from "react-quill-new"; // new react quill
import "react-quill-new/dist/quill.snow.css";
import { MdNoteAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // axios api instance
import Buttons from "../../utils/Buttons"; // Button Comp with Props
import toast from "react-hot-toast";

const CreateNote = () => {
  const navigate = useNavigate(); // for auto navigating after button click

  //set the content of the reactquill
  const [editorContent, setEditorContent] = useState(""); // current content in the note editor
  const [loading, setLoading] = useState(false); // load state on button click

  const handleChange = (content, delta, source, editor) => {
    // these are comming from React-Quill internally (content, delta, source, editor)
    // onChange Handler
    setEditorContent(content); //on every keystroke change is being saved in the state
  };

  //note create handler
  const handleSubmit = async () => {
    if (editorContent.trim().length === 0) {
      return toast.error("Note content is required");
    } else if (editorContent.trim().length < 30) {
      return toast.error("Minimum 30 charaters required");
    }
    try {
      setLoading(true);
      const noteData = { content: editorContent }; // setting noteData = current data in editorContent State
      await api.post("/notes", noteData); // backend- Body with content: "This is content"
      toast.success("Note create successful");
      navigate("/notes"); // auto navigates to My Notes
    } catch (err) {
      toast.error("Error creating note");
    } finally {
      setLoading(false); // after loading is done, we turn off the loading
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] p-10">
      <div className="flex items-center gap-1 pb-5">
        <h1 className="font-montserrat  text-slate-800 sm:text-4xl text-2xl font-semibold ">
          Create New Note
        </h1>
        <MdNoteAlt className="text-slate-700 text-4xl" />
      </div>

      <div className="h-72 sm:mb-20  lg:mb-14 mb-28 ">
        <ReactQuill
          className="h-full "
          value={editorContent}
          onChange={handleChange}
          modules={{
            toolbar: [
              [
                {
                  header: [1, 2, 3, 4, 5, 6],
                },
              ],
              [{ size: [] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              ["clean"],
            ],
          }}
        />
      </div>

      <Buttons
        disabled={loading}
        onClickhandler={handleSubmit}
        className="bg-customRed  text-white px-4 py-2 hover:text-slate-300 rounded-sm"
      >
        {loading ? <span>Loading...</span> : " Create Note"}
      </Buttons>
    </div>
  );
};

export default CreateNote;

// Buttons will be disabled when loading is true
