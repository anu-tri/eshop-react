import React, { Component } from 'react'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {Table, Button} from 'react-bootstrap';
import { titleCase } from '../helpers';


const FormSchema = Yup.object().shape({
    "title": Yup.string().required("Required"),
    "description": Yup.string().required("Required"),
    "price":Yup.string().matches(/^\d+(\.\d{1,2})?$/,"Must be a Valid Price").required("Required"),
    "image":Yup.string().required("Required"),
    "category":Yup.string().required("Required")
})


export default class EditItems extends Component {

    constructor() {
        super();
        this.state={
            tokenError:false,
            categories:[],
            items:[],
            item:{},
            successfulPost: false,
            successfulDelete: false,
        }
    }

    componentDidMount(){
        this.getAllCats()
        this.getAllItems()
    }


    //get all categories
    getAllCats = async() =>{
        await fetch('https://fakestoreapi.com/products/categories')
        .then((response) => response.json())
        .then(json=>{
            this.setState({categories:json}, ()=>console.log(json + "fetched all categories."))
        });
    }

    
    //get all items/products
    getAllItems = async() =>{
        await fetch('https://fakestoreapi.com/products')
        .then((response) => response.json())
        .then(json=>{
            this.setState({items:json}, ()=>console.log("fetched all items."))
        });
    }


    handlePullDown=(event)=>{
        const newId = event.target.value;
        if (newId===0){return}
        const newitem = this.state.items.filter((i)=>i.id===parseInt(newId))[0];
        this.setState({item:newitem, successfulPost:false})
    }


    handleSubmit=({title, description, price, image, category}, id)=>{
        axios.put(`https://fakestoreapi.com/products/${id}`, {
            title:title,
            description:description,
            price:price,
            image:image,
            category:category
        })
        .then(res=>res.data)
        .then(json=>{this.setState({item:json,successfulPost:true}, ()=>console.log("item was modified." + json))})

    }


    render() {
        return (
            <div>
                
                {this.state.successfulPost?<p style={{color:"#FB4807"}}>Your item was modified</p>:""}
                {this.state.tokenError?<Redirect to='/login'/>:''}      
                
                {this.state.successfulPost?
                <Table bordered>
                <thead style={{backgroundColor:"#4380C3", color:"white", fontSize:"14px"}}>
                    <th style={{width:"100px"}}>ID</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Category</th>
                </thead>
                <tbody>
                    <tr>
                        <td style={{fontSize:"13px"}}>{this.state.item["id"]}</td>
                        <td style={{width:"150px"}}><img style={{width:"70px", height:"70px", border:"solid 2px lightgrey", objectFit:"contain"}} src={this.state.item["image"] ?? "https://res.cloudinary.com/cae67/image/upload/v1629310111/fakebook_shop/no-image_nkau78.png"}/></td>
                        <td style={{fontSize:"13px"}}>{titleCase(this.state.item["title"])}</td>
                        <td style={{width:"400px",fontSize:"15px"}}>{titleCase(this.state.item["description"])}</td>
                        <td style={{fontSize:"13px"}}>${this.state.item["price"]}</td>
                        <td style={{width:"200px",fontSize:"13px"}}>{titleCase(this.state.item["category"])}</td>
                    </tr>
                </tbody>
                </Table>
                : ""}


                <label htmlFor="itemsList"  className="form-label" style={{color:"#0052cc", fontSize:"15px"}}>Select an Item</label>
                <select id="options" name="itemsList" className="form-select form-select-lg mb-3" style={{color:"#4380C3", fontSize:"15px"}} onChange={(event)=>this.handlePullDown(event)}>
                    <option defaultValue={0} label="--List of items--" />
                    {this.state.items?.map(
                        (item)=><option key={item.id} value={item.id} label={item.title}/>
                    )}
                </select>
                {Object.entries(this.state.item??{}).length>0
                    ?
                    <>
                    
                    <Formik
                        initialValues={
                            {
                                title:this.state.item?.title ?? '',
                                description:this.state.item?.description ?? '',
                                price:this.state.item?.price ?? '',
                                image:this.state.item?.image ?? '',
                                category : this.state.item?.category ?? ''
                            }
                        }
                        enableReinitialize
                        validationSchema={FormSchema}
                        onSubmit={
                            (values,{resetForm})=>{
                                console.log(values);
                                this.handleSubmit(values, this.state.item?.id);
                                resetForm({
                                    title:'',
                                    description:'',
                                    image:'',
                                    price:'',
                                    category:''
                            });
                            }
                        }
                        >
                        {({ errors, touched })=>(
                            <Form>
                                <label htmlFor="title" className="form-label" style={{fontSize:"15px"}}>Item Name</label>
                                <Field name="title" className="form-control" style={{fontSize:"15px"}}/>
                                {errors.title && touched.title ? (<div style={{color:"red"}}>{errors.title}</div>):null}

                                <label htmlFor="description" className="form-label" style={{fontSize:"15px"}}>Description</label>
                                <Field name="description" className="form-control" style={{fontSize:"15px"}}/>
                                {errors.description && touched.description ? (<div style={{color:'red'}}>{errors.description}</div>):null}

                                <label htmlFor="price" className="form-label" style={{fontSize:"15px"}}>Price</label>
                                <Field name="price" className="form-control" style={{fontSize:"15px"}}/>
                                {errors.price && touched.price ? (<div style={{color:'red'}}>{errors.price}</div>):null}

                                <label htmlFor="image" className="form-label" style={{fontSize:"15px"}}>Image</label>
                                <Field name="image" className="form-control" style={{fontSize:"15px"}}/>
                                {errors.image && touched.image ? (<div style={{color:'red'}}>{errors.image}</div>):null}
                                
                                <label htmlFor="category" className="form-label" style={{fontSize:"15px"}}>Category</label>
                                <Field name="category" className="form-control" style={{fontSize:"15px"}}/>
                                {/* <Field as="select" name="category" className="form-select" onChange={(event)=>this.handleCatPullDown(event)}>
                                    <option defaultValue={-1} label="--Choose a category--"/>
                                    {this.state.categories?.map(
                                        (cat)=><option key={cat.indexOf(cat)} value={cat.indexOf(cat)}>{cat}</option>
                                    )}
                                </Field> */}
                                {errors.category && touched.category ? (<div style={{color:'red'}}>{errors.category}</div>):null}
                                <br/>

                                <Button  type="submit" style={{backgroundColor:"#FB4807"}}>Edit Item</Button>&nbsp;&nbsp;&nbsp;
                            </Form>
                        )
                        }

                    </Formik>
                    </>
                :''}

            </div>
        )
    }
}
