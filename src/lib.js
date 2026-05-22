export const apibaseurl = "http://localhost:8001";
export const imgurl = import.meta.env.BASE_URL;
export function callApi(reqMethod, apiUrl, jsonData, formData, responseHandler, jwtToken = "")
{
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
