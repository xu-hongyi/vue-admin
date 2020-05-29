import instance from '../request'

export const getUserList = async (info) =>{
	return await instance.get('users', {
		params:info
	})
}

export const updateSwitchUser = async (id, state) =>{
	return await instance.put(`users/${id}/state/${state}`)
}

export const addUser = async (form) =>{
	return await instance.post(`users`, form)
}

export const getUser = async (id) =>{
	return await instance.get(`users/${id}`)
}

export const updateUser = async (id, form) =>{
	return await instance.put(`users/${id}`, form)
}

export const deleteUser = async (id) => {
	return await instance.delete(`users/${id}`)
}

export const setRole = async (id, rid) =>{
	return await instance.put(`users/${id}/role`, rid)
}