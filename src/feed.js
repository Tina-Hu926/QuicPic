import API from './api.js';
import { viewProfile} from './Profile.js'; 
import {HideAllBoards,Showboard} from './main.js';

const api = new API('http://localhost:5000');
let requestPromises=[];
let readyphoto="";
const All_boars_list=["errorboard","commentsboard","addpostboard","editprofileboard",
                      "followingboard","initialboard","feedboard","profileboard",
                      "loginboard","signupboard"];

export function generateFeed(posts,token,container,length){
    for (let i=0; i<length; i++){
        let postid=posts[i]["id"];
        let meta=posts[i]["meta"];
        let author=meta["author"];
        let description_text=meta["description_text"];
        let published=meta["published"];
        let likes=meta["likes"];
        let thumbnail=posts[i]["thumbnail"];
        let src=posts[i]["src"];
        let comments=posts[i]["comments"]
        generateFeedBox(postid,container);
        fillFeedBox(token,postid,author,description_text,published,likes,thumbnail,src,comments,container)
        addEventToFeedBox(postid,author,token,thumbnail,container);

    }
}

function generateFeedBox(postid,container){
    appendChildElement(container,"div","post-banner",`postbanner${postid}${container}`);
    appendChildElement(`postbanner${postid}${container}`,"div","editpostdot",`editpostdot${postid}${container}`);
    appendChildElement(`postbanner${postid}${container}`,"button","close-button",`deletpost${postid}${container}`);
    appendChildElement(container,"div","feed-box",`feedbox${postid}${container}`);
    appendChildElement(`feedbox${postid}${container}`,"div","title-box",`titlebox${postid}${container}`);
    appendChildElement(`titlebox${postid}${container}`,"div","head-shot",`headshot${postid}${container}`);
    appendChildElement(`titlebox${postid}${container}`,"p","poster-name",`poname${postid}${container}`);
    appendChildElement(`feedbox${postid}${container}`,"div","description",`description${postid}${container}`);
    appendChildElement(`feedbox${postid}${container}`,"div","photo-box",`photobox${postid}${container}`);
    appendChildElement(`feedbox${postid}${container}`,"div","detail-box",`detailbox${postid}${container}`);
    appendChildElement(`description${postid}${container}`,"p","post-sub",`postsub${postid}${container}`);
    appendChildElement(`description${postid}${container}`,"p","post-time",`posttime${postid}${container}`);
    appendChildElement(`detailbox${postid}${container}`,"div","like-box",`likebox${postid}${container}`);
    appendChildElement(`likebox${postid}${container}`,"div","click-like",`clicklike${postid}${container}`);
    appendChildElement(`likebox${postid}${container}`,"div","show-like",`showlike${postid}${container}`);
    appendChildElement(`detailbox${postid}${container}`,"div","comment-box",`commentbox${postid}${container}`);
    appendChildElement(`commentbox${postid}${container}`,"div","show-comment",`showcomment${postid}${container}`);
    appendChildElement(`commentbox${postid}${container}`,"div","show-all-comments",`clickshowall${postid}${container}`);
    appendChildElement(`commentbox${postid}${container}`,"input","add-comment",`addcomment${postid}${container}`);
    appendChildElement(`commentbox${postid}${container}`,"button","submit-comment",`submitcomment${postid}${container}`);

}

function appendChildElement(fatherID,childType,childNodeClass,childNodeId){
    let fatherNode=document.getElementById(fatherID);
    let childNode=document.createElement(childType);
    childNode.classList.add(childNodeClass);
    childNode.id=childNodeId;
    fatherNode.appendChild(childNode);
}

function fillFeedBox(token,postid,author,description_text,published,likes,thumbnail,src,comments,container){
    let headshot=document.getElementById(`headshot${postid}${container}`);
    let headshot_img=document.createElement("img");
    let poster_name=document.getElementById(`poname${postid}${container}`);
    let post_box=document.getElementById(`photobox${postid}${container}`);
    let post_photo=document.createElement("img");
    let show_likes=document.getElementById(`showlike${postid}${container}`);
    let click_like=document.getElementById(`clicklike${postid}${container}`);
    let show_comment=document.getElementById(`showcomment${postid}${container}`);
    let add_comment=document.getElementById(`addcomment${postid}${container}`);
    let posttime=document.getElementById(`posttime${postid}${container}`);
    let sub=document.getElementById(`postsub${postid}${container}`);
    appendChildElement(`clicklike${postid}${container}`,"img","like-svgimg",`likesvgimg${postid}${container}`);
    let heart=document.getElementById(`likesvgimg${postid}${container}`);
    heart.src="src/heart.svg";
    heart.alt="click to like";
    click_like.addEventListener('click',()=>likeclickHandler(postid,token,container));
    headshot_img.id=`headshotimg${postid}${container}`;
    headshot_img.src=`data:image/png;base64,${thumbnail}`;
    headshot_img.alt="poster headshot";
    headshot_img.classList.add("headshot-img");
    headshot.appendChild(headshot_img);
    poster_name.appendChild(document.createTextNode(author));
    post_photo.src=`data:image/png;base64,${src}`;
    post_photo.alt="post photo";
    post_box.appendChild(post_photo);
    let ptime=getTime(published);
    posttime.appendChild(document.createTextNode(`${ptime[0]}.${ptime[1]}.${ptime[2]}  ${ptime[3]}:${ptime[4]}`))
    sub.appendChild(document.createTextNode(description_text));
    countLikes(likes,token,postid,container);
    if (comments.length){
        let ptime=getTime(comments[0]["published"])
        appendChildElement(`showcomment${postid}${container}`,"div","comment-block",`commentblock${postid}${container}-0`);
        appendChildElement(`commentblock${postid}${container}-0`,"span","comment-name",`commentname${postid}${container}-0`);
        appendChildElement(`commentblock${postid}${container}-0`,"span","comment-text",`commenttext${postid}${container}-0`);
        appendChildElement(`commentblock${postid}${container}-0`,"span","post-time",`commenttime${postid}${container}-0`);
        document.getElementById(`commentname${postid}${container}-0`).appendChild(document.createTextNode(comments[0]["author"]));
        document.getElementById(`commenttext${postid}${container}-0`).appendChild(document.createTextNode(comments[0]["comment"]));
        document.getElementById(`commenttime${postid}${container}-0`).appendChild(document.createTextNode(`${ptime[0]}.${ptime[1]}.${ptime[2]}  ${ptime[3]}:${ptime[4]}`));
        if (comments.length>1){
            document.getElementById(`clickshowall${postid}${container}`).appendChild(document.createTextNode(`View all ${comments.length} comments`));
            document.getElementById(`clickshowall${postid}${container}`).addEventListener('click',()=>viewCommentHandler(comments,postid,container));
        }
    }else {
        document.getElementById(`clickshowall${postid}${container}`).appendChild(document.createTextNode(`No comment`));
        
    }

    let addC=document.getElementById(`addcomment${postid}${container}`);
    addC.placeholder="add comment here";
    let submit_comment=document.getElementById(`submitcomment${postid}${container}`);
    submit_comment.appendChild(document.createTextNode("Submit"));
    submit_comment.addEventListener('click',()=>addComment(token,addC.value,postid,container));
    let edit=document.getElementById(`editpostdot${postid}${container}`);
    edit.innerText="...";
    let deletpost=document.getElementById(`deletpost${postid}${container}`);

    deletpost.addEventListener('click',()=>deletpostHandler(postid,token,container));
    let boxes=document.getElementsByClassName("feed-box");
    for(let i=0;i<boxes.length; i++){
        boxes[i].style.minHeight="300px";
    }
}

const deletpostHandler=(postid,token,container)=>{
    let request=token;
    let option=api.prepareOptions("/delete/post",request);
    api.APIRequest(`post/?id=${postid}`,option)
        .then(res=>{
            if(api.dealWithResponse("/delete/post",res)==="success"){
                console.log (document.getElementById(`feedbox${postid}${container}`));
                document.getElementById(`feedbox${postid}${container}`).style.display="none";
                document.getElementById(`postbanner${postid}${container}`).style.display="none";
                `postbanner${postid}${container}`
            }})
        .catch(err=>console.log(err));
}
function  addEventToFeedBox(postid,author,token,thumbnail,container){
    let poster_headshot=document.getElementById(`headshot${postid}${container}`);
    let poster_name=document.getElementById(`poname${postid}${container}`);

    poster_headshot.addEventListener('click',(event)=>{
        document.getElementById("profileboard").style.display="inline";
        viewProfile(author,token,thumbnail,"poster");
    })
    poster_name.addEventListener('click',(event)=>{
        document.getElementById("profileboard").style.display="inline";
        viewProfile(author,token,thumbnail,"poster");
    })
}

function getTime(published){
    let now=new Date(published*1000);
    let year = now.getFullYear();
    let month = now.getMonth();
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    month=months[month];
    let date = now.getDate();
    let hour = now.getHours();
    let min = now.getMinutes();
    let time=[month,date,year,hour,min];
    return time
}

const likeclickHandler=(postid,token,container)=>{
    let src=document.getElementById(`likesvgimg${postid}${container}`).getAttribute("src");
    if (src==="src/heart.svg"){
        let request=token;
        let option=api.prepareOptions("/post/like",request);
        api.APIRequest(`post/like?id=${postid}`,option)
            .then(res=>api.dealWithResponse("/post/like",res))
            .then(res=>Like(res,postid,container))
            .catch(err=>console.log(err));
    }
    if (src==="src/likeheart.svg"){
        let request=token;
        let option=api.prepareOptions("/post/unlike",request);
        api.APIRequest(`post/unlike?id=${postid}`,option)
            .then(res=>api.dealWithResponse("/post/unlike",res))
            .then(res=>unLike(res,postid,container))
            .catch(err=>console.log(err));
    }

}
function Like(response,postid,container){
    if (response==="success"){
        let heart=document.getElementById(`likesvgimg${postid}${container}`);
        heart.src="src/likeheart.svg";
    }else{
        api.PrintERR("Response not success");
    }
}
function unLike(response,postid,container){
    if (response==="success"){
        let heart=document.getElementById(`likesvgimg${postid}${container}`);
        heart.src="src/heart.svg";
    }else{
        api.PrintERR("Response not success");
    }
}

function Updateshowlike(likernames,postid,container){
    let show_likes=document.getElementById(`showlike${postid}${container}`);
    if (likernames.length>1){
        show_likes.appendChild(document.createTextNode(`Liked by ${likernames[0]} and ${likernames.length} others`));
        show_likes.addEventListener('click',()=>showAllLikes(likernames,postid,container));
        show_likes.style.cursor="pointer";
    }else if (likernames.length===1){
        show_likes.appendChild(document.createTextNode(`Liked by ${likernames[0]}`));
    }else{
        show_likes.appendChild(document.createTextNode(`0 Likes`));
        
    }
    
}
function showAllLikes(likernames,postid,container){
    let show_likes=document.getElementById(`showlike${postid}${container}`);
    let text="Liked by ";
    for (let i =0; i<likernames.length; i++){
        if (i!== likernames.length-1){
            text=text+`${likernames[i]}, `;
        }else{
            text=text+`and ${likernames[i]}. `;
        }
    }
    show_likes.innerText=text;
}
function countLikes(likes,token,postid,container){
    let request=token;
    requestPromises = [];
    likes.forEach((key)=>{
        let option=api.prepareOptions("/get/user",request);
        const promise=api.APIRequest(`user/?id=${key}`,option)
            .then(res=>api.dealWithResponse("/get/user",res))
            .then(res=>{return res.name })
            .catch(err=>console.log(err));
        requestPromises.push(promise);
    })
    Promise.all(requestPromises).then(likernames=> Updateshowlike(likernames,postid,container));

}
function viewCommentHandler(comments,postid,container){
    let comment_board=document.getElementById("commentsboard");
        for (let j=0; j<comments.length; j++){
            appendChildElement("comments_text","div","comment-block",`commentblock${postid}${container}-${j}`);
            appendChildElement(`commentblock${postid}${container}-${j}`,"span","comment-name",`commentname${postid}${container}-${j}`);
            appendChildElement(`commentblock${postid}${container}-${j}`,"span","comment-text",`commenttext${postid}${container}-${j}`);
            appendChildElement(`commentblock${postid}${container}-${j}`,"span","post-time",`commenttime${postid}${container}-${j}`);
            document.getElementById(`commentname${postid}${container}-${j}`).appendChild(document.createTextNode(comments[j]["author"]));
            document.getElementById(`commenttext${postid}${container}-${j}`).appendChild(document.createTextNode(comments[j]["comment"]));
            let ptime=getTime(comments[j]["published"])
            document.getElementById(`commenttime${postid}${container}-${j}`).appendChild(document.createTextNode(`${ptime[0]}.${ptime[1]}.${ptime[2]}  ${ptime[3]}:${ptime[4]}`));
        }
        comment_board.style.display="flex";
        let close=document.getElementById("commentclosebutt");
        close.addEventListener('click',()=>{
            comment_board.style.display="none";
            let parent=document.getElementById("comments_text");
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        })
}

function  addComment(token,comment,postid,container){
    let commentbox=document.getElementById(`commentbox${postid}${container}`);
    let comments=document.getElementById(`addcomment${postid}${container}`)
    if (comment===""){
        commentbox.appendChild(document.createTextNode("Can not submit empty comment!"));
        setTimeout(()=>commentbox.removeChild(commentbox.lastChild),2000);
    }else{
        let request=[token,comment];
        let option=api.prepareOptions("/post/comment",request);
        api.APIRequest(`post/comment?id=${postid}`,option)
            .then(res=>api.dealWithResponse("/post/comment",res))
            .then(commentbox.appendChild(document.createTextNode("comment added!")))
            .then(comments.value="")
            .then(setTimeout(()=>commentbox.removeChild(commentbox.lastChild),1000))
            .catch(err=>console.log(err));
    }
        

}
