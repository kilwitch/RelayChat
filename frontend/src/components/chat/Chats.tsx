import React, { useEffect, useMemo, useRef, useState } from "react";
import { getSocket } from "@/lib/socket.config";
import FileMessage from "./FileMessage";
import { v4 as uuidv4 } from "uuid";
export default function Chats({
  group,
  oldMessages,
  chatUser,
}: {
  group: GroupChatType;
  oldMessages: Array<MessageType> | [];
  chatUser?: GroupChatUserType;
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<MessageType>>(oldMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  // for file upload
  const[selectedFile, setSelectedFile]= useState<File|null>(null);
  const [previewUrl, setPreviewUrl]= useState<string |null>(null);
  const [uploading, setUploading]= useState(false);
  const fileInputRef= useRef<HTMLInputElement> (null);

  const handleFileChange= (e:React.ChangeEvent<HTMLInputElement>)=>{
    const file= e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    //preview
     if(file.type.startsWith("image/")){
      const reader= new FileReader();
      reader.onload=()=> setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
     }else{
      setPreviewUrl(null); // non-image just show the filename
     }
  }

  
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  let socket = useMemo(() => {
    const socket = getSocket();
    socket.auth = {
      room: group.id,
    };
    return socket.connect();
  }, [group.id]);
  useEffect(() => {
    socket.on("message", (data: MessageType) => {
      console.log("The message is", data);
      setMessages((prevMessages) => [...prevMessages, data]);
      scrollToBottom();
    });

    return () => {
      
      socket.off("message");
    };
  }, [socket]);

  //called when send clicked
  const handleSubmit= async(event: React.FormEvent)=>{
    event.preventDefault();

    if(!message && !selectedFile) return;
    
     let fileUrl:string |undefined;
     let fileType: string|undefined;

     //if file selected, upload it first
     if(selectedFile){
      setUploading(true);
      try {
        const formData=new FormData();
        formData.append("file", selectedFile);
        
        const res= await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
          method:"POST",
          body:formData,
        });

        if(!res.ok){
          throw new Error(`Upload failed with status ${res.status}`);
        }

        const data= await res.json();
        fileUrl= data.url;
        fileType=data.type;
      } catch (error) {
        console.error("File upload error:", error);
        alert("Failed to upload file. Please try again.");
        setUploading(false);
        return;
      }
      setUploading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      // Reset file input so the same file can be re-selected
      if(fileInputRef.current) fileInputRef.current.value = "";
     }



    const payload: MessageType = {
      id: uuidv4(),
      message: message,
      name: chatUser?.name ?? "Unknown",
      created_at: new Date().toISOString(),
      group_id: group.id,
      fileUrl,
      fileType,
    };
    socket.emit("message", payload);
    setMessage("");
    
  };

  return (
    <div className="flex flex-col h-[94vh]  p-4">
      <div className="flex-1 overflow-y-auto flex flex-col-reverse">
        <div ref={messagesEndRef} />
        <div className="flex flex-col gap-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-sm rounded-lg p-2 ${
                message.name === chatUser?.name
                  ? "bg-linear-to-r from-blue-400 to-blue-600  text-white self-end"
                  : "bg-linear-to-r from-gray-200 to-gray-300 text-black self-start"
              }`}
            >
              {/* Step 9 — render text and/or file */}
              <>
                {message.message && <p>{message.message}</p>}
                {message.fileUrl && (
                  <FileMessage
                    fileUrl={message.fileUrl}
                    fileType={message.fileType ?? "application/octet-stream"}
                  />
                )}
              </>
            </div>
          ))}
        </div>
      </div>
      {/* Step 10 — file button + preview + text input + send */}
      <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
        {/* File preview strip */}
        {selectedFile && (
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg text-sm">
            {previewUrl ? (
              <img src={previewUrl} alt="preview" className="w-12 h-12 object-cover rounded" />
            ) : (
              <span>📎</span>
            )}
            <span className="truncate">{selectedFile.name}</span>
            <button
              type="button"
              onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
              className="ml-auto text-red-500 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,.pdf,.mp4"
            onChange={handleFileChange}
          />

          {/* Paperclip button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
            title="Attach file"
          >
            📎
          </button>

          {/* Text input */}
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            className="flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}