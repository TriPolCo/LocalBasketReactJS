import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, Clock, CheckCircle2, XCircle, FileText, Search, Calendar, Eye, ChevronDown, Layers, Loader2 } from 'lucide-react';
import { usePrintOrders } from '../hooks/printing/usePrintOrders';

export default function PrintOrders() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { orders: ordersData = [], loading: isLoading, error } = usePrintOrders();
  const isError = Boolean(error);

  const filteredOrders = ordersData.filter(order => {
    const orderStatus = (order.status || '').toUpperCase();
    const matchesFilter = filter === 'ALL' || orderStatus === filter;
    
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.phone_number?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter && order.created_at) {
      const orderDate = new Date(order.created_at).toISOString().split('T')[0];
      matchesDate = orderDate === dateFilter;
    }

    return matchesFilter && matchesSearch && matchesDate;
  });

  const handleStatusChange = (orderId, newStatus, e) => {
    e.stopPropagation();
    alert(`Updating print order ${orderId} status to ${newStatus}`);
    setActiveDropdown(null);
  };

  const getStatusBadge = (status) => {
    const upperStatus = (status || '').toUpperCase();
    switch (upperStatus) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center justify-center min-w-[76px] rounded-md px-2.5 py-0.5 text-[10px] font-medium tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center justify-center min-w-[76px] rounded-md px-2.5 py-0.5 text-[10px] font-medium tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Layers className="w-3 h-3 mr-1" /> Processing
          </span>
        );
      case 'COMPLETED':
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center justify-center min-w-[76px] rounded-md px-2.5 py-0.5 text-[10px] font-medium tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
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
          <span>Loading print orders...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-48 items-center justify-center rounded-md border border-rose-500/20 bg-rose-500/10 p-6 text-center text-xs font-medium text-rose-400">
        {error || 'Failed to load print orders. Please check your network or try again.'}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Printer className="w-5 h-5 text-yellow-500" /> Print & Xerox Orders
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage user document printing, verify color specifications, and oversee document queues.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-gray-900/60 p-1 rounded-md border border-gray-800">
          {['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'].map((tab) => (
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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-md border border-gray-800 bg-gray-900/60 p-3 shadow-lg backdrop-blur-xl">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order #, customer name or phone..."
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

      {filteredOrders.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-md border border-gray-800 bg-gray-900/40 p-6 text-center text-gray-400 space-y-2">
          <FileText className="h-8 w-8 text-gray-600" />
          <p className="text-xs font-medium">No print orders found matching your criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-visible rounded-md border border-gray-800 bg-gray-900/50 shadow-lg backdrop-blur-xl min-h-[300px]">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="border-b border-gray-800 bg-gray-900/80 text-[11px] font-medium text-gray-400">
              <tr>
                <th className="py-3 pl-4 pr-2 w-10">#</th>
                <th className="py-3 px-3">Order Number</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Documents & Specs</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-center">Total</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 pl-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filteredOrders.map((order, index) => {
                const documents = order.documents || [];
                const orderId = order.id || order._id;

                return (
                  <tr 
                    key={orderId || index} 
                    onClick={() => navigate(`/print-order-details/${orderId}`)}
                    className="hover:bg-gray-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3 pl-4 pr-2 font-medium text-gray-500">
                      {index + 1}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {order.order_number}
                      {order.notes && (
                        <div className="text-[10px] text-yellow-500/80 truncate max-w-[180px]" title={order.notes}>
                          Note: {order.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-gray-300">
                      <div className="font-medium text-white">
                        {order.customer?.first_name} {order.customer?.last_name}
                      </div>
                      <div className="text-[11px] text-gray-500">{order.customer?.phone_number || order.customer?.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        {documents.map((doc, idx) => (
                          <div key={doc.id || idx} className="flex items-center gap-2">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-800 text-yellow-400 border border-gray-700">
                              {doc.service_name || 'Print'}
                            </span>
                            <a 
                              href={doc.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-gray-200 hover:text-yellow-400 underline truncate max-w-[140px]"
                              title={doc.file_name}
                            >
                              {doc.file_name}
                            </a>
                            <span className="text-[10px] text-gray-500">
                              ({doc.page_count}p • {doc.color_type} • {doc.paper_size} • {doc.copies}x)
                            </span>
                          </div>
                        ))}
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
                          onClick={() => navigate(`/print-order-details/${orderId}`)}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-800 bg-gray-950/60 px-2.5 py-1 text-[11px] font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          <Eye className="w-3 h-3 text-yellow-500" /> View
                        </button>

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
                            <div className="absolute right-0 mt-1 w-40 rounded-lg border border-gray-800 bg-gray-950 p-1 shadow-2xl z-50 text-left">
                              <button
                                onClick={(e) => handleStatusChange(orderId, 'PENDING', e)}
                                className="w-full rounded-md px-2.5 py-1.5 text-[11px] text-gray-300 hover:bg-gray-900 hover:text-white flex items-center gap-2"
                              >
                                <Clock className="w-3 h-3 text-amber-400" /> Mark Pending
                              </button>
                              <button
                                onClick={(e) => handleStatusChange(orderId, 'PROCESSING', e)}
                                className="w-full rounded-md px-2.5 py-1.5 text-[11px] text-gray-300 hover:bg-gray-900 hover:text-white flex items-center gap-2"
                              >
                                <Layers className="w-3 h-3 text-blue-400" /> Processing
                              </button>
                              <button
                                onClick={(e) => handleStatusChange(orderId, 'COMPLETED', e)}
                                className="w-full rounded-md px-2.5 py-1.5 text-[11px] text-gray-300 hover:bg-gray-900 hover:text-white flex items-center gap-2"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Mark Completed
                              </button>
                              <button
                                onClick={(e) => handleStatusChange(orderId, 'CANCELLED', e)}
                                className="w-full rounded-md px-2.5 py-1.5 text-[11px] text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                              >
                                <XCircle className="w-3 h-3" /> Cancel
                              </button>
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