import React, {useEffect, useState} from "react";
import {db} from "../firebase";
import Avatar from "@material-ui/core/Avatar";
import verification from "../Instagram Verification Badge.svg"
import  './mypost.css';
import {Button} from "@material-ui/core";



const MyProfile = ({userid,username}) => {

    const [profile,setprofile] = useState([]);

    useEffect(()=>{
         db.collection("posts")
            .where("userid", "==", userid)
            .orderBy('timestamp', 'desc')
            .onSnapshot(snapshot => {
                setprofile(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    post:doc.data()
                })));
            })
        
    },[userid]);


    return(
        <div>
            <div><h2>My Posts</h2></div>
            <div>Username : {username}</div>
            {profile.map(profile => (
                <div className="post" key={profile.id}>
                    <div className="post__header">
                        <Avatar
                            className="post__avatar"
                            alt={username}

                        />
                        <h3>{profile.post.username}</h3>
                        {userid==="bllt3pI4BfhG6eik4mxVv0YTD0V2"&&
                        <img src={verification}
                             height="22px" width="22px" alt="ss"/>
                        }


                    </div>

                    <img className="post__image" src={profile.post.imageUrl} alt={profile.post.imageUrl}/>
                    <h4 className="post__text"><strong>{profile.post.username}</strong> {profile.post.caption}</h4>
                    <Button onClick={
                         () => (
                        db.collection('posts').doc(profile.id).delete().then(function() {
                        console.log("Document successfully deleted!");
                    }).catch(function(error) {
                        console.error("Error removing document: ", error);
                    })

                        )} >Delete</Button>

                </div>
            ))}

        </div>

    )
}

export  default MyProfile;
