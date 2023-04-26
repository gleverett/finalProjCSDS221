import Head from "next/head"
import Message from "@/components/message"
import {useEffect, useState} from "react";
import { db } from "@/utils/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import postcss from "postcss";
import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Checkbox from "@mui/material/Checkbox";
import { pink } from '@mui/material/colors';
import { Box } from "@mui/material";
import {useAuthState} from 'react-firebase-hooks/auth';
import { auth } from "@/utils/firebase";
import { useRouter } from "next/router";


export default function Home() {
  //create a state with all posts
  const [allPosts, setAllPosts] = useState([]);
  const [user, loading] = useAuthState(auth);
  const route = useRouter();

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
  const getPosts = async () => {
    const collectionRef = collection(db, 'posts');
    const q = query(collectionRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
    });
    return unsubscribe;
  }

  useEffect(() => {
    if(!user) {
      route.push("/auth/login");
    } else {
      getPosts();
    }
  }, [user, loading]);

  return(
    <div>
      <div className="my-12 text-lg">
        <h2 className="text-xl font-medium">See what other people are posting!</h2>
        <br></br>
        {allPosts.map(post => 
        <div>
        <Box className={getBackground()}>
        <Message className="text-md" {...post} key={post.id}>
            {/* LIKES
            <FormControlLabel
              control = {
                <Checkbox icon={<FavoriteBorderIcon />} checkedIcon={<FavoriteIcon />} 
                sx={{
                  color: pink[800],
                  '&.Mui-checked': {
                    color: pink[600],
                  },
                }}/>
              }/> */}
            {/* COMMENTS */}
            <Link className="text-sm text-gray-500" href={{pathname: `/${post.id}`, query: {...post} }}>
              <button>{post.comments?.length>0 ? post.comments?.length :  "0"} comments.</button>
            </Link>
        </Message>
        </Box>
        <br></br>
        </div>
        )}
      </div>
    </div>
  )
}