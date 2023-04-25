import { auth, db } from "@/utils/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {collection, query, where, onSnapshot, doc, deleteDoc} from "firebase/firestore";
import Message from "@/components/message";
import {BsTrash2Fill} from "react-icons/bs"
import {AiFillEdit} from "react-icons/ai";
import Link from "next/link";
import { Box } from "@mui/material";

export default function Dashboard() {
    const route = useRouter();
    const [user, loading] = useAuthState(auth);
    const [posts, setPosts] = useState([]);

    //user log-in checks
    console.log(user);
    const getData = async () => {
        if(loading) return;
        if(!user) return route.push("/auth/login");
        const collectionRef = collection(db, "posts");
        const q = query(collectionRef, where('user', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot => {
            setPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }));
        return unsubscribe;
    };

    //delete a post
    const deletePost = async (id) => {
        const docRef =  doc(db, 'posts', id);
        await deleteDoc(docRef);
    }


  const getBackground = () => {
    let randomNum = Math.floor(Math.random()*4);
    switch(randomNum) {
        case 0:
            return "bg-amber-100";
        case 1: 
            return "bg-green-100";
        case 2:
            return "bg-cyan-100";
        case 3:
            return "bg-pink-100";
    }
}

    //get user data
    useEffect(() => {
        getData();
    }, [user, loading]);

    return(
        <div>
            <h2 className="font-medium">Your posts</h2>
            <br></br>
            <div>
                {posts.map(post => {
                    return(
                        <div>
                            <Box className={getBackground()}>
                            <Message {...post} key={post.id}>
                            <div className="flex gap-4">
                                <button onClick={() => deletePost(post.id)} className="text-red-800 flex items-center justify-center gap-2 py-2 text-sm">
                                    <BsTrash2Fill classname="text-2xl"/>Delete</button>
                                <Link href={{pathname: '/post', query: post}}>
                                    <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                                        <AiFillEdit className="text-2xl"/>Edit
                                    </button>
                                </Link>
                                
                            </div>
                        </Message>
                        </Box>
                        <br />
                        </div>);
                })}
            </div>
            <button className="font-medium text-white bg-purple-300 py-2 px-4 my-6" onClick={() => auth.signOut()}>Log out</button>
        </div>
    )
}