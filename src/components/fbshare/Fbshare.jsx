import React, { useState } from "react";
import "./Fbshare.css";
import {
  PermMedia,
  LocalOffer,
  LocationOn,
  EmojiEmotions,
} from "@mui/icons-material";
import Button from "@mui/material/Button";
import { createSelector } from "reselect";
import { makeSelector } from "../../reducers/selectors";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../auth/getposts";
import { storage } from "../firebase/Storage";
import LinearProgress from "@mui/material/LinearProgress";

const PF = process.env.REACT_APP_PUBLIC_URL;
const stateSelector = createSelector(makeSelector, (user) => ({
  user,
}));
const PFPERSON = process.env.REACT_APP_PUBLIC_URL_PERSON;

export default function Fbshare({ username, setprofileposts }) {
  const { user } = useSelector(stateSelector);
  const posts = useSelector((state) => state.userPosts);
  const dispatch = useDispatch();
  const [sharetext, setsharetext] = useState("");
  const [file, setsharepic] = useState(null);
  const [Progress, setprogress] = useState(0);
  const [upload, setupload] = useState(false);

  const shareclick = async (e) => {
    e.preventDefault();
    const newpost = {
      userId: user._id,
      desc: sharetext,
    };
    if (file || sharetext) {
      if (file) {
        const filename = Date.now() + file.name;
        setupload(true);
        try {
          const uploadTask = storage.ref(`images/posts/${filename}`).put(file);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setprogress(progress);
            },
            (error) => {
              console.log(error);
            },
            () => {
              storage
                .ref("images/posts")
                .child(filename)
                .getDownloadURL()
                .then(async (url) => {
                  console.log(url);
                  setsharepic(null);
                  setupload(false);
                  setprogress(0);
                  newpost.img = url;
                  try {
                    const res = await fetch(
                      `${process.env.REACT_APP_HOST}/posts/create`,
                      {
                        method: "POST",
                        headers: {
                          "content-type": "application/json",
                        },
                        body: JSON.stringify(newpost),
                      }
                    );
                    const data = await res.json();
                    if (res.status === 200) {
                      setsharetext("");
                      getPosts(dispatch, user, username, setprofileposts);
                    }
                  } catch (e) {
                    console.log(e);
                  }
                });
            }
          );
        } catch (e) {
          console.log(e);
        }
      } else {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_HOST}/posts/create`,
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(newpost),
            }
          );
          const data = await res.json();
          if (res.status === 200) {
            setsharetext("");
            getPosts(dispatch, user, username, setprofileposts);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  };
  return (
    <div className='share'>
      <form className='sharewrapper'>
        <div className='sharetop'>
          <img
            className='shareimg'
            src={user.profilepic ? `${user.profilepic}` : `${PFPERSON}`}
            alt=''
          />
          <textarea
            placeholder="What's in your mind?"
            rows='1'
            name='sharetext'
            required
            value={sharetext}
            onChange={(e) => setsharetext(e.target.value)}
          />
        </div>
        {file ? (
          <div className='postimgdiv p-2'>
            <img src={URL.createObjectURL(file)} className='postimage' alt='' />
            <CancelIcon onClick={() => setsharepic(null)} />
          </div>
        ) : null}
        <hr />
        {!upload?<div className='sharebottom'>
          <div className='postoptions'>
            <label className='options' htmlFor='file'>
              <PermMedia htmlColor='tomato' className='shareicons' />
              <span className='optiontext'>Photo/video</span>
              <input
                type='file'
                id='file'
                style={{ display: "none" }}
                accept='.png,.jpg,.jpeg'
                onChange={(e) => setsharepic(e.target.files[0])}
              />
            </label>
            <div className='options'>
              <LocalOffer htmlColor='blue' className='shareicons' />
              <span className='optiontext'>Tag</span>
            </div>
            <div className='options'>
              <LocationOn htmlColor='green' className='shareicons' />
              <span className='optiontext'>Location</span>
            </div>
            <div className='options'>
              <EmojiEmotions htmlColor='goldenrod' className='shareicons' />
              <span className='optiontext'>Feelings</span>
            </div>
          </div>
          <button
            type='submit'
            className='sharebtn btn btn-success'
            onClick={shareclick}>
            Post
          </button>
        </div>:null}
        {upload?<div className='progress1'>
          <span className='upload'>Uploading {Progress}%</span>
          <LinearProgress variant='determinate' value={Progress} />
        </div>:null}
      </form>
    </div>
  );
}
