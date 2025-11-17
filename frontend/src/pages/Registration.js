import React from "react";
import axios from "axios";
import {Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup';

function Registration(){

    const initialValues = {
        username: '',
        password: '',
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(3).max(15).required(),
    })


    const onsubmit = (data) => {
        axios.post("http://localhost:3001/auth", data).then(()=>{
            console.log(data);
        })
    }



    return (
        <div>
            <Formik initialValues={initialValues} onSubmit={onsubmit}  validationSchema={validationSchema}>
                <Form className="formContainer">

                    <label htmlFor="title">Username</label>
                    <ErrorMessage name="username" component="span" />
                    <Field id="inputCreatPost" name="username" type="text" placeholder="Ex. Rambo" />

                    <label htmlFor="title">Password</label>
                    <ErrorMessage name="password" component="span" />
                    <Field id="inputCreatPost" name="password" type="password" placeholder="Password" />

                    <button type="submit">Register</button>
                </Form>
            </Formik>
        </div>
    )
}

export default Registration;