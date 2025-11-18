import React, {useEffect, useState} from "react";
import {useParams,useNavigate} from "react-router-dom";
import axios from "axios";

function Profile() {
    let {id} = useParams();
    let navigate = useNavigate();
    const [username, setUsername] = useState({});
    const[listofPosts, setListofPosts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/auth/basicInfo/"+id).then((res) => {
            setUsername(res.data);
        })

        axios.get("http://localhost:3001/posts/byUserId/"+id).then((res) => {
            setListofPosts(res.data);
        })


    }, []);
    return (
        <div className="profilePageContainer">
            <div className="basicInfo"><h1>Username: {username.username}</h1></div>
            <div className="listOfPosts">
                {listofPosts.map((value, key) => {
                    return (
                        <div key={key} className="post" >
                            <div className="title">
                                {value.title}
                            </div>
                            <div className="body" onClick={()=>navigate(`/post/${value.id}`)}>
                                {value.postText}
                            </div>
                            <div className="footer">
                                <div className="username"><label>{value.Likes.length}</label></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Profile;