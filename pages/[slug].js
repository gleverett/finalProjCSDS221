import Message from "@/components/message";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { auth, db } from "@/utils/firebase";
import { toast } from "react-toastify";
import { doc, updateDoc, arrayUnion, Timestamp, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";

export default function Details() {
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
    const [background, setBackground] = useState(getBackground());
    const router = useRouter();
    const routeData = router.query;
    const [comment, setComment] = useState("");
    const [allComments, setAllComments] = useState([]);
    
    //submit a comment
    const submitComment = async() => {
        //check if user is logged in
        if(!auth.currentUser) return router.push("/auth/login");
        if(!comment) {
            toast.error("Your comment is empty.", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
            return;
        }
        const docRef = doc(db, 'posts', routeData.id);
        await updateDoc(docRef, {
            comments: arrayUnion({
                comment,
                avatar: auth.currentUser.photoURL,
                username: auth.currentUser.displayName,
                time: Timestamp.now(),
            }),
        });
        
        setComment('');
    };

    //get comments
    const getComments = async () => {
        const docRef = doc(db, 'posts', routeData.id);
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            setAllComments(snapshot.data().comments);
        });
        return unsubscribe;
    };

    useEffect(() => {
        if(!router.isReady) return;
        getComments();
    }, [router.isReady]);

    return(
        <div>
            <Box className={background}>
                <Message {...routeData}>

                </Message>
            </Box>
            <div className="my-4">
                <div className="flex">
                    <input className="bg-purple-100 w-full p-2 text-black text-sm" onChange={(event) => setComment(event.target.value)} type="text" value={comment} placeholder="Add a comment "/>
                    <button onClick={submitComment} className="bg-purple-300 text-white py-2 px-4 text-sm">Submit</button>
                </div>
                <div className="py-6">
                    <h2 className="font-bold">Comments:</h2>
                    {allComments?.map(comment => (
                        <div className="bg-purple-100 p-4 my-4 border-2" key={comment.time}>
                            <div className="flex items-center gap-2 mb-4">
                                <img className="w-10 rounded-full" src={comment.avatar} alt=""/>
                                <h2>{comment.username}</h2>
                            </div>
                            <h2>{comment.comment}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}