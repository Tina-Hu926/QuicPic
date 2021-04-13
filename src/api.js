// change this when you integrate with the real API, or when u start using the dev server
const API_URL = 'http://localhost:5000'


const getJSON = (path, options) => 
    fetch(path, options)
        .then(res => res.json())
        .catch(err => console.log(err));

/**
 * This is a sample class API which you may base your code on.
 * You don't have to do this as a class.
 */
export default class API {

    /**
     * Defaults to teh API URL
     * @param {string} url 
     */
    constructor(url = API_URL) {
        this.url = url;
    } 

    APIRequest(path,options) {
        return getJSON(`${this.url}/${path}`,options);
    }
    prepareOptions(type,value){
        switch (type){
            case "auth/login":
                const  logdata={
                    "username": value[0],
                    "password": value[1]
                  }
                const login_option ={
                method:'POST',
                body:JSON.stringify(logdata),
                headers:{
                    "Content-Type":"application/json"
                }
            }
                return login_option;
            case "auth/signup":
                const signdata={
                    "username": value[0],
                    "password": value[1],
                    "email": value[2],
                    "name": value[3]
                }
                const signup_option ={
                    method:'POST',
                    body:JSON.stringify(signdata),
                    headers:{
                        "Content-Type":"application/json"
                    }
                }
                return signup_option;
            case "/user/feed":
                const userfeed_option ={
                    method:'GET',
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization": value
                    }
                }
                return userfeed_option;
            case "/get/user":
                const getUserdata={
                    method:'GET',
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization": value
                    }
                }
                return getUserdata;
            case "/get/post":
                const getPost={
                    method:'GET',
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization": value
                    }
                }
                return getPost;
            case "/post/like":
                const postLike={
                    method:'PUT',
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization": value
                    }
                }
                return postLike;
                
            case "/post/unlike":
                const postunLike={
                    method:'PUT',
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization": value
                    }
                }
                return postunLike;
            case "/post/comment":
                const comment={
                    "comment": value[1]
                }
                const postcomment={
                    method:'PUT',
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization": value[0]
                    },
                    body:JSON.stringify(comment),
                }
                return postcomment;
            case "/put/user":
                const profile={
                    "email": value[1][2],
                    "name": value[1][0],
                    "password":value[1][1]
                }
                const putprofile={
                    method:'PUT',
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization": value[0]
                    },
                    body:JSON.stringify(profile),
                }
                return putprofile;
            case "/post/post":
                const postdata={
                    "description_text": value[1],
                    "src": value[2]
                }
                const post_option ={
                    method:'POST',
                    body:JSON.stringify(postdata),
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization": value[0]
                    }
                }
                return post_option;
            case "/delete/post":
                const deletepost={
                    method:'DELETE',
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization": value
                    }
                }
                return deletepost;
            case "/put/post":
                if(value.length===3){
                    const editpostdata={
                        "description_text": value[1],
                        "src": value[2]
                    }
                    const editpost_option ={
                        method:'PUT',
                        body:JSON.stringify(editpostdata),
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization": value[0]
                        }
                    }
                    return editpost_option;
                }
                if (value.length===2){
                    const editpostdata={
                        "description_text": value[1]
                    }
                    const editpost_option ={
                        method:'PUT',
                        body:JSON.stringify(editpostdata),
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization": value[0]
                        }
                    }
                    return editpost_option;
                }
            case "/user/follow":
                const follow={
                    method:'PUT',
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization": value
                    }
                }
                return follow;
                case "/user/unfollow":
                    const unfollow={
                        method:'PUT',
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization": value
                        }
                    }
                    return unfollow;

    
        }

        
    }     


    dealWithResponse (type,data){
        switch(type){
            case "login":
                if (Object.keys(data)[0]==="message"){
                    if (data["message"]==="Invalid Username/Password"){
                        this.PrintERR("Sorry, Username or Password incorrect. Please try again. ");
                        return "Invalid Username/Password";
                    }
                }
                if (Object.keys(data)[0]==="token"){
                    return data;
                }
            case "signup":
                if (Object.keys(data)[0]==="message"){
                    if(data["message"]==="Username Taken"){
                        this.PrintERR("Sorry, Username has already been taken. Please try another one. ");
                       return data["message"];
                    }
                    if(data["message"]==="Missing Username/Password"){
                        this.PrintERR("Sorry, missing username or password here. ");
                        return data["message"];
                    }
                }
                if (Object.keys(data)[0]==="token"){
                    let UserToken=data["token"];
                    return data;
                }
            case "getfeed":
                if (Object.keys(data)[0]==="message"){
                    if(data["message"]==="Invalid Authorization Token"){
                        this.PrintERR("Sorry, Your Loin information expired, please login again ");
                        break;
                    }

                }
                if (Object.keys(data)[0]==="posts"){
                    let postarry=data["posts"];
                    return postarry;
                }
            case "/get/user":
                if (Object.keys(data)[0]==="message"){
                    if(data["message"]==="Invalid Authorization Token"){
                        this.PrintERR("Sorry, Your Loin information expired, please login again ");
                        break;
                    }
                }
                if (Object.keys(data)[0]==="username"){
                    return data;
                }
            case "/get/post":
                if (Object.keys(data)[0]==="message"){
                    if(data["message"]==="Invalid Authorization Token"){
                        this.PrintERR("Sorry, Your Loin information expired, please login again ");
                        break;
                    }
                }
                if (Object.keys(data)[0]==="id"){
                    return data;
                }
            case "/post/like":
                if (Object.keys(data)[0]==="message"){
                    if(data["message"]==="success"){
                        return "success";
                    }
                }else{
                    this.PrintERR("Oops! Something is wrong, please try again later!");
                    break;
                }
            case "/post/unlike":
                if (Object.keys(data)[0]==="message"){
                    if(data["message"]==="success"){
                        return "success";
                    }
                }else{
                    this.PrintERR("Oops! Something is wrong, please try again later!");
                    break;
                }
            case "/post/comment":
                if (Object.keys(data)[0]==="message"){
                    if(data["message"]==="success"){
                        return "success";
                    }
                    if (data["message"]==="Invalid Auth Token"){
                        this.PrintERR("Sorry, Your Loin information expired, please login again ");
                    }
                    if(data["message"]==="Post Not Found"){
                        this.PrintERR("Sorry, Post Not Found");
                    }	
                    if(data["message"]==="Malformed Request"){
                        this.PrintERR("Please check format");
                    }	   
                }else{
                    this.PrintERR("Oops! Something is wrong, please try again later!");
                    break;
                }
            case "/put/user":
                    if(data["msg"]==="success"){
                        return "success";
                    }
                    if (data["message"]==="Invalid Authorization Token"){
                        this.PrintERR("Sorry, Your Loin information expired, please login again ");
                    }
                    if(data["message"]==="Password cannot be empty"){
                        this.PrintERR("Password cannot be empty");
                    }
                    break;
                case "/post/post":
                    return data;
                case "/delete/post":
                    if (Object.keys(data)[0]==="message"){
                        if(data["message"]==="success"){
                            return "success";
                        }
                    }else{
                        this.PrintERR("Oops! Something is wrong, please try again later!");
                        break;
                    }
                case "/put/post":
                    return data;
                case "/user/follow":
                    if (data["message"]==="Sorry, you can't follow yourself."){
                        this.PrintERR("Sorry, you can't follow yourself.");
                    }
                    return data;
                case "/user/unfollow":
                    return data;




        }
    }








        // Milestone 1.3. Error Popup
        PrintERR(msg){
            let Err=document.getElementById("errorboard");
            Err.style.display="flex";
            let message=document.getElementById("err_message");
            let tag=document.createElement("p");
            tag.setAttribute("role","alert");
            tag.appendChild(document.createTextNode(msg));
            message.appendChild(tag);
            let close=document.getElementById("closebutt");
            close.addEventListener('click',(event)=>{
                Err.style.display="none";
                message.innerText='';
            })
        }   

    }
