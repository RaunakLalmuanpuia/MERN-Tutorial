import React, {useContext} from "react";
import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {AuthContext} from '../helpers/AuthContext'

function Post(){

    let navigate = useNavigate();

    let {id} = useParams();

    const [postObject, setPostObject] = useState({});
    const [comments, setComment] = useState([]);
    const [newComment, setNewComment] = useState("");
    const {authState} = useContext(AuthContext);

    useEffect(()=>{
        axios.get("http://localhost:3001/posts/byId/"+id).then((res) => {
            setPostObject(res.data);
        })

        axios.get("http://localhost:3001/comments/"+id).then((res) => {
            setComment(res.data);
        })
    },[]);

    const addComment = () => {
        axios.post("http://localhost:3001/comments", {
            commentBody: newComment, PostId:id
        },{
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
        }).then((res) => {
            if(res.data.error){
                console.log(res.data.error)
            }
            else{
                const commentToAdd = {commentBody:newComment, username:res.data.username};
                setComment([...comments, commentToAdd]);
                setNewComment("");
            }

        })
    }

    const deleteComment = (commentId) => {
        console.log(id);
       axios.delete("http://localhost:3001/comments/"+commentId,{
           headers:{ accessToken: localStorage.getItem("accessToken"),}
        }).then((res) => {
            if(res.data.error){
                console.log(res.data.error)
            }
            setComment(comments.filter((val)=>{
                return val.id !== id;
            }));
       })
    }

    const deletePost = (id) => {
        axios.delete("http://localhost:3001/posts/"+id,{
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            }
        }).then((res) => {
            if(res.data.error){
                console.log(res.data.error)
            }
            navigate('/');
        })
    }

    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post" id="individual">
                    <div className="title"> {postObject.title} </div>
                    <div className="body">{postObject.postText}</div>
                    <div className="footer">{postObject.username}
                        {authState.username === postObject.username &&(
                            <button onClick={()=> {deletePost(postObject.id)}} >Delete Post</button>
                        )}
                    </div>
                </div>
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input
                        type="text"
                        placeholder="Comment..."
                        autoComplete="off"
                        value={newComment}
                        onChange={(event) => {
                            setNewComment(event.target.value);
                        }}
                    />
                    <button onClick={addComment}> Add Comment</button>
                </div>
                <div className="listOfComments">
                    {comments.map((comment, key) => {
                        return (
                            <div key={key} className="comment">
                                {comment.commentBody}
                                <label>Username: {comment.username}</label>
                                {authState.username === comment.username && <button onClick={()=>deleteComment(comment.id)}>X</button>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Post;