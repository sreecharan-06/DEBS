export const apibaseurl = "http://localhost:8001";
export const imgurl = import.meta.env.BASE_URL;
export const isDemoMode = window.location.hostname.endsWith("github.io");

const demoUsers = [
    { id: 5, fullname: "Sree Charan", phone: "6301282405", email: "sreecharan5@gmail.com", password: "Sree@2005", role: 3, status: 1 },
    { id: 7, fullname: "Sree Charan", phone: "6301282407", email: "sreecharan7@gmail.com", password: "Sree@2007", role: 3, status: 1 },
    { id: 6, fullname: "sree charan", phone: "6301282406", email: "charan6@kluniversity.in", password: "Charan@2006", role: 1, status: 3 },
    { id: 2, fullname: "Charan", phone: "6301282402", email: "charan2@gmail.com", password: "Charan@2002", role: 1, status: 1 },
    { id: 4, fullname: "Charan", phone: "6301282404", email: "charan4@gmail.com", password: "Charan@2004", role: 2, status: 1 },
    { id: 3, fullname: "Charan", phone: "6301282403", email: "sreecharan3@gmail.com", password: "Sree@2003", role: 3, status: 1 },
    { id: 1, fullname: "sree charan", phone: "6301282401", email: "sreecharan1@gmail.com", password: "Sree@2001", role: 3, status: 1 }
];

const demoRoles = [
    { role: 1, rolename: "User" },
    { role: 2, rolename: "Task Manager" },
    { role: 3, rolename: "Admin" }
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
                fullname: "Sree Charan",
                phone: "6301282405",
                email: "sreecharan5@gmail.com",
                role: 3
            }
        };
    }

    if (apiUrl.includes("/user/getallusers")) {
        return {
            code: 200,
            page: 2,
            size: 7,
            totalpages: 1,
            users: demoUsers,
            roles: demoRoles
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
    const cleanPath = path.replace(/^\//, "");
    return `${base}#/${cleanPath}`;
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
