const ProfileService = {

    getTopActivitiesList(db){
        return db
                .select('name', 'accepted_count')
                .from('activity')
                .orderBy([{column: 'accepted_count', order: 'desc'}, {column: 'name'}])
    },

    getUserTopActivitiesList(db, userId){
        return db   
                .select('accepted_count')
                .from('accepted_rejected')
                .where({user_id: userId})
                .orderBy('accepted_count', 'desc')
    },
    insertAcceptedRejectedRow(db, newRow) {
        return db
                .insert(newRow)
                .into('accepted_rejected')
                .returning('*')
                .then(([row]) => row)
    },

    updateAcceptedCount(db, activityId, userId, acceptedCount){
        return db('accepted_rejected')
                .where({activity: activityId, user_id: userId})
                .first()
                .update({accepted_count: acceptedCount})
    },
 
}

module.exports = ProfileService;