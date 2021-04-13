
import { generateFeed } from './feed.js';
import API from './api.js';
import { GetFeed, HideAllBoards, Showboard } from './main.js';


const api = new API('http://localhost:5000');
let UserToken = "";
let requestPromises = [];
let Userfollowing_id = [];
let followerPromises = [];
let UserName="";
const All_boars_list=["errorboard","commentsboard","addpostboard","editprofileboard",
                      "followingboard","initialboard","feedboard","profileboard",
                      "loginboard","signupboard"];


export function viewProfile(author, token, thumbnail, whoseProfile) {
    console.log("clicking");
    UserToken = token;
    UserName=author;
    HideAllBoards();
    Showboard("profileboard", "inline");
    let option = api.prepareOptions("/get/user", UserToken);
    api.APIRequest(`user/?username=${author}`, option)
        .then(res => api.dealWithResponse("/get/user", res))
        .then(res => {
            let poster_unfollow_button = document.getElementsByClassName("unfollow-poster")[0];
            poster_unfollow_button.id = `followbutton-${res["username"]}`;
            if (whoseProfile === "user") {
                Userfollowing_id = res["following"];
                document.getElementById("editprofilebutt").style.display = "inline"
                poster_unfollow_button.style.display = "none";
                document.getElementById("editpostbutton").style.display = "inline";
            } else {
                document.getElementById("editpostbutton").style.display = "none";
                poster_unfollow_button.style.display = "inline";
                poster_unfollow_button.addEventListener('click', () => changeFollowHandler(res["username"]))
                document.getElementById("editprofilebutt").style.display = "none"
            };
            UpdateProfile(res, thumbnail);
            UpdatePost(res)
        })
        .catch(err => {
            api.PrintERR(err);
        });
}


function UpdateProfile(profile, thumbnail) {
    let headshot_img = document.createElement("img");
    headshot_img.src = `data:image/png;base64,${thumbnail}`;
    headshot_img.id = "posterhshotimg";
    headshot_img.alt = "poster headshot";
    document.getElementById("posterheadshot").appendChild(headshot_img);
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
}


function openFollowingBoardHandler (profile){
    document.getElementById("followingboard").style.display = "block";
    fetchFollowing(profile);
};

export function backclickHandler(e) {
    let parents = ["posterheadshot", "posterusername", "posteremail", "postername", "followedby", "posterposts", "followerboard", "feedcontainer"];
    const deleparents = ["posterprofile", "posterprofile"]
    const nodes = ["followingbutton", "gobackbutton"]
    deletNodes(deleparents, nodes);
    cleanJSnodes(parents);
    GetFeed(true)
    let unfollow_butt=document.getElementsByClassName("unfollow-poster")[0];
    unfollow_butt.style.display="none";
    let banners = document.getElementsByClassName("post-banner");
    Object.keys(banners).forEach((key) => banners[key]["style"]["display"] = "none");

}

function fetchFollowing(profile) {
    followerPromises = [];
    for (let userid of profile["following"]) {
        let option = api.prepareOptions("/get/user", UserToken);
        const promise = api.APIRequest(`user/?id=${userid}`, option)
            .then(res => api.dealWithResponse("/get/user", res))
            .then(res => {
                return res
            })
            .catch(err => {
                api.PrintERR(err);
            });
        followerPromises.push(promise);
    }
    Promise.all(followerPromises).then(res => UpdateFollowing(res));
}

function UpdateFollowing(followingprofileList) {
    followingprofileList.forEach((followingprofile) => {
        let followingboard = document.getElementById("followerboard");
        if (followingprofile === "") {
            followingboard.appendChild(document.createTextNode("not yet following anyone"));
        } else {
            let name = followingprofile["name"];
            let username = followingprofile["username"];
            let follower_num = followingprofile["followed_num"];
            let block = document.createElement("div");
            block.classList.add("follower-block");
            let name_span = document.createElement("span")
            let follow_button = document.createElement("button")
            name_span.id = "namespan";
            name_span.appendChild(document.createTextNode(name));
            if (Userfollowing_id.includes(followingprofile["id"])) {
                follow_button.appendChild(document.createTextNode("unfollow"));
            } else {
                follow_button.appendChild(document.createTextNode("follow"));
            }
            follow_button.id = `followbutton-${name}`;
            follow_button.classList.add("followbutton");
            block.appendChild(name_span);
            let followed_span = document.createElement("span")
            followed_span.id = "followedspan";
            followed_span.appendChild(document.createTextNode(`       ${follower_num}followers`));
            block.appendChild(followed_span);
            block.appendChild(follow_button)
            followingboard.appendChild(block);
            follow_button.addEventListener('click', () => changeFollowHandler(username))
        }
    })
}


function  changeFollowHandler (name) {
    let follow_status = document.getElementById(`followbutton-${name}`);
    if (follow_status.innerHTML === "follow") {
        let option = api.prepareOptions("/user/follow", UserToken);
        api.APIRequest(`user/follow?username=${name}`, option)
            .then(res => api.dealWithResponse("/user/follow", res))
            .then(res => console.log(res))
            .then(() => {
                let follow_status = document.getElementById(`followbutton-${name}`);
                follow_status.removeChild(follow_status.firstChild);
                follow_status.appendChild(document.createTextNode("unfollow"));
            })
            .catch(err => {
                api.PrintERR(err);
            });

    }
    if (follow_status.innerHTML === "unfollow") {
        let option = api.prepareOptions("/user/unfollow", UserToken);
        api.APIRequest(`user/unfollow?username=${name}`, option)
            .then(res => api.dealWithResponse("/user/unfollow", res))
            .then(res => console.log(res))
            .then(() => {
                let follow_status = document.getElementById(`followbutton-${name}`);
                follow_status.removeChild(follow_status.firstChild);
                follow_status.appendChild(document.createTextNode("follow"));
            })
            .catch(err => {
                api.PrintERR(err);
            });

    }
}

export function UpdatePost(profile) {
    requestPromises = [];
    if (profile["posts"].length === 0) {
        document.getElementById("posterposts").appendChild(document.createTextNode("Athor haven't got posts yet"));
    } else {
        profile["posts"].forEach((key) => {
            let option = api.prepareOptions("/get/post", UserToken);
            const promise = api.APIRequest(`post/?id=${key}`, option)
                .then(res => api.dealWithResponse("/get/post", res))
                .then((res) => { return res })
                .catch(err => {
                    api.PrintERR(err);
                });
            requestPromises.push(promise);
        })
        Promise.all(requestPromises).then(posts => generateFeed(posts, UserToken, "posterposts", posts.length));
    }
}

export function cleanJSnodes(parents) {
    parents.forEach((key) => {
        let parent = document.getElementById(key);
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    })

}
export function cleanEventListeners(buttons, events, handlers) {
    for (let i = 0; i < buttons.length; i++) {
        let butt = document.getElementById(buttons[i]);
        butt.removeEventListener(events[i], handlers[i], false);
    }
}

function deletNodes(parents, nodes) {
    for (let i = 0; i < nodes.length; i++) {
        document.getElementById(parents[i]).removeChild(document.getElementById(nodes[i]));
    }
}







