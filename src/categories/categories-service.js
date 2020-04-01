const CategoriesService = {
  getCategoryById(db, id) {
		return db
			.from('category')
			.select('*')
			.where({ id })
			.first()
	},

	getCategories(db){
		console.log('CAN YOU SEE THIS')
		return db
			.select('*')
			.from('category')
			.orderBy('id')
	}
}

module.exports = CategoriesService;