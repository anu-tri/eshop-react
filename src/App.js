import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./views/Home";
import Login from "./views/Login";
import Logout from "./views/Logout";
import SingleItem from "./views/SingleItem";
import Cart from "./views/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import {titleCase} from './helpers';
import ManageItems from "./views/ManageItems";
import CreateItems from "./views/CreateItems";
import EditItems from "./views/EditItems";
import DeleteItems from "./views/DeleteItems";
import { Container } from 'react-bootstrap'


export default class App extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      token: "",
      userFullName:"",
      isAdmin: false,
      cart:{},
      cartTotal:0
    };
  }

 
  
  componentDidMount() {
    if (typeof window !== "undefined") {
      window.addEventListener("storage",(e)=>{
        this.setState({cart:JSON.parse(localStorage.getItem("cart"))})
      })
    }
    }


  setUser = (user) => {
    this.setState({ user }, () => console.log("User is", this.state.user));
    // localStorage.setItem("user", user)
  };

  setUserName = (username) =>{
    let fullname = "";
    fetch('https://fakestoreapi.com/users')
    .then(response=>response.json())
    .then(json=>{
      for(let user of json){
        if(user.username === username){
          fullname = user.name.firstname + " " + user.name.lastname;
          this.setState({userFullName:titleCase(fullname)});
          localStorage.setItem("name",titleCase(fullname));
          break;
        }
      }
    })
  }

  
  setToken = (token) => {
    localStorage.setItem("token", token);
    this.setState({ token });
  };


  static getDerivedStateFromProps = (props, state) => {
    return { 
      token: localStorage.getItem("token"),
      name:localStorage.getItem("name"),
      cart: localStorage.getItem("cart")? JSON.parse(localStorage.getItem("cart")):{}
    };
  };

   
  doLogout=()=>{
    console.log("Logged out")
    localStorage.clear();
    this.setToken('');
    this.setUserName('');
    this.setState({isAdmin:false, cart:{}, userFullName:''});
    //alert("logout")

  }

  // cart section
  addToCart=(item)=>{
    let cart = this.state.cart
    if (cart[item.title]){
      cart[item.title].quantity++
    }else{
      cart[item.title]={...item,quantity:1}
    }
    this.setState({cart})
    localStorage.setItem("cart",JSON.stringify(cart))
    alert(`Thanks for adding ${item.title} to your cart`)
  }
  

  //The total number of items in the cart
  getCartItemTotal=()=>{
    let total=0
    for (const item in this.state.cart){
      total+=this.state.cart[item].quantity
    }
    return total
  }

  // the total price of all items in cart
  getCartTotalPrice=()=>{
    let total=0
    for (const item in this.state.cart){
      total+=this.state.cart[item].quantity*this.state.cart[item].price
    }
    return total
  }

  removeFromCart = (item)=>{
    let cart=this.state.cart;
    if (cart[item.title].quantity >1){
      cart[item.title].quantity--
    }else if (cart[item.title].quantity === 1){
      delete cart[item.title]
    }
    this.setState({cart})
    localStorage.setItem("cart",JSON.stringify(cart))
    alert(`You remove ${item.title} from your cart`)
  }

  removeAllFromCart=(item)=>{
    let cart=this.state.cart;
    if(cart[item.title]){
      delete cart[item.title];
    }
    this.setState({cart})
    localStorage.setItem("cart",JSON.stringify(cart))
    alert(`You remove all of ${item.title}s from your cart`)
  }

  clearCart=()=>{
    this.setState({cart:{}})
    localStorage.removeItem("cart")
  }

  render() {
    return (
      <div>
        <NavBar token={this.state.token} userFullName={this.state.userFullName} isAdmin={this.state.isAdmin} getCartTotalPrice={this.getCartTotalPrice} getCartItemTotal={this.getCartItemTotal} />
        <Container>
          <Switch> 
            <ProtectedRoute exact path ="/" token={this.state.token} 
                render={()=><Home addToCart={this.addToCart}/>} />
            <ProtectedRoute exact path ="/item/:id" token={this.state.token} 
                render={(props)=><SingleItem {...props}/>} />
            <ProtectedRoute exact path ="/cart" token={this.state.token} 
                render={()=><Cart 
                            cart={this.state.cart} 
                            removeFromCart={this.removeFromCart} 
                            removeAllFromCart={this.removeAllFromCart}
                            getCartItemTotal={this.getCartItemTotal}
                            getCartTotalPrice={this.getCartTotalPrice}
                            />} />
           
           {/* <Route exact path ="/manageitems" token={this.state.token} 
                render={()=><ManageItems/>} /> */}
            <Route exact path ="/createitems" token={this.state.token} 
                render={()=><CreateItems/>} />
            <Route exact path ="/edititems" token={this.state.token} 
                render={()=><EditItems/>} />
            <Route exact path ="/deleteitems" token={this.state.token} 
                render={()=><DeleteItems/>} />

 
            <Route exact path ="/login" 
                render={()=><Login setToken={this.setToken} setUserName={this.setUserName}/>} />
            
            <ProtectedRoute exact path ="/logout"
                token={this.state.token}
                render={()=><Logout doLogout={this.doLogout}/>}/>
          </Switch>
        </Container>
      </div>
    );
  }
}
