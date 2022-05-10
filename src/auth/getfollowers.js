// import { fetchStarted, fetchSuccessful } from "../reducers/actions"

export const getfollowers=async(setfollowers,username,user)=>{
    try{
          const res=username?await fetch(`${process.env.REACT_APP_HOST}/users/followers?username=${username}`,{
            method:'GET',
            headers:{
              Accept:"application/json",
              "Content-type":"application/json"
            },
          }):await fetch(`${process.env.REACT_APP_HOST}/users/followers?userId=${user._id}`,{
            method:'GET',
            headers:{
              Accept:"application/json",
              "Content-type":"application/json"
            },
          })
          const data=await res.json()
          if(res.status===200){
            setfollowers(data)
          }    
        }catch(e){
        console.log(e)
      }
    }

    export const getfollowings=async(setfollowings,username,user)=>{
    try{
          const res=username?await fetch(`${process.env.REACT_APP_HOST}/users/followings?username=${username}`,{
            method:'GET',
            headers:{
              Accept:"application/json",
              "Content-type":"application/json"
            },
          }):await fetch(`${process.env.REACT_APP_HOST}/users/followings?userId=${user._id}`,{
            method:'GET',
            headers:{
              Accept:"application/json",
              "Content-type":"application/json"
            },
          })
          const data=await res.json()
          if(res.status===200){
            setfollowings(data)

          }    
        }catch(e){
        console.log(e)
      }
    }