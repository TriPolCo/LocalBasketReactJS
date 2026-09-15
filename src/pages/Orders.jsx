import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle2, XCircle, MapPin, Phone, ShoppingBag, Loader2, AlertCircle, Eye, Search, Calendar, Truck, Check, ChevronDown } from 'lucide-react';
import { useAdminOrders } from '../hooks/orders/useAdminOrders';

export default function OrdersList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch real data using your React Query hook
  const { data: ordersResponse, isLoading, isError, error } = useAdminOrders();

  // Safely extract the array whether the API returns an array directly or wraps it in an object
  const ordersData = Array.isArray(ordersResponse) 
    ? ordersResponse 
    : ordersResponse?.data || ordersResponse?.orders || [];

  const filteredOrders = ordersData.filter(order => {
    const matchesFilter = filter === 'ALL' || order.status === filter;
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_address?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_address?.phone_number?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter && order.created_at) {
      const orderDate = new Date(order.created_at).toISOString().split('T')[0];
      matchesDate = orderDate === dateFilter;
    }

    return matchesFilter && matchesSearch && matchesDate;
  });

  const handleStatusChange = (orderId, newStatus, e) => {
    e.stopPropagation();
    // Implement your status update mutation/API handler here
    alert(`Updating order ${orderId} status to ${newStatus}`);
    setActiveDropdown(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center justify-center min-w-[76px] rounded-md px-2.5 py-0.5 text-[10px] font-medium tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3 mr-1" /> Processing
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center justify-center min-w-[76px] rounded-md px-2.5 py-0.5 text-[10px] font-medium tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Truck className="w-3 h-3 mr-1" /> Shipped
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center justify-center min-w-[76px] rounded-md px-2.5 py-0.5 text-[10px] font-medium tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Delivered
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center justify-center min-w-[76px] rounded-md px-2.5 py-0.5 text-[10px] font-medium tracking-wide bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3 mr-1" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center justify-center min-w-[76px] rounded-md px-2.5 py-0.5 text-[10px] font-medium tracking-wide bg-gray-500/10 text-gray-400 border border-gray-500/20">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-gray-800 bg-gray-900/40">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
          <span>Loading orders...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-48 items-center justify-center rounded-md border border-rose-500/20 bg-rose-500/10 p-6 text-center text-xs font-medium text-rose-400">
        {error?.message || 'Failed to load orders. Please check your network or try again.'}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-100">
      
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-yellow-500" /> Orders Management
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage store orders, track fulfillment states, and review stacked products.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-gray-900/60 p-1 rounded-md border border-gray-800">
          {['ALL', 'PROCESSING', 'SHIPPED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === tab
                  ? 'bg-yellow-500 text-black font-semibold shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Date Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-md border border-gray-800 bg-gray-900/60 p-3 shadow-lg backdrop-blur-xl">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order number or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-800 bg-gray-950/60 pl-9 pr-3 py-1.5 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 transition-colors"
          />
        </div>

        <div className="relative flex items-center gap-2 w-full sm:w-auto">
          <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-gray-800 bg-gray-950/60 px-3 py-1.5 text-xs text-gray-300 outline-none focus:border-yellow-500 transition-colors"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-[11px] text-yellow-500 hover:underline px-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-md border border-gray-800 bg-gray-900/40 p-6 text-center text-gray-400 space-y-2">
          <ShoppingBag className="h-8 w-8 text-gray-600" />
          <p className="text-xs font-medium">No orders found matching your criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-800 bg-gray-900/50 shadow-lg backdrop-blur-xl">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="border-b border-gray-800 bg-gray-900/80 text-[11px] font-medium text-gray-400">
              <tr>
                <th className="py-3 pl-4 pr-2 w-10">#</th>
                <th className="py-3 px-3">Order Number</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Products</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-center">Total</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 pl-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filteredOrders.map((order, index) => {
                const items = order.items || [];
                const visibleItems = items.slice(0, 3);
                const remainingCount = items.length - 3;
                const orderId = order.id || order._id;

                return (
                  <tr 
                    key={orderId || index} 
                    onClick={() => navigate(`/orderdetails/${orderId}`)}
                    className="hover:bg-gray-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3 pl-4 pr-2 font-medium text-gray-500">
                      {index + 1}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {order.order_number}
                    </td>
                    <td className="py-3 px-3 text-gray-300">
                      <div className="font-medium text-white">{order.shipping_address?.full_name || 'N/A'}</div>
                      <div className="text-[11px] text-gray-500">{order.shipping_address?.phone_number || ''}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center -space-x-2 overflow-hidden py-1">
                        {visibleItems.map((item, idx) => (
                          <img
                            key={item.id || idx}
                            src={item.image}
                            alt={item.product_name}
                            title={`${item.product_name} (x${item.quantity})`}
                            className="inline-block h-8 w-8 rounded-full border-2 border-gray-900 object-cover bg-gray-950"
                          />
                        ))}
                        {remainingCount > 0 && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-900 bg-gray-800 text-[10px] font-semibold text-gray-300">
                            +{remainingCount}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-400">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-yellow-500">
                      ₹{order.total_amount}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3 pl-3 pr-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => navigate(`/orderdetails/${orderId}`)}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-800 bg-gray-950/60 px-2.5 py-1 text-[11px] font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          <Eye className="w-3 h-3 text-yellow-500" /> View
                        </button>

                        {/* Status Action Dropdown */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActiveDropdown(activeDropdown === orderId ? null : orderId)}
                            className="inline-flex items-center gap-1 rounded-md border border-gray-800 bg-gray-950/60 px-2 py-1 text-[11px] font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                          >
                            <span>Action</span>
                            <ChevronDown className="w-3 h-3" />
                          </button>

                          {activeDropdown === orderId && (
                            <div className="absolute right-0 mt-1 w-36 rounded-lg border border-gray-800 bg-gray-950 p-1 shadow-2xl z-20 text-left">
                              <button
                                onClick={(e) => handleStatusChange(orderId, 'PROCESSING', e)}
                                className="w-full rounded-md px-2.5 py-1.5 text-[11px] text-gray-300 hover:bg-gray-900 hover:text-white flex items-center gap-2"
                              >
                                <Clock className="w-3 h-3 text-amber-400" /> Processing
                              </button>
                              <button
                                onClick={(e) => handleStatusChange(orderId, 'SHIPPED', e)}
                                className="w-full rounded-md px-2.5 py-1.5 text-[11px] text-gray-300 hover:bg-gray-900 hover:text-white flex items-center gap-2"
                              >
                                <Truck className="w-3 h-3 text-blue-400" /> Mark Shipped
                              </button>
                              <button
                                onClick={(e) => handleStatusChange(orderId, 'CANCELLED', e)}
                                className="w-full rounded-md px-2.5 py-1.5 text-[11px] text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                              >
                                <XCircle className="w-3 h-3" /> Cancel
                              </button>
                              <div className="px-2 py-1 text-[9px] text-gray-500 border-t border-gray-900 mt-1">
                                Delivered managed by courier
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}