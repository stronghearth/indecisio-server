const CategoriesService = {
  getCategoryIdFromName(db, cat_name) {
    return db
      .from('category')
      .select('id')
      .where({ cat_name })
      .first();
  },

  getCategories(db){
    console.log('CAN YOU SEE THIS');
    return db
      .select('*')
      .from('category')
      .orderBy('id');
  },
	
  getActivitiesByCategory(db, category_id) {
    return db
      .from('activity')
      .select('*')
      .where({ category_id });
  },

  getUserActivitiesByCategory(db, user_id, category_id) {
    console.log(user_id, category_id)
    return db
      .from('activity')
      .select('*')
      .where({ category_id: category_id.id, creator_id: user_id });
  },
};

module.exports = CategoriesService;