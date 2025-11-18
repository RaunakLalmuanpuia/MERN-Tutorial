import axios from 'axios';
import {useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'

import ThumbUpAlt from '@mui/icons-material/ThumbUpAlt';



function Home(){
    const [listOfPosts, setlistOfPosts] = useState([]);
    const [likedPosts, setlikedPosts] = useState([]);

    let navigate = useNavigate();


    useEffect(() => {

        if(!localStorage.getItem('accessToken')){
           navigate('/login');
        }else{
            axios.get("http://localhost:3001/posts",
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken")}
                }).then((res) => {
                setlistOfPosts(res.data.list);
                setlikedPosts(res.data.likedPosts.map((like)=>{
                    return like.PostId;
                }));
            })
        }


    }, [])


    const likeAPost = (postId) => {
        axios.post("http://localhost:3001/likes",{PostId:postId},{
            headers: {
                accessToken: localStorage.getItem("accessToken")}
        }).then((res) => {
                setlistOfPosts(listOfPosts.map((post)=>{
                    if(post.id === postId){
                        if(res.data.liked){
                            return {...post,Likes: [...post.Likes, 0]};
                        }else {
                            const likesArray = post.Likes;
                            likesArray.pop();
                            return {...post,Likes: likesArray};
                        }
                    }else{
                        return post;
                    }
                }));

                if(likedPosts.includes(postId)){
                    setlikedPosts(likedPosts.filter((id)=>{
                        return id !== postId;
                    }));
                }else{
                    setlikedPosts([...likedPosts, postId]);
                }
                console.log("Liked or Unliked");
        })
    }

    return (
        <div>
            {listOfPosts.map((value, key) => {
                return (
                    <div key={key} className="post" >
                        <div className="title">
                            {value.title}
                        </div>
                        <div className="body" onClick={()=>navigate(`/post/${value.id}`)}>
                            {value.postText}
                        </div>
                        <div className="footer">
                            <div className="username">{value.username}</div>
                            <div className="buttons">
                                <ThumbUpAlt
                                    onClick={() => {
                                        likeAPost(value.id);
                                    }}
                                    className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"}
                                />
                                <label>{value.Likes.length}</label>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default Home;