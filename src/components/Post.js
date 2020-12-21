import React, {useEffect, useState} from "react"
import './Post.css'
import Avatar from "@material-ui/core/Avatar";
import verification from "../Instagram Verification Badge.svg"
import {db} from "../firebase";
import {Button} from "@material-ui/core";
import firebase from "firebase";


const Post = ({username,caption,imageurl,userid,postId,user}) => {
    const [comments,setcomments] = useState([]);
    const [comment,setcomment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId){
            unsubscribe = db
                 .collection("posts")
                 .doc(postId)
                 .collection("comments")
                .orderBy("timestamp","desc")
                 .onSnapshot((snapshot => {
                     setcomments(snapshot.docs
                         .map((doc)=>doc.data()));
                 }))

            }
        return () => {
            unsubscribe();
        }
    },[postId])

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId)
            .collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp : firebase.firestore.FieldValue.serverTimestamp()
        })
        setcomment('');
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
    className="post__avatar"
    alt={username}
    src="../logo.svg"
    />
    <h3>{username}</h3>
                {userid==="bllt3pI4BfhG6eik4mxVv0YTD0V2"&&
                <img src={verification}
                     alt="verification"
                     height="22px" width="22px"/>
                }

            </div>

            <img className="post__image" src={imageurl} alt={imageurl}/>
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>

                <div className="post__comments">
                    {comments.map((c) => (
                        <p key={c.text}>
                            <strong>{c.username} : </strong>{c.text}
                        </p>
                    ))

                    }
                </div>

            {user && (
                <form className="post__commentBox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setcomment(e.target.value)}
                    />
                    <Button
                        color="secondary"
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >post</Button>
                </form>
            )}

        </div>
    )
}

export default Post;

