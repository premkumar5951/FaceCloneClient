import React, { useEffect, useState } from "react";
import Centerbar from "../../components/centerbar/Centerbar";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import "./profile.css";
import Bottombar from "../../components/bottombar/Bottombar";
import { createSelector } from "reselect";
import { makeSelector } from "../../reducers/selectors";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  SetAuth,
} from "../../reducers/actions";
import { useNavigate, useParams } from "react-router";
import Loading from "../../components/loading/Loading";
import { getuser } from "../../auth/getuser";
import AddIcon from '@mui/icons-material/Add';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import CustomizedDialogs from "../../components/modals/ImgModals";
import auth from "../../auth/auth";

const stateSelector = createSelector(makeSelector, (user) => ({
  user,
}));
const actionDispatch = (dispatch) => ({
  setUser: (user) => dispatch(setUser(user)),
});
const PFPERSON=process.env.REACT_APP_PUBLIC_URL_PERSON
export default function Profile() {
  const { username } = useParams();
  const { isfetching } = useSelector((state) => state.fetched);
  const history = useNavigate();
  const { user } = useSelector(stateSelector);
  const { setUser } = actionDispatch(useDispatch());
  const [profileUser, setprofileUser] = useState("");
  const [sameuser, setsameuser] = useState(true);
  const Authenticate = useSelector((state) => state.userAuth);
  const dispatch = useDispatch();
  const[isfollow,setisfollow]=useState(false)
  useEffect(() => {
    if (Authenticate != true) {
      auth(dispatch, SetAuth, setUser, history);
    }
  }, []);
  useEffect(() => {
    getuser(dispatch, setprofileUser, username);
  }, [username]);
  useEffect(()=>{
    if(user._id!==profileUser._id){
      setsameuser(false)
    }else{
      setsameuser(true)
    }
  })
  useEffect(()=>{
    if(profileUser){
      setisfollow(profileUser.followers.includes(user._id))
    }
  },[profileUser])

  const followfun=async(e)=>{
    try{
    if(e.detail===1){

      const res=!isfollow?await fetch(`${process.env.REACT_APP_HOST}/users/${profileUser._id}/follow`,{
        method:'PUT',
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({userId:user._id})
      }):await fetch(`${process.env.REACT_APP_HOST}/users/${profileUser._id}/unfollow`,{
        method:'PUT',
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({userId:user._id})
      })
      const data=await res.json()
     if(res.status===200)
     {
      if(isfollow){
setisfollow(false)
      }else{
setisfollow(true)
      }
     }else{
       console.log(data)
     }}
    }catch(e){
      console.log(e)
    }
  }
  // if(isfollow){
  //   setisfollow(false)
  // }else{
  //   setisfollow(true)
  // }
  return (
    <>
      {isfetching ? (
        <Loading/>
      ) : (
        <>
          {profileUser ? (
            <>
              <Topbar />
              <div className='profile'>
                <Sidebar />
                <div className='profileright'>
                  <div className='profiletop'>
                    <div className='coverdiv'>
                      <img
                        src='/assets/posts/po6.jpg'
                        alt=''
                        className='coverimg'
                      />
                    </div>
                    <img
                      src={profileUser.profilepic?`${profileUser.profilepic}`:`${PFPERSON}`}
                      alt=''
                      className='proimg'
                    />
                    <div className='prohead'>
                    <div className="inner">
                    <span className='proname'>
                        <b>{profileUser.username}</b>
                      </span>
                      <span className='intro'>
                        {" "}
                        <b>{profileUser.desc}</b>
                      </span>
                    </div>
                  <CustomizedDialogs className="propic" sameuser={sameuser}/>
               

                      {!sameuser?<div className="folllowdiv">
                      <button className=" followbtn btn btn-primary" onClick={followfun}>{isfollow?
                      <span className="innertxt">Following <DoneAllIcon/></span>:<span className="innertxt">Follow <AddIcon/></span>}</button>
                    </div>:null}
                      <div className='invisible'></div>
                    </div>
                    
                    
                  </div>
                  <div className='profilebottom'>
                    <Centerbar username={username} sameuser={sameuser} profileUser={profileUser}/>
                    <Rightbar Profile username={username} follow={isfollow} />
                  </div>
                </div>
              </div>
              <Bottombar />
            </>
          ) : (
            <>
              <Topbar />
              <h1>Error page</h1>
            </>
          )}
        </>
      )}
    </>
  );
}
