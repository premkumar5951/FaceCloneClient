
export const SearchUser=async(data,setsearchData,setsearching)=>{
    setsearching(true)
    try{
        const res=await fetch(`${process.env.REACT_APP_HOST}/users/search`,{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            credentials:"include",
            body:JSON.stringify(data)
        })
        const data1=await res.json();
        if(res.status===200){
            setsearchData(data1)
        }
        setsearching(false)
    }catch(e){
        setsearching(false)
        console.log(e)
    }
}