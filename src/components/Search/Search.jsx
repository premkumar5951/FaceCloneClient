import React from "react";
import { useSelector } from "react-redux";
import "./search.css";
import { NavLink } from "react-router-dom";

const PFPERSON = process.env.REACT_APP_PUBLIC_URL_PERSON;

const Search = ({ data, search, focus ,change}) => {
  const Authenticate = useSelector((state) => state.userAuth);

  return (
    <>
     {focus?change? <div className='searchWrapper'>
        <div className='innerWrapper'>
          {search ? <span className='search1'>searching... </span> : null}
          {data.length ? (
            data.length > 5 ? (
              data.slice(0, 5).map((ele) => {
                return (
                  <NavLink to={`/timeline/${ele.email}`} className='link'>
                    {!search ? (
                      <div className='searchItem'>
                        <div className='logbox'>
                          {Authenticate ? (
                            <>
                              <NavLink to={`/timeline/${ele.email}`}>
                                <div className='image'>
                                  <img
                                    src={
                                      ele.profilepic
                                        ? `${ele.profilepic}`
                                        : `${PFPERSON}`
                                    }
                                    alt=''
                                  />
                                </div>
                              </NavLink>
                            </>
                          ) : null}
                        </div>
                        <div className='names'>
                          <span className='username1'>{ele.username}</span>
                          <span className='email1'>{ele.email}</span>
                        </div>
                      </div>
                    ) : null}
                  </NavLink>
                );
              })
            ) : (
              data.map((ele) => {
                return (
                  <NavLink to={`/timeline/${ele.email}`} className='link'>
                    {!search ? (
                      <div className='searchItem'>
                        <div className='logbox'>
                          {Authenticate ? (
                            <>
                              <NavLink to={`/timeline/${ele.email}`}>
                                <div className='image'>
                                  <img
                                    src={
                                      ele.profilepic
                                        ? `${ele.profilepic}`
                                        : `${PFPERSON}`
                                    }
                                    alt=''
                                  />
                                </div>
                              </NavLink>
                            </>
                          ) : null}
                        </div>
                        <div className='names'>
                          <span className='username1'>{ele.username}</span>
                          <span className='email1'>{ele.email}</span>
                        </div>
                      </div>
                    ) : null}
                  </NavLink>
                );
              })
            )
          ) : (
            <>
              {!search ? <span className='search1'>No User Found </span> : null}
            </>
          )}
        </div>
        {!search ? (
          data.length > 5 ? (
            <div className='showmore'>
              <span className='show'>Show More</span>
            </div>
          ) : null
        ) : null}
      </div>:null:null}
    </>
  );
};

export default Search;
