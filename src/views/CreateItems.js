import React, { Component } from 'react'
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import {Redirect} from 'react-router-dom';
import {Table,Button} from 'react-bootstrap'
import {getCategories} from '../api/apiCategory'
import axios from 'axios'
import { titleCase } from '../helpers';

const FormSchema = Yup.object().shape({
    "title": Yup.string().required("Required"),
    "description": Yup.string().required("Required"),
    "price":Yup.string().matches(/^\d+(\.\d{1,2})?$/,"Must be a Valid Price").required("Required"),
    "image":Yup.string().required("Required"),
    "category":Yup.string().required("Required")
})

const initialValues = {
    title:'',
    description:'',
    price:'',
    image:'',
    category:''
}

export default class CreateItems extends Component {
    constructor() {
        super();
        this.state={
            tokenError:false,
            categories:[],
            newitem:{},
            succussfulPost:false
        }
    }

    componentDidMount(){
        this.getAllCats()
    }

    //using axios instead of fetch as fetch just returns the id of new item
    //whereas axios returns the complete data for the newly created item
    handleSubmit=({title, description, price, image, category})=>{
        axios.post(`https://fakestoreapi.com/products`, {
            title:title,
            description:description,
            price:price,
            image:image,
            category:category
        })
        .then(res=>res.data)
        .then(json=>{this.setState({newitem:json,successfulPost:true}, ()=>console.log("new item created."))})
        
    }


    //get all categories
    getAllCats = async() =>{
        await fetch('https://fakestoreapi.com/products/categories')
        .then((response) => response.json())
        .then(json=>{
            this.setState({categories:json}, ()=>console.log(json + "fetched all categories."))
        });
    }


    render() {
        
        return (
            <div>
            {this.state.successfulPost?<p style={{color:"#FB4807", fontSize:"15px"}}>Your item was created</p>:""}
            {this.state.tokenError?<Redirect to='/login'/>:''}   

            {this.state.successfulPost?
            <Table bordered>
                <thead style={{backgroundColor:"#4380C3", color:"white", fontSize:"14px"}}>
                    <th>Image</th>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Category</th>
                </thead>
                <tbody>
                    <tr>
                        
                        <td style={{width:"150px"}}><img style={{width:"70px", height:"70px", border:"solid 2px lightgrey", objectFit:"contain"}} src={this.state.newitem["image"] ?? "https://res.cloudinary.com/cae67/image/upload/v1629310111/fakebook_shop/no-image_nkau78.png"}/></td>
                        <td>{this.state.newitem["id"]}</td>
                        <td>{titleCase(this.state.newitem["title"])}</td>
                        <td>{titleCase(this.state.newitem["description"])}</td>
                        <td>${this.state.newitem["price"]}</td>
                        <td style={{width:"250px"}}>{titleCase(this.state.newitem["category"])}</td>
                    </tr>
                </tbody>
            </Table>
                : ""}

            <br/>
                <Formik
                initialValues={initialValues}
                validationSchema={FormSchema}
                onSubmit={
                    (values, {resetForm}) => {
                        this.handleSubmit(values);
                        resetForm(initialValues)
                    }
                }
                >
                    {
                        ({errors, touched})=>(
                            <Form>
                                <label htmlFor="title" className="form-label" style={{fontSize:"15px"}}>Item Name</label>
                                <Field name="title" className="form-control"/>
                                {errors.title && touched.title ? (<div style={{color:'red'}}>{errors.title}</div>):null}

                                <label htmlFor="description" className="form-label" style={{fontSize:"15px"}}>Description</label>
                                <Field name="description" className="form-control"/>
                                {errors.description && touched.description ? (<div style={{color:'red'}}>{errors.description}</div>):null}

                                <label htmlFor="price" className="form-label" style={{fontSize:"15px"}}>Price</label>
                                <Field name="price" className="form-control"/>
                                {errors.price && touched.price ? (<div style={{color:'red'}}>{errors.price}</div>):null}

                                <label htmlFor="image" className="form-label" style={{fontSize:"15px"}}>Image</label>
                                <Field name="image" className="form-control"/>
                                {errors.image && touched.image ? (<div style={{color:'red'}}>{errors.image}</div>):null}

                                <label htmlFor="category" className="form-label" style={{fontSize:"15px"}}>Category</label>
                                <Field name="category" type="category" className="form-control" />
                                 
                                {errors.category && touched.category ? (<div style={{color:'red'}}>{errors.category}</div>):null}
                                <br/>
                                <Button type="submit" style={{backgroundColor:"#FB4807"}}>Create Item</Button>
                            </Form>
                        )
                    }

                </Formik>
            </div>
        )
    }
}
