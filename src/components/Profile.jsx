import React, { useEffect, useState } from 'react';
import './Profile.css';
import ProgressBar from './ProgressBar';
import { apibaseurl, callApi, imgurl } from '../lib';

const Profile = ({logout}) => {
    const [data, setData] = useState(null);
    const [token, setToken] = useState("");
    const [isProgress, setIsProgress] = useState("");

    useEffect(()=>{
        const storedtoken = localStorage.getItem("token");
        if(storedtoken == undefined || storedtoken == "")
            return logout();
            
        setToken(storedtoken);
        setIsProgress(true);
        callApi("GET", apibaseurl + "/user/profile", null, null, loadData, storedtoken);
    },[]);

    function loadData(res){
        setData(res);
        setIsProgress(false);
    }

    function getRoleName(roleValue) {
        const roles = {
            1: "Users",
            2: "Task Manager",
            3: "Admin"
        };

        return roles[roleValue] || roleValue || "";
    }

    function getProfileData() {
        const userData = data?.user;

        if (Array.isArray(userData)) {
            return {
                user: userData[0] || {},
                roleName: userData[1]?.rolename || userData[0]?.rolename || getRoleName(userData[0]?.role)
            };
        }

        const user = userData || data || {};
        return {
            user,
            roleName: user.rolename || user.roleName || user.role?.rolename || getRoleName(user.role)
        };
    }
    
    if(!data) return ("");

    const { user, roleName } = getProfileData();

    return (
        <div className='profile'>
            <div className='container'>
                <div className='info'>
                    <img src={imgurl + "user.png"} alt='' />
                    <div className='info-data'>
                        <label>{user.fullname}</label>
                        <span>{roleName}</span>
                    </div>
                </div>
                <div className='details'>
                    <div className='grid'>
                        <span>Name</span>
                        <span>{user.fullname}</span>
                    </div>
                    <div className='grid'>
                        <span>Phone Number</span>
                        <span>{user.phone}</span>
                    </div>
                    <div className='grid'>
                        <span>Email</span>
                        <span>{user.email}</span>
                    </div>
                    <div className='grid'>
                        <span>Role</span>
                        <span>{roleName}</span>
                    </div>
                </div>
            </div>

            <ProgressBar isProgress={isProgress}/>
        </div>
    );
}

export default Profile;
