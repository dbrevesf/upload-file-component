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
  type ResumableFile = Resumable.ResumableFile;

  useEffect(() => {
    const r = new Resumable({
      target: 'http://localhost:3000/upload',
      chunkSize: 1024 * 1024 * 5,
      maxFiles: 1,
      query: {importName: importName}
    });

    const fileAdded = (file: ResumableFile): void => {
      setFile(file.file);
      setFileName(file.fileName);
      console.log('FileAdded');
    };

    const fileError = (file: ResumableFile, message: string): void => {
      console.log(file.fileName);
      console.log(message);
    }

    const fileSuccess = (file: ResumableFile): void => {
      console.log('Success');
    }

    const cleanFields = () => {
      setUploadPercentage(0);
    }

    const uploadProgress = () => {
      console.log(r.progress());
      const progress = Math.round(r.progress()*100);
      if (progress < 100) {
        setUploadPercentage(progress);
      } else {
        setUploadPercentage(progress);
        setTimeout(cleanFields, 10000);
      }
    }
    
    if(!r.support) {
      setMessage('Resumable is not installed!');
    } else {    
      if (uploaderRef) {
        r.assignBrowse(uploaderRef, false);
        r.on('fileAdded', fileAdded);
        r.on('fileError', fileError);
        r.on('fileSuccess', fileSuccess);
        r.on('progress', uploadProgress);
      }
    }
    const resumableNeedsFile = resumable.current && r.files.length === 0
    if (resumableNeedsFile) {
      if (file) {
        r.addFile(file);  
      }
    }
    resumable.current = r;
  }, [uploaderRef, importName])
  

  const onChangeImportName = (e: any) => {
    setImportName(e.target.value);
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (resumable.current) {
      resumable.current.upload();
    }
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
