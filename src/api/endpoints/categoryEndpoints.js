export const categoryEndpoints = {
  list: "/categories/",
  tree: "/categories/tree/",
  create: "/categories/create/",

  detail: (categoryId) =>`/categories/${categoryId}/`,
  update: (categoryId) =>`/categories/${categoryId}/update/`,
  delete: (categoryId) =>`/categories/${categoryId}/delete/`,
  subcategories: (categoryId) =>`/categories/${categoryId}/subcategories/`,
  createSubcategory: (categoryId) =>`/categories/${categoryId}/subcategories/create/`,
  updateSubcategory: (subcategoryId) =>`/categories/subcategories/${subcategoryId}/update/`,
  deleteSubcategory: (subcategoryId) =>`/categories/subcategories/${subcategoryId}/delete/`,
};