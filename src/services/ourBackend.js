const url = "http://localhost:3000/"
const onlineUrl = "https://shielded-lowlands-50599.herokuapp.com/"

function genericGetFetch(urlAddition) {
	return (fetch(onlineUrl + urlAddition)
	    .then(response => response.json()))
}

function genericNonGetFetch(urlAddition, configObj) {
	return (fetch(onlineUrl + urlAddition, configObj)
	    .then(response => response.json()))
}

export default {genericGetFetch: genericGetFetch, 
				genericNonGetFetch: genericNonGetFetch}