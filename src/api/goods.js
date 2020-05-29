import instance from './request'

export const getCategories = async (data) => {
	return await instance.get('categories', {
		params: data
	})
}

export const addCategories = async (data) => {
	return await instance.post('categories', data)
}

export const deleteCategories = async (id, data) => {
	return await instance.delete('categories/' + id, data)
}

export const updateCategories = async (id, data) => {
	return await instance.put(`categories/${id}`, data)
}

export const getCateById = async id => {
	return await instance.get(`categories/${id}`)
}