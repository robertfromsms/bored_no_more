const beforeFetched = {
	profileData: null,
	activitiesData: null,
	activityDetailData: null
}

export default (state = beforeFetched, action) => {
	switch (action.type) {
		case 'FETCH_PROFILE_DATA': {
			return {...state, profileData: action.profileData}
		}
		case 'UPDATE_ACTIVITY_INSTANCES': {
			const newActivityInstances = action.newActivityInstances
			let newState = {
				...state, 
				profileData: {
					...state.profileData,
					user: {
						...state.profileData.user,
						activity_instances_with_activity: newActivityInstances
					}
				}
			}
			return newState
		}
		case 'FETCH_ACTIVITIES_DATA': {
			return {...state, activitiesData: action.activitiesData}
		}
		case 'FETCH_ACTIVITY_DETAIL_DATA': {
			return {...state, activityDetailData: action.activityDetailData}
		}
		case 'UPDATE_COMMENTS_WITH_USERS': {
			const new_comments_with_users = action.new_comments_with_users
			let newState = {
				...state,
				activityDetailData: {
					activity: {
						...state.activityDetailData.activity,
						comments_with_users: new_comments_with_users
					}
				}
			}
			return newState
		}
		default: {
			return state
		}
	}
}