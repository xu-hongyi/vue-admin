import instance from './request'

export const getRoleList = async () =>{
	return await instance.get('roles')
}

export const getRightsList = async (type) =>{
	return await instance.get(`rights/${type}`)
}	

export const addRoles = async (roles) =>{
	return await instance.post('roles', roles)
}

export const getRoleById = async id =>{
	return await instance.get('roles/' + id)
}

export const updateRole = async (id, data) =>{
	return await instance.put('roles/' + id, data)
}

export const deleteRole = async (id) =>{
	return await instance.delete('roles/' + id,)
}

export const deleteRights = async (roleId, rightsId) => {
	return await instance.delete(`roles/${roleId}/rights/${rightsId}`)
}

export const addRights = async (id, data) =>{
	return await instance.post(`roles/${id}/rights`, data)
}