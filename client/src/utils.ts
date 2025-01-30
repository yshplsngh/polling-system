const API_URL = "http://localhost:4000/api/v1"


const fetchData = async (url: string, method: string, body?: any) => {

    const config:RequestInit = {
        method: method,
        headers: {
            "content-type": "application/json",
            Accept: "application/json",
        },
        credentials: "include",
    }
    if(method !=='GET'){
        config.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_URL}${url}`, config);
    const data = await response.json();
    return data;
}

export { fetchData };