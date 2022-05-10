import { fetchStarted, fetchSuccessful } from "../reducers/actions"

export const getuser=async(dispatch,setprofileUser,username)=>{
    try{
        dispatch(fetchStarted()) 
          const res=await fetch(`${process.env.REACT_APP_HOST}/users?username=${username}`,{
            method:'GET',
            headers:{
              Accept:"application/json",
              "Content-type":"application/json"
            },
          })
          const data=await res.json()
          if(res.status===200){
            dispatch(fetchSuccessful())
            setprofileUser(data)
          }    
        }catch(e){
        console.log(e)
      }
    }