const ProfileService = {

<<<<<<< HEAD
  getTopActivitiesList(db){
    return db
      .select('name', 'accepted_count')
      .from('activity')
      .orderBy([{column: 'accepted_count', order: 'desc'}, {column: 'name'}]);
  },

  getUserTopActivitiesList(db, userId){
    return db   
      .select('accepted_count')
      .from('accepted_rejected')
      .where({user_id: userId})
      .orderBy('accepted_count', 'desc');
  },
  insertAcceptedRejectedRow(db, newRow) {
    return db
      .insert(newRow)
      .into('accepted_rejected')
      .returning('*')
      .then(([row]) => row);
  },

  updateAcceptedCount(db, activityId, userId, acceptedCount){
    return db('accepted_rejected')
      .where({activity: activityId, user_id: userId})
      .first()
      .update({accepted_count: acceptedCount});
  },
=======
    getTopActivitiesList(db){
        return db
                .select('name', 'global_accepted_count')
                .from('activity')
                .orderBy([{column: 'global_accepted_count', order: 'desc'}, {column: 'name'}])
                .limit(10)
    },

    getUserTopActivitiesList(db, userId){
        return db   
                .select('name', 'accepted_count')
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
                .then(([row]) => row)
    },

    getUserActivityAcceptance(db, userId, activityId) {
        return db
                .select('*')
                .from('accepted_rejected')
                .where({user_id: userId, activity: activityId})
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
>>>>>>> 3d1db9525d9dc08c5c0ce031476ad84308923fc9
 
};

module.exports = ProfileService;