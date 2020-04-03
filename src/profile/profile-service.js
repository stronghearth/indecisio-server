const ProfileService = {

  getTopActivitiesList(db){
    return db
      .select('name', 'global_accepted_count')
      .from('activity')
      .orderBy([{column: 'global_accepted_count', order: 'desc'}, {column: 'name'}])
      .limit(10);
  },

    getUserTopActivitiesList(db, userId){
        return db   
                .select('name', 'accepted_count', 'description')
                .from('accepted_rejected')
                .rightJoin('activity', 'activity', 'activity.id')
                .where({user_id: userId})
                .orderBy([{column: 'accepted_count', order: 'desc'}, {column: 'name'}])
                .limit(10)
    },


  insertAcceptedRejectedRow(db, newRow) {
    return db
      .insert(newRow)
      .into('accepted_rejected')
      .returning('*')
      .then(([row]) => row);
  },
    
    getUserActivityAcceptance(db, userId, activityId) {
        return db
                .select('*')
                .from('accepted_rejected')
                .where({user_id: userId, activity: activityId})
    },
    
    getSingleGlobalActivityCount(db, activityId) {
        return db
                .select('global_accepted_count')
                .from('activity')
                .where('id', activityId)
                .first()
    },

  updateAcceptedCount(db, activityId, userId, acceptedCount){
    return db('accepted_rejected')
      .where({activity: activityId, user_id: userId})
      .first()
      .update({accepted_count: acceptedCount})
      .then(rows => {
        return rows[0];
      });
  },
 
};

module.exports = ProfileService;