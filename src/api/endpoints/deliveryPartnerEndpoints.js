export const deliveryPartnerEndpoints = {
  getDeliveryPartners: "/accounts/admin/delivery-partners/",
  getDeliveryPartner:(id)=> `/accounts/admin/delivery-partners/${id}/`,
  createDeliveryPartner: "/accounts/admin/delivery-partners/create/",
  updateDeliveryPartner:(id)=> `/accounts/admin/delivery-partners/${id}/update/`,
  deleteDeliveryPartner:(id)=> `/accounts/admin/delivery-partners/${id}/delete/`,
}