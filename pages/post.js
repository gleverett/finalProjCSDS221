import { auth, db } from "@/utils/firebase";
import {useAuthState} from "react-firebase-hooks/auth"
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import {collection, addDoc, serverTimestamp, doc, updateDoc} from "firebase/firestore";
import {toast} from 'react-toastify';
import postcss from "postcss";

export default function Post() {
    //Form state
    const [post, setPost] = useState({ description: ""});
    const [user, loading] = useAuthState(auth);
    const route = useRouter(); 
    const updateData = route.query;

    //submit post
    const submitPost = async (event) => {
        event.preventDefault();

        //run validation checks
        if(!post.description) {
            toast.error("Description is empty.", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
            return;
        }
        if(post.description.length > 300) {
            toast.error("Description is too long.", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
            return;
        }

        if(post?.hasOwnProperty("id")){
            const docRef = doc(db, 'posts', post.id);
            const updatedPost = {...post, timestamp: serverTimestamp()}
            await updateDoc(docRef, updatedPost);
            return route.push('/');
        } else {
            //make a new post
            const collectionRef = collection(db, 'posts');
            await addDoc(collectionRef, {
            ...post,
            timestamp: serverTimestamp(),
            user: user.uid,
            avatar: user.photoURL,
            username: user.displayName,
        });
        //reset page
        setPost({description: ""});
        toast.success("Post it added.", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
        });
        return route.push("/");
        }
    };

    //check user
    const checkUser = async () => {
        if(loading) return;
        if(!user) route.push("/auth/login");
        if(updateData.id) {
            setPost({description: updateData.description, id: updateData.id});
        }
    };

    useEffect(() => {
        checkUser();
    }, [user, loading]);

    return(
        <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
            <form onSubmit={submitPost}>
                <h1 className="text-2xl font-bold">
                    {post.hasOwnProperty('id') ? 'Update your post it:' : 'Create a post it:'}
                </h1>
                <div className="py-2">
                    <h3 className="text-lg font-medium py-2">Description</h3>
                    <textarea value={post.description} onChange={(event) => setPost({...post, description: event.target.value})} className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-small"></textarea>
                    <p className={`text-purple-500 font-medium text-sm ${post.description.length>300 ? 'text-red-600' : ''}`}>{post.description.length}/300</p>
                </div>
                <button type="submit" className="w-full bg-purple-500 text-white font-medium p-2 my-2 rounded-lg text-small">Submit</button>
            </form>
        </div>
    )
}