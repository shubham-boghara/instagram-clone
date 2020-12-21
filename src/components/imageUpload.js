import React, {useState} from "react";
import {Button} from "@material-ui/core";
import {storage,db} from "../firebase";
import firebase from "firebase";
import './imageUpload.css';

const ImageUpload = ({username,userid}) => {
    const [caption,setCaption] = useState('');
    const [image,setImage] = useState(null);
    const [progress, setprogress] = useState(0);


    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
     const uploadTask = storage.ref(`images/${image.name}`).put(image);
     uploadTask.on(
         "state_change",
     (snapshot) => {
             const progress = Math.round(
                 (snapshot.bytesTransferred / snapshot.totalBytes) *100
             );
             setprogress(progress)
        },
        (error) => {
             console.log(error);
             alert(error.message);
        },
         ()=>{
             storage
                 .ref("images")
                 .child(image.name)
                 .getDownloadURL()
                 .then(url => {
                     db.collection("posts").add({
                         timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                         caption: caption,
                         imageUrl: url,
                         username: username,
                         userid:userid,
                     })

                     setprogress(0);
                     setCaption("");
                     setImage(null);
                 })
         }
     )
    }

    return (
        <div className="imageUpload">
            <progress value={progress} max="100"
            className="progress"></progress>
          <input type="text"
                 placeholder="Enter a caption..."
                 onChange={event => setCaption(event.target.value)}
                 value={caption}/>
          <input type="file" onChange={handleChange}/>
          <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload;
