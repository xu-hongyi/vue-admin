import axios from 'axios'
import {Message} from "element-ui"
const instance = axios.create({
	baseURL:"http://127.0.0.1:8888/api/private/v1/",
	timeout:6000
})

instance.interceptors.request.use(config =>{
	if(config.url === 'login'){
		return config;
	}
	config.headers["Authorization"] = window.sessionStorage.getItem("token")
	return config;
}, err =>{
	return Promise.reject(err)
})

instance.interceptors.response.use(response =>{
	if(response.config.method !== 'get' && response.data.meta.status === 200 || response.data.meta.status === 201){
		Message.success(response.data.meta.msg)
	}else if(String(response.data.meta.status).startsWith('4') || String(response.data.meta.status).startsWith('5')){
		Message.error(response.data.meta.msg)
	}
	return response.data.data;
}, err =>{
	return Promise.reject(err)
})

export default instance;