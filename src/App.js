import React, {useState,useEffect} from "react";
import './App.css';
import Post from "./components/Post";
import {db} from "./firebase";
import Modal from '@material-ui/core/Modal';
import {Button, makeStyles} from "@material-ui/core";
import {auth} from "./firebase";
import ImageUpload from "./components/imageUpload";
import MyProfile from "./components/Mypost";



function getModalStyle() {
    const top = 50
    const left = 50

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


function App() {
    const classesName = useStyles();
    const [modalStyle] = useState(getModalStyle)
    const [openSign, setopenSign] = useState(false);
    const [posts , setPost] = useState([]);
    const[open,setOpen] = useState(false);
    const[username,setUsername] = useState("");
    const[email,setEmail] = useState("");
    const[password,setPassword] = useState("");
    const [user,setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if(authUser) {
               setUser(authUser);


            }else{
               setUser(null);
            }
        })
        return () => {
            unsubscribe();
        }
    },[user,username]);


    useEffect(() => {
         db.collection("posts")
             .orderBy('timestamp','desc')
             .onSnapshot(snapshot => {
                setPost(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        post:doc.data()
                    })));
             })
        console.log(posts);



    },[]);

    const signUp = (event) => {
        event.preventDefault();
        auth.createUserWithEmailAndPassword(email,password)
            .then((authUser) => {
            return authUser.user.updateProfile({
              displayName:username
            })
        })
            .catch((error) => alert(error.message))
        setOpen(false);
    }

const signIn = (event) => {
      event.preventDefault();
      auth.signInWithEmailAndPassword(email,password)
          .catch((error) => alert(error.message));
      setopenSign(false);
}



  return (
    <div className="App">





        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            <span style={modalStyle} className={classesName.paper}>
                <form className="app__signup">
                    <div className="signup__logo">
                       <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
                    </div>


                   <div className="form">
                    <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <Button type="submit" onClick={signUp}>Sign up</Button>

                   </div>

                </form>



            </span>
        </Modal>
        <Modal
            open={openSign}
            onClose={() => setopenSign(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            <span style={modalStyle} className={classesName.paper}>
                <form className="app__signup">
                    <div className="signup__logo">
                       <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
                    </div>


                   <div className="form">
                    <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <Button type="submit" onClick={signIn}>Sign In</Button>

                   </div>

                </form>



            </span>
        </Modal>

        <div className="app_header">
            <img className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""/>
            {user ? (
                <Button onClick={() =>auth.signOut()}>Log out</Button>
            ) : (
                <div className="app_loginContainer">
                    <Button onClick={() => setopenSign(true)}>Login</Button>
                    <Button onClick={() => setOpen(true)}>Sign up</Button>
                </div>

            )}
        </div>
        <div className="op">
        <div className="app__posts">
            {posts.map((post,id) => (
                <Post key={id} postId={post.id} username={post.post.username} caption={post.post.caption} imageurl={post.post.imageUrl}
                      userid={post.post.userid} user={user}/>
            ))}

            {user?.displayName ? (
                <ImageUpload username={user.displayName} userid={user.uid}/>
            ):(
                <h3 className="h3">Sorry you need to login to upload</h3>
            )}
        </div>
        <div className="app__profile">
            {user?.displayName?(<MyProfile userid = {user.uid} username =  {user.displayName} />):(<div>Please First Login / Signup<br />Sorry you need to login to upload</div>)}
        </div>
            </div>


    </div>
  );
}

export default App;
