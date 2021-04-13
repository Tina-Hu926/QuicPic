import API from './api.js';
import { generateFeed} from './feed.js';
import { viewProfile,cleanJSnodes, backclickHandler} from './Profile.js'; 


const api = new API('http://localhost:5000');
let LogForm=document.forms.Login_form;  // get form elements 
let SignupForm=document.forms.Signup_form; 
let EditprofileForm=document.forms.Edit_form;
let UserToken="";
let current_post_number=0;
let readyphoto="";
let editpostdots_key="";
let Editing_post=false;

const All_boars_list=["errorboard","commentsboard","addpostboard","editprofileboard",
                      "followingboard","initialboard","feedboard","profileboard",
                      "loginboard","signupboard"];




//------------------------------  Milestone 1 - Registration & Login -------------------------------
// Part 1.1 Login:

LogForm.addEventListener('submit',LoginHandler); 
document.getElementById("bannernewpost").style.display="none";

// EventListener :  submit login to get token
function LoginHandler(event){
    event.preventDefault(); 
    let name=LogForm.elements.login_name.value;
    let pass=LogForm.elements.login_pass.value;
    HideAllBoards();
    Showboard("initialboard","flex");
    Showboard("loginboard","flex");
    if (name && pass){
        const request=[name,pass]
        const option=api.prepareOptions("auth/login",request);
        api.APIRequest('auth/login',option)
            .then(res=>{
                if(api.dealWithResponse("login",res)!=="Invalid Username/Password"){
                    RenderFeedHandler(res)
                };})
            // .then(res=>RenderFeedHandler(res))
            .catch(err=>console.log(err));
    }
    if (!name && pass){
        api.PrintERR("Please input your uername");
    }
    if (name && !pass){
        api.PrintERR("Please input your password");
    }
    if (!name && !pass){
        api.PrintERR("Please input your uername and password");
    }
}


// Part 1.2  Registration:

//adding signup events
document.getElementById("click_to_Signup").addEventListener('click',GotoSignupHandler);
SignupForm.addEventListener('submit',SignupHandler);
document.getElementById("back_to_login").addEventListener('click',BackToLoginHandler);

// EventListener :  click to Signup
function GotoSignupHandler(){
    document.getElementById("loginboard").style.display="none";
    document.getElementById("signupboard").style.display="flex";
}

// EventListener :  submit to Signup
function SignupHandler(event){
    event.preventDefault(); 
    HideAllBoards();
    Showboard("initialboard","flex");
    Showboard("signupboard","flex");
    const username = SignupForm.elements.signup_username.value;
    const pass1 = SignupForm.elements.signup_pass1.value;
    const pass2 =SignupForm.elements.signup_pass2.value;
    const email = SignupForm.elements.signup_email.value;
    const name = SignupForm.elements.signup_name.value;
    if (username && pass1 && pass2){
        if (pass1===pass2){
            const request=[username,pass1,email,name]
            const option=api.prepareOptions("auth/signup",request);
            api.APIRequest('auth/signup',option)
                .then(res=>api.dealWithResponse("signup",res))
                .then(res=>{
                    if (Object.keys(res)[0]==="token"){
                        document.getElementById("nofeed").style.display="inline";
                        HideAllBoards();
                        document.getElementById("personalusername").appendChild(document.createTextNode(`username: ${username}`));
                        document.getElementById("personalemail").appendChild(document.createTextNode(`email: ${email}`));
                        document.getElementById("personalname").appendChild(document.createTextNode(`name: ${name}`));
                        document.getElementById("feedboard").style.display="flex";
                    }
                })
                .catch(err=>console.log(err));
        }else{
            api.PrintERR("Please make sure your passwords match");
        }
    }else{
        api.PrintERR("Username and password are required, please fill in.");
    }
}

// EventListener :  back to login
function BackToLoginHandler(){
    document.getElementById("loginboard").style.display="flex";
    document.getElementById("signupboard").style.display="none";
}


// Part 1.2  Error Popup:
// implemented in api.js---->Function  api.PrintERR()


//------------------------------  Milestone 2 - Basic Feed -------------------------------
//------------------------------  Milestone 3 - Avanced Feed -------------------------------
// some implemented in feed.js----->Function generateFeed()

//EventListener: go to feed board and show feed
function RenderFeedHandler(response){
    UserToken=`Token ${response["token"]}`;
    HideAllBoards();
    document.getElementById("feedboard").style.display="flex";
    GetFeed(true);
    GetFeedProfile();
}

//Function: fetch posts data
export function GetFeed(set_start){
    document.getElementById("bannernewpost").style.display="inline";
    HideAllBoards();
    Showboard("feedboard","flex");
    const option=api.prepareOptions("/user/feed",UserToken);
    if (set_start){
        current_post_number=0;
    }
    const p=current_post_number; //  p=0 initially
    const n=5;
    api.APIRequest(`user/feed?p=${p}&n=${4}`,option)
                .then(posts=>{
                    api.dealWithResponse("getfeed",posts);
                    return posts["posts"] })
                .then((posts)=>{
                    if (posts.length===0 && current_post_number===0){
                        document.getElementById("nofeed").style.display="inline";
                        document.getElementById("postempty").style.display="inline";
                    }else{
                        document.getElementById("nofeed").style.display="none";
                        document.getElementById("postempty").style.display="none";
                    let length=5;
                    posts.length<length ?  length=posts.length : length=5 ;
                    generateFeed(posts,UserToken,"feedcontainer",length);
                    pageload=false;}
                })
                .catch(err=>console.log(err));
}

//Function: fetch personal profile data
function GetFeedProfile(){
    const option=api.prepareOptions("/get/user",UserToken);
    api.APIRequest(`user/`,option)
        .then(res=>api.dealWithResponse("/get/user",res))
        .then(profile=>UpdateFeedProfile(profile))
        .catch(err=>console.log(err));
}

//Function: update personal profile (including personal bar on the left hand side and headshot in header part)
function UpdateFeedProfile(profile){
    console.log(profile);
    console.log(UserToken);
    let userheadshot=document.getElementById("personalheadshot");
    let bannerheadshot=document.getElementById("bannerheadshot");
    let bannerusername=document.getElementById("bannerusername");
    let username=document.getElementById("personalusername");
    let email=document.getElementById("personalemail");
    let name=document.getElementById("personalname");
    let headshotphoto=document.createElement("img");
    let bannerphoto=document.createElement("img");
    console.log(profile.username);
    console.log(profile.email);
    console.log(profile.name);
    username.appendChild(document.createTextNode(profile.username));
    bannerusername.appendChild(document.createTextNode(profile.username));
    email.appendChild(document.createTextNode(profile.email));
    name.appendChild(document.createTextNode(profile.name));
    const option=api.prepareOptions("/get/post",UserToken);
    console.log(profile.posts.length);
    if (profile.posts.length==0){ ////when user do not have posts just update profile
        [username,bannerusername].map(element=>element.addEventListener('click',()=>{
            HideAllBoards();
            Showboard("profileboard", "inline");
            document.getElementById("posterusername").appendChild(document.createTextNode(profile["username"]));
            document.getElementById("postername").appendChild(document.createTextNode(profile["name"]));
            document.getElementById("posteremail").appendChild(document.createTextNode(profile["email"]));
            let following_butt = document.createElement("button");
            following_butt.classList.add("following-button");
            following_butt.id = "followingbutton";
            document.getElementById("posterprofile").appendChild(following_butt);
            let backbutt = document.createElement("button");
            backbutt.classList.add("goback-button");
            backbutt.id = "gobackbutton";
            backbutt.appendChild(document.createTextNode("Back"));
            document.getElementById("posterprofile").appendChild(backbutt);
            let followed_by = document.getElementById("followedby");
            followed_by.appendChild(document.createTextNode(`${profile["followed_num"]}  followers`));
            following_butt.appendChild(document.createTextNode(`${profile["following"].length}  following`));
            following_butt.addEventListener('click', () => openFollowingBoardHandler(profile))
            backbutt.addEventListener('click', backclickHandler);
            document.getElementById("editprofilebutt").style.display = "inline"
        }));
    }else{
        
        document.getElementById("postempty").style.display="none";
        api.APIRequest(`post/?id=${profile.posts[0]}`,option) 
            .then(res=>api.dealWithResponse("/get/post",res))
            .then(res=>{
                headshotphoto.src=`data:image/png;base64,${res.thumbnail}`;
                headshotphoto.alt="user headshot";
                headshotphoto.id="userheadshot";
                bannerphoto.src=`data:image/png;base64,${res.thumbnail}`;
                bannerphoto.alt="banner headshot";
                bannerphoto.id="bannerheadshot";
                userheadshot.appendChild(headshotphoto);
                bannerheadshot.appendChild(bannerphoto);
                [userheadshot,bannerheadshot,username,bannerusername].map(element=>element.addEventListener('click',()=>{
                    viewProfile(profile["username"],UserToken,res.thumbnail,"user");
                }));
            })
            .catch(err=>console.log(err));
    }
}






//------------------------------  Milestone 4 - Other users & profiles -------------------------------
// some implemented in feed.js----->Function generateFeed()

EditprofileForm.addEventListener('submit',(event)=>{
    event.preventDefault(); 
    let name=EditprofileForm.elements.new_name.value;
    let pass=EditprofileForm.elements.new_pass.value;
    let email = EditprofileForm.elements.new_email.value;
    if (pass.length>0){
        let body=[name,pass,email];
        let request=[UserToken,body];
        let option=api.prepareOptions("/put/user",request);
        api.APIRequest("user/",option)
                    .then(res=>api.dealWithResponse("/put/user",res))
                    .then(res=>giveInfo(res))
                    // .then(setTimeout(board.removeChild(board.lastChild),2000))
                    // .catch(err=>api.PrintERR(err));
                    .catch(err=>console.log(err))

    }else{
        api.PrintERR("password must be at least 1 character.");
    }
})
function giveInfo(res){
    if (res==="success"){
        let board=document.getElementById("edit_text");
        board.appendChild(document.createTextNode("Edit success!"));
        setTimeout(()=>board.removeChild(board.lastChild),1500);
    }
}


// Edit a post 
function  EditpostbuttonHandler(){
    let banners=document.getElementsByClassName("post-banner");
    if (banners[0].style.display==="flex"){
        Object.keys(banners).forEach((key)=>banners[key]["style"]["display"]="none");
    }else{

        Object.keys(banners).forEach((key)=>banners[key]["style"]["display"]="flex");
    }
    let editpostdots=document.getElementsByClassName("editpostdot");
    Object.keys( editpostdots).forEach((key)=>{
        editpostdots[key].addEventListener('click',()=>{
        let board=document.getElementById("addpostboard");
        board.style.display="flex";
        editpostdots_key=editpostdots[key].id.substring(11,editpostdots[key].id.length-11);
        Editing_post=true;
        })
    })
}

const editprofileHandler=()=>{
    let editboard=document.getElementById("editprofileboard");
    editboard.style.display="flex";

}





//------------------------------  Milestone 5 - Adding & updateing content -------------------------------
//Part5.1 adding a new post

//adding events
document.getElementById("newpost").addEventListener('click',AddingPostHandler);
document.getElementById("bannernewpost").addEventListener('click',AddingPostHandler);
document.getElementById("choosephoto").addEventListener('change',UploadphotoHandler);
document.getElementById("postbutton").addEventListener('click',submitPostHandler);
document.getElementById("addpostclosebutt").addEventListener('click',CloseaddpostHandler);

//EventListener: showing add new post board
function AddingPostHandler(){
    let board=document.getElementById("addpostboard");
    board.style.display="flex";
}

//EventListener: check photo type and convert to 64
function  UploadphotoHandler(){
    if(this.files[0]===undefined){
        let box=document.getElementById("upload-photo");
        let img= document.getElementById("uploadphoto");
        box.style.display="none";
        img.removeAttribute("src")
    }else{
        let file=this.files[0];
        readFile(file)
        .then(res=>readyphoto=res)
        .then(()=>{
            let box=document.getElementById("upload-photo");
            let img= document.getElementById("uploadphoto");
            box.style.display="block";
            img.src=readyphoto;
        })
        .then(()=>{
            let phototype= readyphoto.substring(11,14);
            if (phototype!=="png"){
                api.PrintERR("Please ensure your photo type is .png");
                let img= document.getElementById("uploadphoto");
                img.removeAttribute("src");
            }
        })
        .catch(err=>console.log(err))
    }
}

//Function: reading the pic file
function  readFile(files){
    const FR = new FileReader();
    return new Promise((resolve, reject) => {
        FR.addEventListener('load',e => {
            const result = e.target.result;
            resolve(result);
        })
      FR.readAsDataURL(files);
    });
  };

//EventListener: submiting the new post 
function  submitPostHandler(){
    let file=document.getElementById("choosephoto");
    let text=document.getElementById("posttext").value;
    if (Editing_post){
        if (text===""){
            api.PrintERR("Please add a description for your photo :)");
        }else{
            if (readyphoto!==""){
            readyphoto=readyphoto.substring(22,readyphoto.length);
            let request=[UserToken,text,readyphoto,];
            console.log("editpostdots_key",editpostdots_key);
            if (editpostdots_key){
                editpostdots_key
                let option=api.prepareOptions("/put/post",request);
                api.APIRequest(`post/?id=${editpostdots_key}`,option)
                    .then(res=>api.dealWithResponse("/put/post",res))
                    .then(res=>console.log(res))
                    .then(()=>{
                        readyphoto="";
                        file.value="";
                        document.getElementById("posttext").value="";
                        let img= document.getElementById("uploadphoto");
                        let box=document.getElementById("upload-photo");
                        box.style.display="none";
                        Editing_post=false;
                        editpostdots_key="";
                        img.removeAttribute("src")})
                    .then(()=>{
                        let infobox=document.getElementById("postinfo");
                        infobox.style.display="block";
                        infobox.appendChild(document.createTextNode("Edit success!"))
                        setTimeout(()=> {
                            infobox.removeChild(infobox.lastChild);
                            infobox.style.display="none";},1500)
                    })
                    .catch(err=>console.log(err));}

        }else{
            let request=[UserToken,text];
            // console.log("editpostdots_key",editpostdots_key);
            if (editpostdots_key){
                let option=api.prepareOptions("/put/post",request);
                api.APIRequest(`post/?id=${editpostdots_key}`,option)
                    .then(res=>api.dealWithResponse("/put/post",res))
                    .then(res=>console.log(res))
                    .then(()=>{
                        let infobox=document.getElementById("postinfo");
                        infobox.style.display="block";
                        infobox.appendChild(document.createTextNode("Edit success!"))
                        setTimeout(()=> {
                        infobox.removeChild(infobox.lastChild);
                        infobox.style.display="none";},1500)})
                    .catch(err=>console.log(err))
                }
            }
        }
    }else{
        if (!text || !readyphoto){
            api.PrintERR("Please choose a photo :P");

        }else{
            readyphoto=readyphoto.substring(22,readyphoto.length);
            let request=[UserToken,text,readyphoto];
            let option=api.prepareOptions("/post/post",request);
            api.APIRequest("post/",option)
            .then(res=>api.dealWithResponse("/post/post",res))
            .then(res=>console.log(res))
            .then(()=>{
                readyphoto="";
                file.value="";
                document.getElementById("posttext").value="";
                let img= document.getElementById("uploadphoto");
                let box=document.getElementById("upload-photo");
                box.style.display="none";
                img.removeAttribute("src")})
            .then(()=>{
                let infobox=document.getElementById("postinfo");
                infobox.style.display="block";
                infobox.appendChild(document.createTextNode("Post success!"))
                setTimeout(()=> {
                    infobox.removeChild(infobox.lastChild);
                    infobox.style.display="none";},1500)
            })
            .catch(err=>{
                api.PrintERR(err);
            });
        }
    
    }
}

//EventListener: closing the add post board 
function CloseaddpostHandler(){
    let file=document.getElementById("choosephoto");
    let board=document.getElementById("addpostboard");
    let img= document.getElementById("uploadphoto");
    document.getElementById("posttext").value="";
    board.style.display="none";
    readyphoto="";
    file.value="";
    img.removeAttribute("src")
    Editing_post=false;
}

//infinite roll
let pageload=false;
window.addEventListener('scroll',moreFeed);
function moreFeed(){
    let container=document.getElementById("feedcontainer");
    let distance=container.getBoundingClientRect().bottom - window.innerHeight;
    let feeddisplay=document.getElementById("feedboard").style.display;
    if (!pageload && (feeddisplay==="flex") && (distance < 200) ){
        pageload=true;
        current_post_number=current_post_number+5;
    GetFeed(false);
    }
}

export function HideAllBoards(){
    All_boars_list.map((id)=>document.getElementById(id).style.display="none")
}
export function Showboard(id,style){
    document.getElementById(id).style.display=style;
}




document.getElementById("editprofilebutt").addEventListener('click',editprofileHandler);
let editclose=document.getElementById("editclosebutt");
editclose.addEventListener('click',(event)=>{
    EditprofileForm.elements.new_name.value="";
    EditprofileForm.elements.new_pass.value="";
    EditprofileForm.elements.new_email.value="";
    document.getElementById("editprofileboard").style.display="none";
    
})
let editpost=document.getElementById("editpostbutton");
editpost.style.display="block";
editpost.addEventListener('click',EditpostbuttonHandler);

let followingList_closebutton=document.getElementById("followclosebutt");
followingList_closebutton.addEventListener('click',()=>{
    let parents=["followerboard"];
    cleanJSnodes(parents);
    document.getElementById("followingboard").style.display="none";



})