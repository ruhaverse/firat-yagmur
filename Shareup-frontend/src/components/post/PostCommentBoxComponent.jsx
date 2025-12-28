import React, { useState, useContext, useRef } from 'react';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import Form from 'react-bootstrap/Form';
import fileStorage from '../../config/fileStorage';
import Picker from 'emoji-picker-react';
import axios from 'axios';
import Stickers from "../Stickers";

import '../../css/giphy-picker.css';

export default function PostComponentBoxComponent({ post, setRefresh }) {
  const { user } = useContext(UserContext);
  const ref = useRef(null);

  const [commentContent, setCommentContent] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [showGifs, setShowGifs] = useState(false);
  const [showSticker, setShowSticker] = useState(false);

  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [chosenGif, setChosenGif] = useState(null);
  const [chosenSticker, setSticker] = useState(null);

  const [tenorResults, setTenorResults] = useState([]);
  const [tenorSearch, setTenorSearch] = useState('');

  const onEmojiClick = (event, emojiObject) => {
    const cursor = ref.current.selectionStart;
    const start = commentContent.substring(0, cursor);
    const end = commentContent.substring(cursor);
    const text = start + emojiObject.emoji + end;

    setChosenEmoji(emojiObject);
    setCommentContent(text);
    ref.current.focus();
  };

  const handleTenorSearch = async (query) => {
    setTenorSearch(query);
    if (query.length > 1) {
      try {
        const res = await axios.get('https://tenor.googleapis.com/v2/search', {
          params: {
            q: query,
            key: process.env.REACT_APP_TENOR_API_KEY,
            limit: 12
          }
        });
        setTenorResults(res.data.results || []);
      } catch (e) {
        setTenorResults([]);
      }
    } else {
      setTenorResults([]);
    }
  };

  const handleGifSelect = (gif) => {
    setChosenGif(gif);
    setShowGifs(false);
    setCommentContent(commentContent + ' ' + gif.media_formats.tinygif.url);
  };

  const handleCommentContent = (event) => {
    setCommentContent(event.target.value);
  };

  const handlePostingComment = (postid) => {
    if (commentContent === "") return null;
    const comment = { content: commentContent };
    PostService.addComment(user.id, postid, comment).then(res => {
      setRefresh(res.data);
      setCommentContent("");
    });
  };

  return (
    post && (
      <li className="post-comment">
        <div className="comet-avatar">
          <img src={fileStorage.baseUrl + user.profilePicturePath} alt="" />
        </div>
        <div className="post-comt-box">
          <Form>
            <textarea
              rows={2}
              placeholder="Write a comment.."
              name="comment"
              value={commentContent}
              ref={ref}
              onKeyPress={(e) => e.key === 'Enter' && handlePostingComment(post.id)}
              onChange={handleCommentContent}
            />

            {/* Emoji Picker */}
            <div className="add-smiles">
              <span title="add icon" onClick={() => setShowEmojis(!showEmojis)}>
                <i className="lar la-laugh"></i>
              </span>
            </div>
            {showEmojis && (
              <div className="smiles-bunch active">
                <div>
                  {chosenEmoji ? (
                    <span>You chose: {chosenEmoji.emoji}</span>
                  ) : (
                    <span>No emoji chosen</span>
                  )}
                  <Picker
                    onEmojiClick={onEmojiClick}
                    disableSearchBar={true}
                    pickerStyle={{ height: "310px" }}
                  />
                </div>
              </div>
            )}

            {/* Stickers */}
            <div className="stickers" style={{ zIndex: '999' }}>
              <img
                src="/assets/images/sticker-svgrepo-com.svg"
                style={{ height: '19px' }}
                alt=""
                onClick={() => setShowSticker(!showSticker)}
              />
            </div>
            {showSticker && (
              <div className="stickers-bunch active">
                <div style={{ height: '326px', overflowX: 'hidden', overflowY: 'scroll' }}>
                  {chosenSticker ? (
                    <span>You chose: {chosenSticker.sticker}</span>
                  ) : (
                    <span>No sticker chosen</span>
                  )}
                  <Stickers />
                </div>
              </div>
            )}

            {/* GIFs */}
            <div className="gifs">
              <img
                src="/assets/images/gif.svg"
                alt=""
                onClick={() => setShowGifs(!showGifs)}
              />
            </div>
            {showGifs && (
              <div className="giphy-picker-modal">
                <input
                  type="text"
                  value={tenorSearch}
                  onChange={e => handleTenorSearch(e.target.value)}
                  placeholder="Search GIFs"
                />
                <div className="giphy-grid">
                  {tenorResults.map(gif => (
                    <img
                      key={gif.id}
                      src={gif.media_formats.tinygif.url}
                      alt={gif.content_description}
                      onClick={() => handleGifSelect(gif)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="btncmnt">
              <button
                type="button"
                onClick={() => handlePostingComment(post.id)}
                style={{ color: 'blue', padding: '1px' }}
              >
                <img
                  src="/assets/images/ei_camera.svg"
                  alt=""
                  style={{
                    padding: "3px",
                    marginTop: "6px",
                    borderStyle: "2px solid black",
                    paddingRight: "0px"
                  }}
                />
              </button>
            </div>
          </Form>
        </div>
      </li>
    )
  );
}