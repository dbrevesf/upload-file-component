import React, { useState, useEffect } from "react";
import Message from "./Message";
import ProgressBar from "./ProgressBar";
import Resumable from "resumablejs";

const FileUpload: React.FC = () => {

  const [file, setFile] = useState<Resumable.ResumableFile>();
  const [fileName, setFileName] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({
    fileName: "",
    filePath: "",
  });
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [importName, setImportName] = useState('Set an import name. Ex: modeldata');
  const [uploaderRef, setUploaderRef] = useState<HTMLInputElement | null | undefined>();
  
  const r = new Resumable({
    target: 'http://localhost:3000/upload',
    chunkSize: 1024 * 1024 * 5,
    maxFiles: 1,
  });
  
  if(!r.support) {
    console.log('nao Rolou');
    setMessage('Resumable is not installed!');
  } else {    
    console.log('Rolou');  
    if (uploaderRef) {
      console.log("Toaki")
      r.assignBrowse(uploaderRef, false);
      r.on('fileAdded', (file, event) => {
        r.upload();
        setFile(file);
        setFileName(file.fileName);
        console.log('FileAdded');

        console.log(file);
      });
      r.on('fileError', (file, message) => {
        console.log(file.fileName);
        console.log(message);
      });
      r.on('fileSuccess', (file) => {
        console.log('Sucesso');
      })
    }
  }

  const onChangeImportName = (e: any) => {
    setImportName(e.target.value);
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();
    console.log(file);
    console.log("CHAMEI O UPLOAD")
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

  

  // Resumable.js isn't supported, fall back on a different method
  // if(!r.support) {
  //   $('.resumable-error').show();
  // } else {
  //   // Show a place for dropping/selecting files
  //   $('.resumable-drop').show();
  //   r.assignDrop($('.resumable-drop')[0]);
  //   r.assignBrowse($('.resumable-browse')[0]);

  //   // Handle file add event
  //   r.on('fileAdded', function(file){
  //       // Show progress pabr
  //       $('.resumable-progress, .resumable-list').show();
  //       // Show pause, hide resume
  //       $('.resumable-progress .progress-resume-link').hide();
  //       $('.resumable-progress .progress-pause-link').show();
  //       // Add the file to the list
  //       $('.resumable-list').append('<li class="resumable-file-'+file.uniqueIdentifier+'">Uploading <span class="resumable-file-name"></span> <span class="resumable-file-progress"></span>');
  //       $('.resumable-file-'+file.uniqueIdentifier+' .resumable-file-name').html(file.fileName);
  //       // Actually start the upload
  //       r.upload();
  //     });
  //   r.on('pause', function(){
  //       // Show resume, hide pause
  //       $('.resumable-progress .progress-resume-link').show();
  //       $('.resumable-progress .progress-pause-link').hide();
  //     });
  //   r.on('complete', function(){
  //       // Hide pause/resume when the upload has completed
  //       $('.resumable-progress .progress-resume-link, .resumable-progress .progress-pause-link').hide();
  //     });
  //   r.on('fileSuccess', function(file,message){
  //       // Reflect that the file upload has completed
  //       $('.resumable-file-'+file.uniqueIdentifier+' .resumable-file-progress').html('(completed)');
  //     });
  //   r.on('fileError', function(file, message){
  //       // Reflect that the file upload has resulted in error
  //       $('.resumable-file-'+file.uniqueIdentifier+' .resumable-file-progress').html('(file could not be uploaded: '+message+')');
  //     });
  //   r.on('fileProgress', function(file){
  //       // Handle progress for both the file and the overall upload
  //       $('.resumable-file-'+file.uniqueIdentifier+' .resumable-file-progress').html(Math.floor(file.progress()*100) + '%');
  //       $('.progress-bar').css({width:Math.floor(r.progress()*100) + '%'});
  //     });
  // }

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
            // onChange={onChange}
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
