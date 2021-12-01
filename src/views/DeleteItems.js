import React, { Component } from 'react'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {Table, Button} from 'react-bootstrap';
import { titleCase } from '../helpers';


export default class EditItems extends Component {

    constructor() {
        super();
        this.state={
            tokenError:false,
            items:[],
            item:{},
            successfulDelete: false,
        }
    }

    componentDidMount(){
        //this.getAllCats()
        this.getAllItems()
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
        console.log(newitem)
        this.setState({item:newitem, successfulDelete:false})
    }


    handleSubmit= (id)=>{
        console.log("ID to delete: "+ id)
        if (window.confirm(`Are you sure you want to delete ${this.state.item.title}`)){
             axios.delete(`https://fakestoreapi.com/products/${id}`)
            .then(res=>res.data)
            .then(json=>{this.setState({item:json,successfulDelete:true}, ()=>console.log(`Item ID: ${id} was deleted`))})
        }
    }


    render() {
        return (
            <div>
                
                {this.state.successfulDelete?<p style={{color:"#FB4807", fontSize:"15px"}} >Item - {this.state.item.title} was deleted</p>:""}
                {this.state.tokenError?<Redirect to='/login'/>:''}      
                
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
                    <hr/>
                    <h6>Item ID: {this.state.item?.id ?? '000'} - {this.state.item?.title??"No Item Name"}</h6>
                    <hr/>
                    <br/>
                    <Formik
                        initialValues={
                            { }
                        }
                        onSubmit={
                            ()=>{
                                this.handleSubmit(this.state.item?.id);
                            }
                        }
                        >
                        {({ errors, touched })=>(
                            <Form>
                                <Button  type="submit" style={{backgroundColor:"#FB4807"}}>Delete Item</Button>&nbsp;&nbsp;&nbsp;
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
