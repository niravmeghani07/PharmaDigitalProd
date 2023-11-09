import { instance as axios } from '../../root-service.js';

const GET_PRODUCT_DETAILS_DATA = 'itemsV2';
const GET_PRODUCT_ITEM_STRUCTURE = 'itemStructures';
// const POST_API_NAME = 'alerts/riskAlertsDetailsFilters';


export const getProductDetails = async (productQuery) => {
	const { data } = await axios.get(GET_PRODUCT_DETAILS_DATA, {
		params: {
			q: productQuery,
		},
	});
	return data;
};

export const getProductItemStructure = async (productQuery) => {
	const { data } = await axios.get(GET_PRODUCT_ITEM_STRUCTURE, {
		params: productQuery,
	});
	return data;
};

// export const postAPI = async (postBody) => {
// 	const { data } = await axios.post(POST_API_NAME, JSON.stringify(postBody));
// 	return data;
// };





