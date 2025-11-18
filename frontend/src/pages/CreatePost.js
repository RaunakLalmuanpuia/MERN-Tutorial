import React, { useEffect} from "react";
import axios from "axios";
import {Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup';
import {useNavigate} from 'react-router-dom'


function CreatePost() {
    let navigate = useNavigate();
    const initialValues = {
        title: '',
        postText: '',
    }


    useEffect(() => {
        if(!localStorage.getItem('accessToken')){
            navigate('/login');
        }
    }, []);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required(),
        postText: Yup.string().required(),
    })

    const onsubmit = (data) => {

        axios.post("http://localhost:3001/posts", data,{
            headers: {accessToken: localStorage.getItem('accessToken')},
        }).then((res) => {
            console.log("It works!");
            navigate("/")
        })

    }



    return (
        <div className="createPostPage">
            <Formik initialValues={initialValues} onSubmit={onsubmit}  validationSchema={validationSchema}>
                <Form className="formContainer">
                    <label htmlFor="title">Title</label>
                    <ErrorMessage name="title" component="span" />
                    <Field id="inputCreatPost" name="title" type="text" placeholder="Title" />

                    <label htmlFor="title">Post</label>
                    <ErrorMessage name="postText" component="span" />
                    <Field id="inputCreatPost" name="postText" type="text" placeholder="Post" />


                    <button type="submit">Create Post</button>
                </Form>
            </Formik>
        </div>
    )
}

export default CreatePost;