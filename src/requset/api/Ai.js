import axios from "@/requset/http";
import myJson from '@/../public/static/config.json'
import querystring from 'querystring';

const AiApi = {
    get_access_token() {
        return axios.post("/ai/get_access_token");
    },
    chat(params){
        return axios.get("/ai/chat", {params: params})
    },
    art(params){
        return axios.post("/ai/art", params)
    }
    // get_access_token(){
    //     const client_id = "RNLjFTsINgFUlLhiQotE1X03"  // 替换为您的API Key
    //     const client_secret = "t12jZNww9mE6OQMZQFOC0ZItw5gwpZX4"  // 替换为您的Secret Key
    //     const params = {
    //         'grant_type': 'client_credentials',
    //         'client_id': client_id,
    //         'client_secret': client_secret
    //     }
    //     return axios({
    //         url:"/artapi/oauth/2.0/token",
    //         method: "post",
    //         data: params,
    //         headers:{
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //             'Accept': 'application/json'
    //         },
    //         timeout: 100000,
    //     })
    // },

    // chat(params){
    //     const {system_content} = myJson;
    //     const api_key = 'xai-6mIqkZJWw3A5WawUuTz5tQ1dcx08IoGQfT09MDJNnJ17bjxX2vbZF0HZtWQ428z1FbzOGNLLzcczTQF5'
    //     const request_body = {
    //         "messages": [
    //             {
    //                 "role": "system",
    //                 "content": system_content
    //             },
    //             {
    //                 "role": "user",
    //                 "content": params
    //             }
    //         ],
    //         "model": "grok-beta"
    //     }
    //     return axios({
    //         url: "/chatapi/v1/chat/completions",
    //         method: "post",
    //         data: JSON.stringify(request_body),
    //         headers:{
    //             'Authorization': 'Bearer ' + api_key,
    //             'Content-Type': 'application/json'
    //         },
    //         withCredentials: false,
    //         timeout: 100000,
    //     })
    // },
    // art(params){
    //     const access_token = params.access_token
    //     //console.log(access_token)
    //     const url = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/text2image/sd_xl?access_token=" + access_token;
    //     const request_body = {
    //         "prompt": params.prompt,
    //         "negative_prompt": "white",
    //         "size": "1024x1024",
    //         "steps": 20,
    //         "n": 1,
    //         "sampler_index": "DPM++ SDE Karras"
    //     }

    //     return axios({
    //         url: url,
    //         method: "post",
    //         data: JSON.stringify(request_body),
    //         headers:{
    //             'Content-Type': 'application/json'
    //         },
    //         withCredentials: false,
    //         timeout: 100000,
    //     })
    // }
}

export default AiApi
