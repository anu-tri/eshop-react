import React, { Component } from 'react'
import {Table, Button} from 'react-bootstrap'
import {Redirect} from 'react-router-dom'

export default class ManageItems extends Component {
    constructor(){
        super();
        this.state = {
            items : []
        };
    }


    componentDidMount(){
        this.getAllItems();
    }

    //get all categories
   getAllItems = async() => {
       await fetch('https://fakestoreapi.com/products')
       .then((response) => response.json())
       .then(json=>{
       this.setState({items:json}, ()=>console.log("fetched all items."))
    });
   }

   //edit item
   edititem = () => {
        <Redirect
            to={{
                pathname: "/EditItems",
                props: { token: localStorage.getItem("token"), items: this.state.items },
            }}
        />
   }

    // await fetch(`https://fakestoreapi.com/products/${id}`,{
    //     method:"PUT",
    //     body:JSON.stringify(
    //         {
    //             title: 'test product',
    //             price: 13.5,
    //             description: 'lorem ipsum set',
    //             image: 'https://i.pravatar.cc',
    //             category: 'electronic'
    //         }
    //     )
    // })
    // .then(res=>res.json())
    // .then(json=>{this.setState({items:json}, ()=>console.log("modified the item."))})



   //delete item
//    deleteitem = async() => {

//    }

    render() {
        return (
            <div>
                <Table bordered hover>
                <thead style={{backgroundColor:"#4380C3", color:"white", fontSize:"14px"}}>
                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                        {this.state.items.map(
                            (i)=>(
                                <tr key={i.id}>
                                    <td>{i.id}</td>
                                    <td>
                                        <img 
                                        alt = "item loading"
                                        style={{height:"100px", objectFit:"contain"}}
                                        src={i.image ?? "https://res.cloudinary.com/cae67/image/upload/v1629310111/fakebook_shop/no-image_nkau78.png"}
                                        />
                                    </td>
                                    <td>{i.title ?? "No Name"}</td>
                                    <td>{i.description ?? "No Description"}</td>
                                    <td>${i.price.toFixed(2) ?? "No Price"}</td>
                                    <td>{i.category ?? "No Category"}</td>
                                    <td>
                                        <Button 
                                            variant="danger"
                                            // onClick={()=>props.removeFromCart(props.cart[key])}
                                            onClick={()=>this.edititem()}
                                            >
                                                Edit
                                        </Button>

                                    </td>
                                    <td>
                                    <Button 
                                            variant="danger"
                                            onClick={()=>this.deleteitem()}
                                            >
                                                Delete
                                        </Button>

                                    </td>
                                   
                                </tr>
                            )
                        )
                    }
                </tbody>
            </Table>
            </div>
        )
    }
}
