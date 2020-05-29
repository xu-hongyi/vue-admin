import instance from './request'

export const login = async (data) =>{
	return await instance.post('login', data)
}