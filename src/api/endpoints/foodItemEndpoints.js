export const foodItemEndpoints = {
  create: "/food/admin/menu/items/create/",
  list: "/food/admin/menu/items/",
  detail: (id) => `/food/admin/menu/items/${id}/`,
  update: (id) => `/food/admin/menu/items/${id}/update/`,
  delete: (id) => `/food/admin/menu/items/${id}/delete/`,
};