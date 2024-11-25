import axios from "axios";

const AiApi = {
    chat(params){
        console.log(params)
        const api_key = 'xai-6mIqkZJWw3A5WawUuTz5tQ1dcx08IoGQfT09MDJNnJ17bjxX2vbZF0HZtWQ428z1FbzOGNLLzcczTQF5'
        const request_body = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are a test assistant."
                },
                {
                    "role": "user",
                    "content": params
                }
            ],
            "model": "grok-beta"
        }
        return axios({
            url: "https://api.x.ai/v1/chat/completions",
            method: "post",
            data: JSON.stringify(request_body),
            headers:{
                'Authorization': 'Bearer ' + api_key,
                'Content-Type': 'application/json'
            },
            withCredentials: false
        })
    }
}

export default AiApi
