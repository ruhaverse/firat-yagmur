import React, { useState, useEffect, useContext,useRef } from 'react';
import { useHistory } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import AuthService from '../../services/auth.services';
// SimpleReactLightbox not used
import { testScript } from '../../js/script';

// EditPostComponent not used here

import Layout from '../LayoutComponent';
import GuideComponent from '../user/GuideComponent';
import PostComponent from '../post/PostComponent';
import PostTextBoxComponent from '../post/PostTextBoxComponent';
// PostComponentBoxComponent not used here
import CommentPostComponent from '../post/CommentPostComponent';
// settings not used here
import fileStorage from '../../config/fileStorage';


function ShareItemComponent({post}) {
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();

  const { user } = useContext(UserContext)

  // const []

  // const inputRef = createRef();

  const [refresh, setRefresh] = useState(null)
  const ref = useRef(null);
  const [showEmojis, setShowEmojis] = useState(false)

  const [showComp, setShowComp] = useState("newsfeed");
  
  // removed unused posts state
  const [postsForUser, setPostsForUser] = useState([]);
  const [savedPost, setSavedPost] = useState([]);
  const [userR, setUserR] = useState([]);
  const activeUser = user || userR || {};


  const [postContent, setPostContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [files, setFiles] = useState({});
  // removed unused postImage state
  const [showPostImage, setShowPostImage] = useState(false);

  const [uploadError, setUploadError] = useState("");



  const [editPostId, setEditPostId] = useState(null)

  const [img, setImage] = useState("");






  
    
    
    const [showComment, setShowComment] = useState(false)
    const [showMoreOptions, setShowMoreOptions] = useState(false)
    const [showReactions, setShowReactions] = useState(false)
   
    const [likeReaction, setLikeReaction] = useState(null)

    const something=(event)=> {
        if (event.key === "Enter") {
        }
    }
    
    

    const handleShowingReaction = () => {
        setTimeout(function () { setShowReactions(true) }, 200);
    }

    const handleUnshowingReaction = () => {
        setTimeout(function () { setShowReactions(false) }, 200);
    }

    const handleReaction = () => {
        if(likeReaction) {
            return (<img src="/assets/images/starred.png" alt="" />)
            // return (<img width={30} style={{marginTop:'-5px'}} src={`../assets/images/gif/${likeReaction}.gif`}/>)
        }
        return (<img src="/assets/images/starred.png" alt="" />)
    }

    
    

  // const [cursorPosition, setCursorPosition] = useState();
  // const pickEmoji = (e, {emoji}) => {
  //   const ref = inputRef.current;
  //   ref.focus();
  //   const start = commentContent.substring(0, ref.seletionStart);
  //   const end = commentContent.substring(ref.selectionStart);
  //   const text = start + emoji + end;
  //   setCommentContent(text)
  //   setCursorPosition(start.length+emoji.length)
  // }

  // useEffect(() => {
  //   inputRef.current.selectionEnd = cursorPosition;
  // },[cursorPosition])

  const getPost = async () => {
    try {
      const res = await PostService.getPost()
      // data is not used in this component; we only ensure call succeeds
      const _ = Array.isArray(res.data) ? res.data : (res.data && Array.isArray(res.data.data) ? res.data.data : [])
    } catch (error) {
      // Avoid crashing the UI on 429 or transient network failures.
      console.warn('ShareItemComponent.getPost failed:', error)
    }
  }

  const getPostForUser = async () => {
    try {
      const currentUser = AuthService.getCurrentUser()
      if (!currentUser || !currentUser.username) return

      const res = await PostService.getPostForUser(currentUser.username)
      const data = Array.isArray(res.data) ? res.data : (res.data && Array.isArray(res.data.data) ? res.data.data : [])
      const uniquePost = Array.from(new Set(data.map(a => a.id)))
        .map(id => {
          return data.find(a => a.id === id)
        })
      setPostsForUser(uniquePost)
    } catch (error) {
      console.warn('ShareItemComponent.getPostForUser failed:', error)
    }
  }

  const getSavedPost = async () => {
    try {
      const currentUser = AuthService.getCurrentUser()
      if (!currentUser || !currentUser.username) return

      const res = await PostService.getSavedPostForUser(currentUser.username)
      const data = Array.isArray(res.data) ? res.data : (res.data && Array.isArray(res.data.data) ? res.data.data : [])
      setSavedPost(data)
    } catch (error) {
      console.warn('ShareItemComponent.getSavedPost failed:', error)
    }
  }

  const handlePostContent = (event) => {
    setPostContent(event.target.value)
  }

  const handleDeletePost = (postid) => {
    PostService.deletePost(postid).then(res => {
      setRefresh(res.data)
      // window.location.reload();
    })
  }

  const handleCommentContent = (event) => {
    setCommentContent(event.target.value)
  }

  const handlePostingComment = (postid) => {
    if (commentContent === "") {
      return null;
    }
    const comment = { content: commentContent }
    PostService.addComment(activeUser.id, postid, comment).then(res => {
      setRefresh(res.data)
      setCommentContent("")
    })
  }

  const handleEditPost = (id) => {
    setEditPostId(id)
  }

  const handleFile = (event) => {
    setFiles(event.target.files[0])
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPostImage(reader.result)
      }
    }
    // if(event.target.files[0].type === blob){
    reader.readAsDataURL(event.target.files[0])
    // }
    setShowPostImage(true)
  }

  const handleRemoveImage = () => {
    setFiles({})
    setShowPostImage(false)
  }

  const handleEditingSave = (value) => {
    setEditPostId(value)
    // window.location.reload();
  }
  
  const checkIfLiked = (post) => {
    // maybe this is more effecient
    // post.reactions.map(r => {
    //   if(r.user.id === user.id){
    //     return true
    //   }else{
    //     return false
    //   }
    // })
    const result = post.reactions.filter(reaction => reaction.user.id == userR.id)
    if (result.length > 0) {
      return true
    }
    return false
  }

  const checkIfSaved = (post) => {
    // maybe this is more effecient
    // post.savedByUsers.map(r => {
    // if(r.user.id === user.id){
    //   return true
    // }else{
    //   return false
    // }
    // })
    const result = post.savedByUsers.filter(userz => userz.id == activeUser.id)
    if (result.length > 0) {
      return true
    }
    return false
  }

  const handleDeleteComment = (commentid) => {
    PostService.deleteComment(commentid).then(res => {
      setRefresh(res.data)
    })
  }

  const getCommentCounter = (comments) => {
    let counter = 0
    comments.map(comment => {
      counter += comment.replies.length + 1
    })
    return counter
  }

  const uploadPost = (event) => {
    event.preventDefault();
    setUploadError("")
    if (postContent === "" && (Object.keys(files).length === 0 && files.constructor === Object)) {
      setUploadError("Please Insert A Text or an Image")
      return
    }

    const formData = new FormData();
    formData.append('content', postContent)
    formData.append(`files`, files)
    PostService.createPost(activeUser.id, formData).then(res => {
      setPostContent("")
      handleRemoveImage()
      setRefresh(res.data)
    })
  }
  const handleSettingReactions = (reaction) => {
    setLikeReaction(reaction)
    if (!checkIfLiked(post)) {
        handleLikePost(post.id)  
    }
}
const handleCounterReaction = () => {
  if(likeReaction) {
      return (<img width={20} style={{marginTop:'-5px'}} src={`../assets/images/gif/${likeReaction}.gif`}/>)
  }
  return (<img src="/assets/images/likeic.png" alt="" />)
}
  const handleLikePost = async (post_id) => {
    UserService.likePost(activeUser.id, post_id).then(res => {
      setRefresh(res.data)
    })
  }

  const handleSavePost = async (post_id) => {
    UserService.savePost(activeUser.id, post_id).then(res => {
      setRefresh(res.data)
    })
  }

  const getUser = async () => {
    if (user === null) {
      await UserService.getUserByEmail(AuthService.getCurrentUser().username).then(res => {
        setUserR(res.data);
      })
    } else {
      setUserR(user)
    }
  }
const staticpost=()=>{

}
  const testFanc = (post) => {
    return ( <div><PostComponent post={post} setRefresh={setRefresh}/>
      
        
</div>
      
      
      )
  }

  const show = () => {
    if (showComp === "newsfeed") {
      return (
      
        <div className="loadMore">
         
          {
            postsForUser.map(
              post =>
                <div key={post.id}>
                  {
                    post.group ?
                      post.group.members.some(member => member.email === AuthService.getCurrentUser().username) ?
                        testFanc(post) : null
                      :
                      testFanc(post)
                  }
                  
     
                </div>
            )
          }

        </div>




      )
    } else {
      return (
        <div className="loadMore">
          {
            savedPost.map(
              post =>
                <div key={post.id}>
                  {
                    post.group ?
                      post.group.members.some(member => member.email === AuthService.getCurrentUser().username) ?
                        testFanc(post) : null
                      :
                      testFanc(post)
                  }
                </div>
            )
          }

        </div>
      )
    }
  }


  useEffect(() => {
    getUser()
  }, [user])

  useEffect(() => {
    let isMounted = true

    getPost().then(() => {
      if (isMounted) setIsLoading(false)
    })
    getPostForUser()
    getSavedPost()
    testScript()

    return () => {
      isMounted = false
    }
  }, [editPostId, refresh])

  if (isLoading) {
    return <div>loading... please wait
 Monica</div>
  }

  if (user.newUser) {
    return <GuideComponent />
  }

  return (
    <Layout user={user ? user : userR}>
      
          <div className="col-lg-6">
            <PostTextBoxComponent/>
          
            {/* add post new box */}
            <p className="showCompNewsfeed" style={{ fontWeight: 'bold', color: 'rgb(207, 144, 7)', textAlign: 'center' }}><span onClick={() => setShowComp("newsfeed")}>SharePosts</span> | <span onClick={() => setShowComp("saved")}>Saved Posts</span></p>
            <div className="central-meta item">
<div className="user-post">
   
            <div className="friend-info">

                <div className="post-meta">
                    
                        <a href="#" data-lightbox="image"><img style={{ width: "100%", height: "auto",borderRadius:'10px' }} src="assets/images/virtual-baby-showers-722x406.jpg" /> </a> 
                    

                    
<figure>
                    <img src={fileStorage.baseUrl + (activeUser.profilePicturePath || '')} alt="" />
                </figure>
                
                <div className="friend-name">
                    <div style={{ float: 'left', display: 'inline' }}>

                        <a href="#" title="#" style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{activeUser.firstName || ''} {activeUser.lastName || ''}</a>

                        <span style={{ display: 'block', fontSize: '12px',paddingTop:'5px' }}>on 2/3/2021 </span>
                       
                        


                    </div>
                   

                </div>
                <div className="counter">
                    <ul>
                    <li>{handleCounterReaction()}<span> 0</span></li>
                    <li><span className='commentCounter' style={{ marginRight: '5px' }} onClick={() => setShowComment(!showComment)}><img src="/assets/images/commentwhite.svg" alt="" /></span> <span> 0</span> 
                       </li>
                       <li><span> <img src="/assets/images/shareicnwhite.svg" alt="" /></span> <span> 0 </span>
                      
                        </li>
                    </ul>
                    </div>
                <p>
                            I would like to share the surprise gift to you. anyone can take it
                            <br></br>
                        </p>
                        <div className="buttonS"><a href="/shipping" className="buttonshare">Accept</a></div>
                   

                    
                    {
                        showReactions && <div onMouseEnter={handleShowingReaction} onMouseLeave={handleUnshowingReaction} className="reaction-bunch active">
                            <img src={'../assets/images/gif/smiley.gif'} onClick={() => handleSettingReactions('smiley')}/>
                            <img src={'../assets/images/gif/cool.gif'} onClick={() => handleSettingReactions('cool')}/>
                            <img src={'../assets/images/gif/laughing.gif'} onClick={() => handleSettingReactions('laughing')}/>
                            <img src={'../assets/images/gif/tongue.gif'} onClick={() => handleSettingReactions('tongue')}/>
                            <img src={'../assets/images/gif/angel.gif'} onClick={() => handleSettingReactions('angel')}/>
                            <img src={'../assets/images/gif/devil.gif'} onClick={() => handleSettingReactions('devil')}/>
                            <img src={'../assets/images/gif/angry.gif'} onClick={() => handleSettingReactions('angry')}/>

                        </div>
                    }
                    
                    <div className="we-video-info">
                        <div className='click'>

                          
                       
                                         
                        <div className="commShare"><div className="btncmn" onClick={() => setShowComment(!showComment)}><span className="comment" data-toggle="tooltip" title="Comments"><img src="assets/images/comment.svg"/><span style={{paddingLeft:'2px'}} >Comment</span>


</span></div><div className="btncmn" ><span className="views" data-toggle="tooltip" ><img src="assets/images/shareicn.svg"/><span style={{paddingLeft:'2px'}}>Share</span>

   </span></div></div>
                            
                        </div>
                    </div>
                </div>
                
               
                
                
            </div>
            

    {/* Till here */}
    <div className="coment-area">
        <ul className="we-comet">
        <li className="post-comment">
                <div className="comet-avatar">
                  <img src={fileStorage.baseUrl + (activeUser.profilePicturePath || '')} alt="" />
                </div>
                <div className="post-comt-box">
                  <Form>

                    <textarea rows={2} placeholder="write something" name="comment" value={commentContent} ref={ref} onChange={handleCommentContent} />

                    
                    <div className="add-smiles">

                      <span title="add icon" onClick={() => setShowEmojis(!showEmojis)}><i className="lar la-laugh"></i></span>
                    </div>
                    {
                      showEmojis && <div className="smiles-bunch active">
                         <i className="em em---1"></i>
																<i className="em em-smiley"></i>
																<i className="em em-anguished"></i>
																<i className="em em-laughing"></i>
																<i className="em em-angry"></i>
																<i className="em em-astonished"></i>
																<i className="em em-blush"></i>
																<i className="em em-disappointed"></i>
																<i className="em em-worried"></i>
																<i className="em em-kissing_heart"></i>
																<i className="em em-rage"></i>
																<i className="em em-stuck_out_tongue"></i>
                      {/* <Picker onEmojiClick={onEmojiClick} /> */}
                      {/* <h1>hi</h1> */}
                      </div>
                    }
                      <div className="gif"><img style={{objectFit:'cover'}} src="/assets/images/sticker.png" alt="" /></div>
                      <div className="cam"><img  src="/assets/images/Group.png" alt="" /></div>
                      {/* <div className="sticker"><i className="lar la-sticky-note"></i></div> */}

                   
                  </Form></div>
              </li>
            {
                showComment && <CommentPostComponent post={post} setRefresh={setRefresh} />
            }
        </ul>
    </div>
    <div className="add-dropdown" onClick={() => setShowMoreOptions(!showMoreOptions)}>
                            <span title="add icon" ><i className="las la-ellipsis-h"></i></span>
                        </div>
                        {
                            showMoreOptions && <div className="drop-options active">
                                <ul><li className="head-drop"><h6>Post Options</h6></li>
                                   
                                    <li><i className="las la-link"></i><span>Copy Link</span></li>
                                </ul>
                            </div>
                        }
</div>
</div>


            {
              
              show()
            }
            
          </div>
      
    </Layout>

  );
}
export default ShareItemComponent;