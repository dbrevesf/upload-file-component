import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import ProgressBar from "./ProgressBar";
import Resumable from "resumablejs";

const FileUpload: React.FC = () => {

  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({fileName: "",filePath: "",});
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [importName, setImportName] = useState('Set an import name. Ex: modeldata');
  const [uploaderRef, setUploaderRef] = useState<HTMLInputElement | null | undefined>();
  const resumable = useRef<Resumable>();

  useEffect(() => {
    const r = new Resumable({
      target: 'http://localhost:3000/upload',
      chunkSize: 1024 * 1024 * 5,
      maxFiles: 1,
      query: {importName: importName}
    });
    
    if(!r.support) {
      setMessage('Resumable is not installed!');
    } else {    
      console.log('Rolou');  
      if (uploaderRef) {
        r.assignBrowse(uploaderRef, false);
        r.on('fileAdded', (file, event) => {
          setFile(file.file);
          setFileName(file.fileName);
          console.log('FileAdded');
        });
        r.on('fileError', (file, message) => {
          console.log(file.fileName);
          console.log(message);
        });
        r.on('fileSuccess', (file) => {
          console.log('Success');
        });
      }
    }
    if (resumable.current && r.files.length === 0) {
      if (file) {
        r.addFile(file);  
      }
    }
    resumable.current = r;
  }, [importName, uploaderRef, file])
  

  

  const onChangeImportName = (e: any) => {
    setImportName(e.target.value);
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (resumable.current) {
      resumable.current.upload();
    }
    
    // const formData = new FormData();
    // formData.append("file", file);
    // try {
    //   const res = await axios.post("/upload", formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //     onUploadProgress: (progressEvent) => {
    //       const percentage = Math.round(
    //         (progressEvent.loaded * 100) / progressEvent.total
    //       );
    //       setUploadPercentage(percentage);
    //       setTimeout(() => setUploadPercentage(0), 10000);
    //     },
    //   });
    //   const { fileName, filePath } = res.data;
    //   setUploadedFile({ fileName, filePath });
    //   setMessage("File Uploaded");
    // } catch (error) {
    //   setUploadPercentage(0);
    //   if (error.response.status === 500) {
    //     setMessage("There was a problem with the server");
    //   } else {
    //     setMessage(error.response.data.msg);
    //   }
    // }
  };

  
  return (
    <>
      {message ? <Message msg={message} /> : null}
      <form>
        <div className="custom-file">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            name='customFile'
            ref={node => setUploaderRef(node)}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {fileName}
          </label>
        </div>
        <div className="custom-file mt-4">
              <input
                type="text"
                className="form-control"
                id="importName"
                onChange={onChangeImportName}
                placeholder={importName}
              />
            </div>
        
        <div className="mt-4">
          <ProgressBar percentage={uploadPercentage} />
        </div>
        <span 
          className="btn btn-primary btn-block mt-4"
          id="browseFile"
          onClick={onSubmit}
        >
          Upload
        </span>
      </form>
      {uploadedFile ? (
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h3 className="text-center"> {uploadedFile.fileName}</h3>
            <img style={{ width: "100%" }} src={uploadedFile.filePath} alt="" />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FileUpload;
