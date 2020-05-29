import instance from './request'

export const getMenuList = async () =>{
	return await instance.get('menus')
}