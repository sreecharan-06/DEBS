export const apibaseurl = "http://localhost:8001";
export const imgurl = import.meta.env.BASE_URL;
export const isDemoMode = window.location.hostname.endsWith("github.io");

const demoUsers = [
    { id: 6, fullname: "anu", phone: "2521432246", email: "anu12@gmail.com" },
    { id: 7, fullname: "deepthi", phone: "8125212246", email: "deepthi1@gmail.com" },
    { id: 8, fullname: "deepthi", phone: "8125212246", email: "deepthi07@gmail.com" },
    { id: 9, fullname: "ravi", phone: "2428252623", email: "ravi07@gmail.com" },
    { id: 10, fullname: "hananya", phone: "2121212121", email: "hananya07@gmail.com" }
];

function demoResponse(apiUrl, jsonData) {
    if (apiUrl.includes("/user/signin")) {
        return { code: 200, message: "Login successful", jwt: "demo-token" };
    }

    if (apiUrl.includes("/user/signup")) {
        return { code: 200, message: "Account created in demo mode" };
    }

    if (apiUrl.includes("/user/uinfo")) {
        return {
            code: 200,
            fullname: "Admin User",
            menulist: [
                { mid: 1, menu: "Dashboard", icon: "dashboard.png" },
                { mid: 2, menu: "My Task", icon: "mytask.png" },
                { mid: 3, menu: "Task Manager", icon: "taskmanager.png" },
                { mid: 4, menu: "User Manager", icon: "usermanager.png" },
                { mid: 5, menu: "My Profile", icon: "myprofile.png" }
            ]
        };
    }

    if (apiUrl.includes("/user/profile")) {
        return {
            code: 200,
            user: {
                fullname: "Admin User",
                phone: "9876543210",
                email: "admin@gmail.com",
                role: 3
            }
        };
    }

    if (apiUrl.includes("/user/getallusers")) {
        return {
            code: 200,
            page: 2,
            size: 5,
            totalpages: 3,
            users: demoUsers,
            roles: [
                { role: 1, rolename: "Users" },
                { role: 2, rolename: "Task Manager" },
                { role: 3, rolename: "Admin" }
            ]
        };
    }

    if (apiUrl.includes("/user/getuser/")) {
        const id = Number(apiUrl.split("/").pop());
        return { code: 200, user: demoUsers.find((user) => user.id === id) || demoUsers[0] };
    }

    if (apiUrl.includes("/user/saveuser") || apiUrl.includes("/user/updateuser") || apiUrl.includes("/user/deleteuser")) {
        return { code: 200, message: jsonData?.id ? "User updated in demo mode" : "Done in demo mode" };
    }

    return { code: 404, message: "Demo endpoint not found" };
}

export function appPath(path = "") {
    const base = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
    return `${base}${path.replace(/^\//, "")}`;
}

export function callApi(reqMethod, apiUrl, jsonData, formData, responseHandler, jwtToken = "")
{
    if (isDemoMode) {
        setTimeout(() => responseHandler(demoResponse(apiUrl, jsonData)), 250);
        return;
    }

    const headers = {};
    if (jsonData) headers["Content-Type"] = "application/json";
    if (jwtToken) headers["Token"] = jwtToken;

    const options = {
        method: reqMethod, 
        headers: headers, 
        body: jsonData ? JSON.stringify(jsonData) : formData ? formData : undefined
    };

    fetch(apiUrl, options)
        .then(async (res) => {
            const text = await res.text();
            const data = text ? JSON.parse(text) : {};

            if (!res.ok) {
                throw new Error(data.message || `Request failed with status ${res.status}`);
            }

            return data;
        })
        .then((data) => responseHandler(data))
        .catch((err) => alert(err.message));
}
