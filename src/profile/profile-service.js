const ProfileService = {
    
    insertAcceptedRejectedRow(db, newRow) {
        return db
                .insert(newRow)
                .into('accepted_rejected')
                .returning('*')
                .then(([row]) => row)
    },

    getSingleGlobalAcitiviyAcceptance(db, id) {
        return db
                .from('accepted_rejected')
                .count('*')
                .where({
                    'activity': id,
                    'accepted': true })
                .first()         
    },

    getSingleUserActivityAcceptance(db, userId, activityId) {
        return db
                .from('accepted_rejected')
                .count('*')
                .where({
                    'activity_id': activityId,
                    'user_id': userId,
                    'accepted': true
                })
    },

    getAllTheCounts(db) {
        return db
                .select('id', 'name')
                .from('activity')
                .leftJoin('accepted_rejected', 'activity.id', 'accepted_rejected.id')
    }
 
}

module.exports = ProfileService;