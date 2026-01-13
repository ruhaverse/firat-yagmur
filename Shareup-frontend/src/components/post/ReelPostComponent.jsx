import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import UserService from '../../services/UserService';
import PostService from '../../services/PostService';
import SwapService from '../../services/SwapService';
import EditPostComponent from './EditPostComponent'
import CommentPostComponent from './CommentPostComponent';
import PostComponentBoxComponent from './PostCommentBoxComponent';
import Popup from 'reactjs-popup';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import ImageGallery from 'react-image-gallery';
import storage from "../../config/fileStorage";
import Carousel from 'react-bootstrap/Carousel'
import fileStorage from '../../config/fileStorage';
import ShareService from '../../services/ShareService';




import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Form from 'react-bootstrap/Form';
import moment from 'moment'


const my_url = `${storage.baseUrl}`

export default function ReelPostComponent({ post, setRefresh }) {
    const { user } = useContext(UserContext)

    const defaultAvatar = "../assets/images/resources/admin.jpg";
    const getUserAvatarSrc = (u) => {
        const p = u?.profilePicturePath;
        if (!p) return defaultAvatar;
        if (typeof p === 'string' && p.startsWith('http')) return p;
        return fileStorage.baseUrl + p;
    };
    const getMediaSrc = (mediaPath) => {
        if (!mediaPath) return '';
        if (typeof mediaPath === 'string' && mediaPath.startsWith('http')) return mediaPath;
        return `${fileStorage.baseUrl}${mediaPath}`;
    };

    const postUser = post?.user || {};
    const postUserName = `${postUser?.firstName || ''} ${postUser?.lastName || ''}`.trim();
    const postUserEmail = postUser?.email || '';

    const [editPostId, setEditPostId] = useState(null)
    const [userR, setUserR] = useState([]);
    const [showComment, setShowComment] = useState(false)
    const [showMoreOptions, setShowMoreOptions] = useState(false)
    const [showReactions, setShowReactions] = useState(false)

    const [showUserReactions, setShowUserReactions] = useState(false)

    const [showSwapImage, setShowSwapImage] = useState(false);
    const [swapImage, setSwapImage] = useState({});
    const [swapfiles, setSwapfiles] = useState([]);

    const [photoIndex, setPhotoindex] = useState(0);
    const [isOpen, setIsopen] = useState(false);


    const [likeReaction, setLikeReaction] = useState(null)
    const [imgString, setimgString] = useState("");
    const images = [
        {
            original: `/user-post/${post.id}/${imgString[0]}`,
            thumbnail: `/user-post/${post.id}/${imgString[0]}`,
        }


    ];


    const handleRemoveImageSwap = () => {
        // setSwapfiles({});
        setShowSwapImage(false);
    };


    const something = (event) => {
        if (event.key === "Enter") {
        }
    }
    const handleEditPost = (id) => {
        setEditPostId(id)
        setRefresh(id)

    }

    const getCommentCounter = (comments) => {
        if (!Array.isArray(comments) || comments.length === 0) return "";
        let counter = 0;
        comments.forEach(comment => {
            const repliesLen = Array.isArray(comment?.replies) ? comment.replies.length : 0;
            counter += repliesLen + 1;
        });
        return counter > 0 ? `${counter} Comments` : "";
    };


    const getShareCounter = (shares) => {
        let counter = 0
        shares.map(share => {
            counter += share.replies.length + 1
        })
        if (counter > 0)
            return counter + " shares"
        else return ""

    }



    const handleSwapContent = (event) => {
        setShareContent(event.target.value);
    };
    const checkIfLiked = (post) => {
        if (post.reactions) {
            const result = post.reactions.filter(reaction => reaction.user.id == user.id)
            if (result.length > 0) {
                return true
            }
            return false
        }
    }
    const handleFileSwap = (event) => {
        setSwapfiles(event.target.files);
        const filesAmount = event.target.files.length;
        if (filesAmount < 6) {
            const tempImage = [];
            for (let i = 0; i < filesAmount; i++) {
                //tempImage=[...tempImage,URL.createObjectURL(event.target.files[i])]
                tempImage.push(URL.createObjectURL(event.target.files[i]));
            }

            setSwapImage(tempImage);

            setShowSwapImage(true);
        } else {
            alert('5 files are allowed');
            event.preventDefault();
        }
    };
    const checkIfSaved = (post) => {
        if (post.savedByUsers) {
            const result = post.savedByUsers.filter(userz => userz.id == user.id)
            if (result.length > 0) {
                return true
            }
            return false
        }

    }

    const handleLikePost = async (post_id) => {
        await UserService.likePost(user.id, post_id).then(res => {
            setRefresh(res.data)
        })
    }

    const handleSavePost = async (post_id) => {
        UserService.savePost(user.id, post_id).then(res => {
            setRefresh(res.data)
        })
        setShowMoreOptions(false);
    }

    const handleDeletePost = (post) => {
        if (post.media) {
            SwapService.deleteSwap(post.id).then(res => {
                setRefresh(res.data)
            })
        } else
            PostService.deletePost(post.id).then(res => {
                setRefresh(res.data)
            })
    }

    const handleEditingSave = (value) => {
        setEditPostId(value)
        setRefresh(value)
        setShowMoreOptions(false)
    }



    const handleShowuserReaction = () => {
        setTimeout(function () { setShowUserReactions(true) }, 200);
    }

    const handleUnshowuserReaction = () => {
        setTimeout(function () { setShowUserReactions(false) }, 200);
    }




    const handleShowingReaction = () => {
        setTimeout(function () { setShowReactions(true) }, 200);
    }

    const handleUnshowingReaction = () => {
        setTimeout(function () { setShowReactions(false) }, 200);
    }






    const handleReaction = () => {
        if (likeReaction) {
            return (<i className="fas fa-star" style={{ fontSize: '12px' }}></i>)
            // return (<img width={30} style={{marginTop:'-5px'}} src={`../assets/images/gif/${likeReaction}.gif`}/>)
        }
        return (<i className="fas fa-star" style={{ fontSize: '12px', color: '#d83535' }}></i>)
    }

    const handleSettingReactions = (reaction) => {
        setLikeReaction(reaction)
        if (!checkIfLiked(post)) {
            handleLikePost(post.id)
        }
    }

    const handleCounterReaction = () => {
        if (likeReaction) {
            return (<img width={20} style={{ marginTop: '-5px' }} src={`../assets/images/gif/${likeReaction}.gif`} />)
        }
        return (<img src="/assets/images/Starwhite.svg" alt="" style={{ left: '16px', height: '15px', position: 'absolute', bottom: '16px', background: 'darksalmon' }} />)
    }
    //array fetch
    const postImg = (str) => {
        if (str != null) {
            let temps = [];
            for (let i = 0; i < str.length; i++)
                temps = [...temps, `/user-post/${post.id}/${str[i]}`]
        }
    };
    const toggleShowMoreOptions = (e) => {
        e.preventDefault();
        setShowMoreOptions(!showMoreOptions);
    };

    const imageshowSwap = () => {
        return (
            <div className="swap-rqst">
                <div className='' style={{ width: '100%' }}>
                    <label className='fileContainer' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <input type='file' name='swap_image' accept='image/*' onChange={handleFileSwap}></input>
                        Upload swap images<i className='lar la-file-image'></i>
                    </label>
                </div>
            </div>

        )
    }
    const openLightbox = (index) => {
        setIsopen(true);
        setPhotoindex(index)
    }






    const [userF, setUserF] = useState(null);
    const [shareContent, setShareContent] = useState('');

    const uploadShare = async (event) => {
        await event.preventDefault();


        const formData = new FormData();

        await formData.append('content', shareContent);


        if (userF === null) {
            await ShareService.createShare(user.id, post.id, formData, null).then((res) => {
                // setCloseModal(false)
                // window.location.reload();

                setShareContent('');
                setRefresh(res.data);
                // window.location.reload();

            });
        } else
            await ShareService.createShare(user.id, post.id).then((res) => {
                setShareContent('');

                setRefresh(res.data);
            });
    };

    const sharepopup = () => {
        return (
            <Popup
                trigger={
                    <span style={{ cursor: 'pointer' }} >
                        <span style={{ marginRight: '5px' }}>
                        </span>
                        Share
                    </span>
                }
                modal
                nested
                closeOnDocumentClick
            >
                {(close) => (
                    <Form className='popwidth' onSubmit={(e) => {
                        uploadShare(e); close();
                    }}>
                        <div className='headpop'>
                            <div className='row'>
                                <div style={{ width: '20%' }}>
                                    <a href='#!' style={{ padding: '10px 80px 10px 0' }} onClick={close}>
                                        <i className='las la-times'></i>
                                    </a>
                                </div>

                                <div style={{ width: '20%', textAlign: 'right', padding: '0' }}>

                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '0 11px 11px 11px' }}>
                            <div className='popupimg'>
                                <img
                                    src={
                                        user ? getUserAvatarSrc(user) : getUserAvatarSrc(userR)
                                    }
                                    alt=''
                                />
                            </div>
                            <div className='popupuser-name'>

                                <div style={{ display: 'inline' }}>
                                    <span>
                                        {`${user.firstName} ${user.lastName}`}
                                        {userF ?
                                            <> with {`${userF.firstName} ${userF.lastName}`}</> : null}
                                    </span>
                                    <span style={{ marginTop: '4px ', display: 'block', fontSize: '10px' }}>
                                        <li style={{ paddingLeft: '0%', paddingTop: '1%', listStyleType: 'none' }}>

                                        </li>

                                    </span>
                                </div>{' '}
                            </div>{' '}
                        </div>
                        <div style={{ minHeight: '150px' }}>
                            <span className='textPop'>
                                <textarea
                                    className='textpopup'
                                    rows={2}
                                    name='swap_content'
                                    value={shareContent}
                                    onChange={handleSwapContent}
                                />

                                {showSwapImage ? (
                                    <>
                                        <div style={{ position: 'relative' }}>
                                            {swapImage.map((item, key) => (
                                                <img
                                                    src={item}
                                                    key={key}
                                                    style={{
                                                        padding: '10px',
                                                        display: 'inline-block',
                                                        verticalAlign: 'middle',
                                                    }}
                                                />
                                            ))}


                                        </div>

                                    </>
                                ) : null}
                            </span>
                        </div>


                        <button
                            type='submit'
                            value='Submit'
                            className="popsbmt-btn"
                        // onClick={}
                        >
                            share
                        </button>
                    </Form>
                )}
            </Popup>
        );
    };




    useEffect(() => {
    }, []);



    



    return (
        <div
            className='central-meta item'
            style={{ paddingBottom: '0px' }}
            key={post.id}
            onClick={(e) => {
                if (showMoreOptions) toggleShowMoreOptions(e);
            }}
        >
            <div
                className='container_drop-options__transparent'
                hidden={!showMoreOptions}
                onClick={toggleShowMoreOptions}
            ></div>
            <div className='user-post'>
                {editPostId !== post.id ? (
                    <div className='friend-info'>
                        <div className='post-meta'>

                            <div className='friend-name' style={{ width: "100%", display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
                                <div style={{ display: 'flex' }}>

                                    <figure>
                                        <img src={getUserAvatarSrc(postUser)} alt='' className="post-user-img" />
                                    </figure>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '10px' }}>
                                        <a
                                            href={`/profile/${postUserEmail}`}
                                            title='#'
                                            style={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                                        >


                                            {postUserName}


                                            {post.allPostsType === 'share' ?
                                                <span style={{ paddingLeft: '10px', textTransform: 'lowercase', fontWeight: '100', fontSize: '14px' }}>shared a post   </span>

                                                : null}
                                            {post.userTag ? (
                                                <>
                                                    <span style={{ padding: '0 5px' }}>with</span>{' '}
                                                    <span className='tagPost'>{post.userTag.firstName}</span>
                                                    <span className='tagPost'>{post.userTag.lastName}</span>
                                                </>
                                            ) : null}

                                        </a>
                                        <span style={{ display: 'block', fontSize: '12px', paddingTop: '5px' }}>
                                            on {moment(post.published).fromNow()}
                                        </span>
                                    </div>

                                </div>

                                <div className="add-dropdown" onClick={(e) => { e.stopPropagation(); setShowMoreOptions(!showMoreOptions); }}>
                                    <button className="btn" type="button">
                                        <i className='fas fa-ellipsis-h' style={{ fontSize: '20px' }}></i>
                                    </button>
                                    {showMoreOptions && (
                                        <div className="drop-options active" onClick={toggleShowMoreOptions}>
                                            <ul>
                                                {postUser?.id === user?.id ? (
                                                    <li onClick={() => handleEditPost(post.id)}>
                                                        <i className='las la-pencil-alt'></i>
                                                        <span>Edit Post</span>
                                                    </li>
                                                ) : null}
                                                <li onClick={() => handleSavePost(post.id)}>
                                                    <i className='lar la-bookmark'></i>
                                                    <span>Save Post</span>
                                                </li>
                                                {postUser?.id === user?.id ? (
                                                    <li onClick={() => handleDeletePost(post)}>
                                                        <i className='las la-trash'></i>
                                                        <span>Delete</span>
                                                    </li>
                                                ) : null}
                                                <li>
                                                    <i className='las la-link'></i>
                                                    <span>Copy Link</span>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                            </div>

                            {post.content && (
                                <p
                                    id={`post-content-${post.id}`}
                                    style={{
                                        fontSize: '14px',
                                        color: 'black',
                                        overflowWrap: 'break-word',
                                        wordBreak: 'break-word',
                                        whiteSpace: 'pre-wrap',
                                        margin: 0,
                                    }}
                                >
                                    {`${post.content}`}
                                    <br />
                                </p>
                            )}


                            <div className='postImage' style={{ overflow: 'hidden', maxWidth: '100%', boxSizing: 'border-box' }}>
                                {post.allPostsType === 'reel' && post.media && post.media.length === 1
                                    ? post.media.map((postVideo) => (
                                        <React.Fragment>
                                            <video
                                                preload="none"
                                                loop
                                                controls
                                                autoPlay
                                                muted
                                                style={{ width: '100%', maxHeight: '460px', objectFit: 'cover', display: 'block' }}
                                                src={getMediaSrc(postVideo?.mediaPath)}
                                                type="video/mp4"
                                                alt={getMediaSrc(postVideo?.mediaPath)}
                                                onClick={() => setIsopen()}
                                            />


                                        </React.Fragment>
                                    ))
                                    : null}
                            </div>

                            {post.allPostsType === 'share' ?
                                <div className='postShared'>

                                    <div className='friend-name' style={{ width: "100%", display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
                                        <div style={{ display: 'flex' }}>
                                            <figure>
                                                <img src={getUserAvatarSrc(post?.post?.user)} alt='' className="post-user-img" style={{ borderRadius: '100%' }} />
                                            </figure>
                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '10px' }}>
                                                <a
                                                    href={`/profile/${post.post.user.email}`}
                                                    title='#'
                                                    style={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                                                >
                                                    {`${post.post.user.firstName} ${post.post.user.lastName}`}
                                                    {post.post.userTag ? (
                                                        <>
                                                            <span style={{ padding: '0 5px' }}>with</span>{' '}
                                                            <span className='tagPost'>{post.post.userTag.firstName}</span>
                                                            <span className='tagPost'>{post.post.userTag.lastName}</span>
                                                        </>
                                                    ) : null}
                                                </a>
                                                <span style={{ display: 'block', fontSize: '12px', paddingTop: '5px' }}>
                                                    on {moment(post.post.published).fromNow()}
                                                    {/* {checkIfSaved(post) && <i className='las la-bookmark szbkmrk'></i>} */}
                                                </span>
                                            </div>

                                        </div>

                                        <div className="add-dropdown" onClick={(e) => { e.stopPropagation(); setShowMoreOptions(!showMoreOptions); }}>
                                            <button className="btn" type="button">
                                                <i className='fas fa-ellipsis-h' style={{ fontSize: '20px' }}></i>
                                            </button>
                                            {showMoreOptions && (
                                                <div className="drop-options active" onClick={toggleShowMoreOptions}>
                                                    <ul>
                                                        {post.post.user.id === user.id ? (
                                                            <li onClick={() => handleEditPost(post.id)}>
                                                                <i className='las la-pencil-alt'></i>
                                                                <span>Edit Post</span>
                                                            </li>
                                                        ) : null}
                                                        <li onClick={() => handleSavePost(post.id)}>
                                                            <i className='lar la-bookmark'></i>
                                                            <span>Save Post</span>
                                                        </li>
                                                        {post.post.user.id === user.id ? (
                                                            <li onClick={() => handleDeletePost(post.post)}>
                                                                <i className='las la-trash'></i>
                                                                <span>Delete</span>
                                                            </li>
                                                        ) : null}
                                                        <li>
                                                            <i className='las la-link'></i>
                                                            <span>Copy Link</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                    {post.post.content && (
                                        <p
                                            id={`post-content-${post.id}`}
                                            style={{
                                                fontSize: '14px',
                                                color: 'black',
                                                overflowWrap: 'break-word',
                                                wordBreak: 'break-word',
                                                whiteSpace: 'pre-wrap',
                                                margin: 0,
                                            }}
                                        >
                                            {`${post.post.content}`}
                                            <br />
                                        </p>
                                    )}





                                    {



                                        post.allPostsType === 'share' && post.post.allPostsType === 'post' && post.post.media.length > 1
                                            ? <>
                                                <OwlCarousel items={1}
                                                    className="owl-theme grp-carousel post-carousel"
                                                    dots
                                                    nav
                                                    navText={[
  "<i class='fa fa-chevron-left'></i>",
  "<i class='fa fa-chevron-right'></i>"
]}
                                                    margin={10}>
                                                    {post.post.media.map((postImage, index) => (
                                                        <React.Fragment>
                                                            <img
                                                                style={{ height: '420px', width: '100%', objectFit: 'cover' }}
                                                                src={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                                                                alt={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                                                                className="lightbox-popup"
                                                                onClick={() => openLightbox(index)}
                                                            />
                                                        </React.Fragment>
                                                    ))}
                                                </OwlCarousel>
                                                {isOpen && (
                                                    <Lightbox
                                                        mainSrc={fileStorage.baseUrl + post.post.media[photoIndex].mediaPath}
                                                        nextSrc={post.post.media[(photoIndex + 1) % post.post.media.length]}
                                                        prevSrc={post.post.media[(photoIndex + post.post.media.length - 1) % post.post.media.length]}
                                                        onCloseRequest={() => setIsopen(false)}
                                                        onMovePrevRequest={() =>
                                                            setPhotoindex((photoIndex + post.post.media.length - 1) % post.post.media.length)
                                                        }
                                                        onMoveNextRequest={() =>
                                                            setPhotoindex((photoIndex + 1) % post.post.media.length)
                                                        }
                                                    />
                                                )}
                                            </>
                                            : post.post.allPostsType === 'post' && post.post.media && post.post.media.length == 1
                                                ? post.post.media.map((postImage) => (
                                                    <React.Fragment>
                                                        <img
                                                            style={{ width: '100%', objectFit: 'cover' }}
                                                            src={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                                                            alt={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                                                            className="lightbox-popup"
                                                            onClick={() => setIsopen(true)}
                                                        />
                                                        {isOpen && (
                                                            <Lightbox
                                                                open={isOpen}
                                                                close={() => setIsopen(false)}
                                                                slides={[
                                                                  { src: fileStorage.baseUrl + postImage.mediaPath }
                                                                ]}
                                                                index={0}
                                                            />
                                                        )}
                                                    </React.Fragment>
                                                ))
                                                : post.post.allPostsType === 'swap' && post.post.media ? post.post.media.map((postImage) => (
                                                    <div className="swappost-main-div">
                                                        {/* <Popup */}
                                                        {/* trigger={ */}
                                                        <img
                                                            style={post?.user?.id == user?.id ? { width: '100%', objectFit: 'cover' } : { borderRadius: '10px 10px 0 0' }}
                                                            src={getMediaSrc(postImage?.mediaPath)}
                                                            alt={getMediaSrc(postImage?.mediaPath)}
                                                            onClick={() => setIsopen(true)}

                                                        />
                                                        {isOpen && (
                                                            <Lightbox
                                                                mainSrc={fileStorage.baseUrl + postImage.mediaPath}
                                                                onCloseRequest={() => setIsopen(false)}
                                                            />
                                                        )}
                                                        {post?.post?.user?.id !== user?.id &&
                                                            <div className='swappost-cont'>
                                                                <div className=''>
                                                                    <div className="bold " style={{ marginBottom: '5px', marginTop: '10px', color: '#050505' }}>{post.category ? post.category : 'Category'}</div>
                                                                    <div style={{ fontSize: '14px' }}>{post.content ? post.content : 'Get swapped with your favourite things'}</div>
                                                                    {/* <div style={{marginBottom:'2px', fontSize:'13px'}}>Get swapped with your favourite things</div> */}
                                                                </div>
                                                                <Popup
                                                                    trigger={
                                                                        <button className="button" >SWAP</button>
                                                                    }
                                                                    modal
                                                                    nested
                                                                >
                                                                    {(close) => (
                                                                        <Form style={{ margin: '5px' }} className='popwidth rqst-swap-form' onSubmit={close}>

                                                                            <div className='headpop'>
                                                                                <div className='row'>
                                                                                    <div style={{ width: '20%' }}>
                                                                                        <a href='#!' style={{ padding: '10px 80px 10px 0' }} onClick={close}>
                                                                                            <i className='las la-times'></i>
                                                                                        </a>
                                                                                    </div>
                                                                                    <div
                                                                                        style={{ color: '#000000', fontSize: '18px', fontWeight: 'bold', width: '60%', textAlign: 'center' }}
                                                                                    >
                                                                                        {' '}
                                                                                        <span>Request for Swap</span>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                            <div style={{ padding: '0 11px 11px 11px' }}>
                                                                                <div className='popupimg'>
                                                                                    <img
                                                                                        src={
                                                                                            user ? getUserAvatarSrc(user) : getUserAvatarSrc(userR)
                                                                                        }
                                                                                        alt=''
                                                                                    />
                                                                                </div>
                                                                                <div className='popupuser-name'>
                                                                                    <div style={{ display: 'inline' }}>
                                                                                        <span>
                                                                                            {`${user.firstName} ${user.lastName}`}
                                                                                            {postUserName ? <> <span style={{ color: 'rgb(100 166 194)', fontWeight: '500' }}>swap with</span> {postUserName}</> : null}
                                                                                        </span>
                                                                                        <span style={{ marginTop: '4px ', display: 'block', fontSize: '10px' }}>
                                                                                            <li style={{ paddingLeft: '0%', paddingTop: '1%', listStyleType: 'none' }}>
                                                                                                {/* {popAudience()} */}
                                                                                            </li>

                                                                                            {/* <div className='dropdownnewsfeed'>
                                        <select name='privacy' id='privacy' value={Privacy} onChange={handlePrivacy}>
                                          <option value='Friends'>Friends</option>
                                          <option value='Public'>Public</option>
                                          <option value='Only Me'>Only Me</option>
                                        </select>
                                      </div>{' '} */}
                                                                                        </span>
                                                                                    </div>{' '}
                                                                                </div>{' '}
                                                                            </div>
                                                                            <div style={{ minHeight: '150px' }}>
                                                                                <span className='textPop'>
                                                                                    <textarea
                                                                                        className='textpopup'
                                                                                        rows={2}
                                                                                        // style={{fontSize:'14px'}}
                                                                                        placeholder={
                                                                                            'Share about swap with ' + (postUser?.firstName || 'user') + '?'
                                                                                        }
                                                                                        
                                                                                        
                                                                                        name='swap_content'
                                                                                        value={shareContent}
                                                                                        onChange={handleSwapContent}
                                                                                    />

                                                                                    {showSwapImage ? (
                                                                                        <>
                                                                                            <div style={{ position: 'relative' }}>
                                                                                                {swapImage.map((item, key) => (
                                                                                                    <img
                                                                                                        src={item}
                                                                                                        key={key}
                                                                                                        style={{
                                                                                                            padding: '10px',
                                                                                                            display: 'inline-block',
                                                                                                            verticalAlign: 'middle',
                                                                                                        }}
                                                                                                    />
                                                                                                ))}

                                                                                                {/* <img id="preview" src={postImage} style={{ width: "100%",objectFit:'cover' }} /> */}
                                                                                                <button
                                                                                                    onClick={handleRemoveImageSwap}
                                                                                                    style={{
                                                                                                        right: '10px',
                                                                                                        top: '10px',
                                                                                                        position: 'absolute',
                                                                                                        borderRadius: '100%',
                                                                                                        background: '#b7b7b738',
                                                                                                        padding: '10px 10px',
                                                                                                    }}
                                                                                                >
                                                                                                    <i className='las la-times'></i>
                                                                                                </button>
                                                                                            </div>

                                                                                        </>
                                                                                    ) : null}
                                                                                </span>
                                                                                {/* <a href="#!" onClick={() => setShowCompont("image")}><span style={{float:'right',padding:'5px',margin:'5px',background:'#033347',padding: '2px 5px',color:'#fff',borderRadius:'5px'}}>+</span></a>*/}
                                                                            </div>

                                                                            {imageshowSwap()}
                                                                            <div
                                                                                type='submit'
                                                                                value='Submit'
                                                                                style={{
                                                                                    textAlign: 'center',
                                                                                    background: '#033347',
                                                                                    fontWeight: 'bold',
                                                                                    color: 'white',
                                                                                    margin: '11px 11px',
                                                                                    padding: '15px',
                                                                                    borderRadius: '5px',
                                                                                    fontSize: '14px',
                                                                                    cursor: 'pointer',
                                                                                }}
                                                                                onClick={close}
                                                                            >
                                                                                Request for Swap
                                                                            </div>
                                                                        </Form>
                                                                    )}
                                                                </Popup>

                                                                {/* <div className='itemS3'> */}
                                                                {/* <>
                          <div className='swapImage'>
                            <a href={post.swapImagePath} data-lightbox={`image-user-${post.user.id}`}>
                              <img
                                style={{ width: '100%', objectFit: 'cover' }}
                                src={post.swapImagePath}
                              />{' '}
                            </a>
                          </div>{' '}
                        </> */}
                                                                {/* </div> */}
                                                            </div>
                                                        }

                                                    </div>




                                                )) : null}



                                    <div className='counter' style={{ fontSize: '12px' }}>
                                        <ul>
                                            <li style={{ float: 'left', color: 'black' }}>
                                                {checkIfLiked(post.post) ? (
                                                    <div className='userreaction' >
                                                        <span className='isreaction' data-toggle='tooltip' title=''>
                                                            {handleReaction()}

                                                            {/* <span style={{ paddingLeft: '5px' }}>{post.reactions&&post.reactions.length>0?post.reactions.length:''}</span> */}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className='userreaction' onClick={() => handleLikePost(post.post.id)}>
                                                            <span className='noreaction' data-toggle='tooltip' title=''
                                                                onMouseEnter={handleShowuserReaction}
                                                                onMouseLeave={handleUnshowuserReaction}>

                                                                {/* <img src='/assets/images/Star.svg' alt='' /> */}
                                                                {/* <span style={{ paddingLeft: '10px' }}>Star</span> */}
                                                                <i className="far fa-star" ></i>

                                                                {/* <span style={{paddingLeft:'5px'}}>{post.reactions&&post.reactions.length>0?post.reactions.length:''}</span> */}

                                                            </span>

                                                        </div>
                                                    </>
                                                )}
                                                <span style={{ paddingLeft: '5px' }}>


                                                    {post.post.reactions && post.post.reactions.length + " "}

                                                </span>
                                            </li>



                                            <li style={{ float: 'right', color: 'black', paddingLeft: '0px' }}>
                                                <span>

                                                    {`${(post.post.numberOfshares)}` + " "}

                                                    {sharepopup()}
                                                    {/* <img src='/assets/images/shareicnwhite.svg' alt='' /> */}


                                                </span>
                                            </li>



                                            <li style={{ cursor: 'pointer', float: 'right', color: 'black' }}>
                                                <span

                                                    className='commentCounter'
                                                    style={{ marginRight: '5px' }}
                                                    onClick={() => setShowComment(!showComment)}
                                                >
                                                    {/* <img src='/assets/images/commentwhite.svg' alt='' /> */}
                                                </span >{' '}
                                                <span > {`${getCommentCounter(post.post.comments)}` + " "}
                                                </span>
                                            </li>







                                        </ul>
                                    </div>


                                </div>
                                : null
                            }




                            <div className='counter'>
                                <ul>
                                    <li style={{ float: 'left', color: 'black' }}>
                                        {checkIfLiked(post) ? (
                                            <div className='userreaction' >
                                                <span className='isreaction' data-toggle='tooltip' title=''>
                                                    {handleReaction()}

                                                    {/* <span style={{ paddingLeft: '5px' }}>{post.reactions&&post.reactions.length>0?post.reactions.length:''}</span> */}
                                                </span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className='userreaction' onClick={() => handleLikePost(post.id)}>
                                                    <span className='noreaction' data-toggle='tooltip' title=''
                                                        onMouseEnter={handleShowuserReaction}
                                                        onMouseLeave={handleUnshowuserReaction}>

                                                        {/* <img src='/assets/images/Star.svg' alt='' /> */}
                                                        {/* <span style={{ paddingLeft: '10px' }}>Star</span> */}
                                                        <i className="far fa-star" ></i>

                                                        {/* <span style={{paddingLeft:'5px'}}>{post.reactions&&post.reactions.length>0?post.reactions.length:''}</span> */}

                                                    </span>

                                                </div>
                                            </>
                                        )}
                                        <span style={{ paddingLeft: '5px' }}>


                                            {post.reactions && post.reactions.length + " "}

                                        </span>
                                    </li>



                                    <li style={{ float: 'right', color: 'black', paddingLeft: '0px' }}>
                                        <span>  {`${(post.numberOfshares)}` + " "}


                                            {sharepopup()}
                                            {/* <img src='/assets/images/shareicnwhite.svg' alt='' /> */}


                                        </span>
                                    </li>



                                    <li style={{ cursor: 'pointer', float: 'right', color: 'black' }}>
                                        <span
                                            className='commentCounter'
                                            style={{ marginRight: '5px' }}
                                            onClick={() => setShowComment(!showComment)}
                                        >
                                            {/* <img src='/assets/images/commentwhite.svg' alt='' /> */}
                                        </span>{' '}
                                        <span> {`${getCommentCounter(post.comments)}` + " "}
                                        </span>
                                    </li>





                                </ul>
                            </div>

                            {showReactions && (
                                <div
                                    onMouseEnter={handleShowingReaction}
                                    onMouseLeave={handleUnshowingReaction}
                                    className='reaction-bunch active'
                                >

                                </div>
                            )}

                            <div className='we-video-info post-action' style={{ marginLeft: '10px' }}>
                                <div className='click'>


                                    <div className='commShare'>
                                        {checkIfLiked(post) ? (
                                            <div className='btncmn' onClick={() => handleLikePost(post.id)}>
                                                <span className='like' data-toggle='tooltip' title=''>
                                                    {handleReaction()}
                                                    Star
                                                </span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className='btncmn' onClick={() => handleLikePost(post.id)}>
                                                    <span className='dislike' data-toggle='tooltip' title=''
                                                        onMouseEnter={handleShowingReaction}
                                                        onMouseLeave={handleUnshowingReaction}>

                                                        {/* <img src='/assets/images/Star.svg' alt='' /> */}
                                                        {/* <span style={{ paddingLeft: '10px' }}>Star</span> */}
                                                        <i className="far fa-star" style={{ paddingRight: '5px' }}></i>
                                                        Star
                                                        {/* <span style={{paddingLeft:'5px'}}>{post.reactions&&post.reactions.length>0?post.reactions.length:''}</span> */}

                                                    </span>
                                                    {/* <div className='smiliehint'>
                        {(
                          <div
                           
                            className='reaction-bunch active'
                          >
                            <img src={'../assets/images/gif/smiley.gif'} onClick={() => handleSettingReactions('smiley')} />
                            <img src={'../assets/images/gif/cool.gif'} onClick={() => handleSettingReactions('cool')} />
                            <img src={'../assets/images/gif/laughing.gif'} onClick={() => handleSettingReactions('laughing')} />
                            <img src={'../assets/images/gif/tongue.gif'} onClick={() => handleSettingReactions('tongue')} />
                            <img src={'../assets/images/gif/angel.gif'} onClick={() => handleSettingReactions('angel')} />
                            <img src={'../assets/images/gif/devil.gif'} onClick={() => handleSettingReactions('devil')} />
                            <img src={'../assets/images/gif/angry.gif'} onClick={() => handleSettingReactions('angry')} />
                          </div>
                        )} 
                        </div> */}

                                                </div>
                                            </>
                                        )}




                                        <div className='btncmn' style={{ padding: '0px' }} onClick={() => setShowComment(!showComment)}>
                                            <span className='comment' data-toggle='tooltip' title='Comments' >

                                                {/* <img src='/assets/images/comment.svg' /> */}
                                                {/* <span style={{ paddingLeft: '2px' }}>Comment</span> */}
                                                <i className="far fa-comment"></i>
                                                <span style={{ paddingLeft: '5px' }}>
                                                    Comments

                                                    {/* {getCommentCounter(post.comments)} */}
                                                </span>
                                            </span>
                                        </div>


                                        <div className='btncmn'>
                                            <span className='views' data-toggle='tooltip' title='Share' >
                                                {/* <img src='/assets/images/shareicn.svg' /> */}
                                                <i className="fas fa-share" style={{ paddingRight: '5px' }}></i>
                                                {sharepopup()}

                                            </span>
                                        </div>
                                        {/* <div className='btncmn'>
                      <span className='views' data-toggle='tooltip'>
                        
                        {checkIfSaved(post)==true?<i className="fas fa-bookmark" style={{color:'#044f66'}} onClick={()=>handleSavePost(post.id)} title='Save post' ></i>:<i className="far fa-bookmark" onClick={()=>handleSavePost(post.id)}  title='Save post'></i>}
                        {/* <span style={{ paddingLeft: '12px' }}>Share</span> */}
                                        {/* </span>
                    </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <EditPostComponent post={post} set={handleEditingSave} />
                )}

                <div className='coment-area'>

                    <ul className='we-comet'>
                        <PostComponentBoxComponent post={post} setRefresh={setRefresh} />
                        {/* {showComment && <PostComponentBoxComponent post={post} setRefresh={setRefresh} />} */}
                        {showComment && <CommentPostComponent post={post} setRefresh={setRefresh} />}
                    </ul>
                </div>
            </div>
        </div>
    );

}