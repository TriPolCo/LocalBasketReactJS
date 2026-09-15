export const foodCategoryEndpoints = {
  create: "/food/admin/menu/categories/create/",
  list: "/food/admin/menu/categories/",
  detail: (id) => `/food/admin/menu/categories/${id}/`,
  update: (id) => `/food/admin/menu/categories/${id}/update/`,
  delete: (id) => `/food/admin/menu/categories/${id}/delete/`,
};