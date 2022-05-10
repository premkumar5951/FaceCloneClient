import { Search } from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import React, { useEffect, useState } from "react";
import MessageIcon from "@mui/icons-material/Message";
import { NavLink } from "react-router-dom";
import "./Topbar.css";
import { useSelector } from "react-redux";
import Drop from "../dropdown/Drop";
import { createSelector } from "reselect";
import { makeSelector } from "../../reducers/selectors";
import SearchBox from "../Search/Search";
import { SearchUser } from "../../auth/Search";
const stateSelector = createSelector(makeSelector, (user) => ({
  user,
}));
const PFPERSON = process.env.REACT_APP_PUBLIC_URL_PERSON;

export default function Topbar() {
  const Authenticate = useSelector((state) => state.userAuth);
  const { user } = useSelector(stateSelector);
  const [searchText, setsearchText] = useState("");
  const [searchData, setsearchData] = useState([]);
  const [searching, setsearching] = useState(false);
  const [focus, setfocus] = useState(false);
  const [change, setchange] = useState(false);


  const SearchHandler = () => {
    SearchUser({ text: searchText }, setsearchData, setsearching);
  };
useEffect(()=>{
  SearchHandler();
},[searchText])
  console.log(searchData);
  return (
    <>
      <div className='topbar '>
        <div className='lefttop'>
          <h3 className='logo'>
            <strong>
              <NavLink to='/'>FaceClone</NavLink>
            </strong>
          </h3>
        </div>
        <div className='centertop'>
          <Search className='searchicon' />
          <input
            type='text'
            className='search'
            placeholder='Search email or username'
            value={searchText}
            onFocus={() => {
              setfocus(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setfocus(false);
                setchange(false)
              }, 200);
            }}
            onChange={(e) => {
              setsearchText(e.target.value);
              setchange(true)
            }}
          />
          <SearchBox data={searchData} search={searching} focus={focus} change={change}/>
        </div>
        <div className='righttop'>
          <div className='texts'>
            {Authenticate ? (
              <>
                <p>
                  <NavLink to='/'>Home</NavLink>
                </p>
                <p>
                  {" "}
                  <NavLink to={`/timeline/${user.email}`}>Timeline</NavLink>
                </p>
              </>
            ) : (
              <>
                <p>
                  <NavLink to='/login'>Login</NavLink>
                </p>
                <p>
                  <NavLink to='/register'>Signup</NavLink>
                </p>
              </>
            )}
          </div>
          <div className='icons'>
            <div className='icondiv'>
              <NotificationsIcon className='icon' />
              <span className='count'>1</span>
            </div>
            <div className='icondiv'>
              <MessageIcon className='icon' />
              <span className='count'>2</span>
            </div>
            <div className='icondiv'>
              <PersonIcon className='icon' />
              <span className='count'>3</span>
            </div>
          </div>
          <div className='logbox'>
            {Authenticate ? (
              <>
                <NavLink to={`/timeline/${user.email}`}>
                  <div className='image'>
                    <img
                      src={
                        user.profilepic
                          ? `${user.profilepic}`
                          : `${PFPERSON}`
                      }
                      alt=''
                    />
                  </div>
                </NavLink>
                <Drop />
              </>
            ) : null}
          </div>
        </div>
      </div>
      ;
    </>
  );
}
