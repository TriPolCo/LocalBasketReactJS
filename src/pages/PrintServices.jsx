import { useState, useRef, useEffect } from "react";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Printer,
  Loader2,
  Power,
  Layers,
  DollarSign,
  Tag
} from "lucide-react";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import AddServiceModal from "../components/printing/AddServiceModal";
import AddPricingModal from "../components/printing/AddPricingModal";
import { usePrintingServices } from "../hooks/printing/usePrintingServices";
import { useCreatePricing } from "../hooks/printing/useCreatePricing";

export default function PrintServices() {
  const { services, loading: isLoading, error, refetch, createService, isCreating } = usePrintingServices();
  const createPricingMutation = useCreatePricing();

  const [servicesList, setServicesList] = useState([]);

  // Sync server data to local state when fetched
  useEffect(() => {
    if (services) {
      const fetchedData = Array.isArray(services?.data)
        ? services.data
        : Array.isArray(services)
        ? services
        : [];
      setServicesList(fetchedData);
    }
  }, [services]);

  // Active menu dropdown tracking
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Service Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [serviceModalMode, setServiceModalMode] = useState("create");
  const [selectedService, setSelectedService] = useState(null);

  // Pricing Modal States
  const [isAddPricingModalOpen, setIsAddPricingModalOpen] = useState(false);
  const [targetServiceId, setTargetServiceId] = useState(null);

  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    id: null,
    title: "",
    message: ""
  });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers for Services
  const handleOpenCreateService = () => {
    setServiceModalMode("create");
    setSelectedService(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditService = (service) => {
    setActiveMenuId(null);
    setServiceModalMode("edit");
    setSelectedService(service);
    setIsAddModalOpen(true);
  };

  const handleSaveService = async (form) => {
    if (serviceModalMode === "create") {
      try {
        await createService({
          service_type: form.service_type || "PRINT",
          name: form.name,
          subtitle: form.subtitle,
          description: form.description,
          icon: form.icon || "print-outline",
          display_order: parseInt(form.display_order) || 1,
          is_active: true
        });
        setIsAddModalOpen(false);
        refetch();
      } catch (err) {
        alert(err?.message || "Failed to create printing service.");
      }
    } else {
      setServicesList(
        servicesList.map((s) => (s.id === selectedService.id ? { ...s, ...form } : s))
      );
      setIsAddModalOpen(false);
    }
  };

  const handleToggleServiceStatus = (service) => {
    setActiveMenuId(null);
    setServicesList(
      servicesList.map((s) => (s.id === service.id ? { ...s, is_active: !s.is_active } : s))
    );
  };

  // Handlers for Pricing Configurations
  const handleOpenAddPricing = (serviceId) => {
    setTargetServiceId(serviceId);
    setIsAddPricingModalOpen(true);
  };

  const handleSavePricing = (pricingForm) => {
    const payload = {
      service: targetServiceId,
      color_type: pricingForm.color_type,
      paper_size: pricingForm.paper_size,
      print_side: pricingForm.print_side,
      price_per_page: pricingForm.price_per_page,
      minimum_charge: pricingForm.minimum_charge || "0.00",
      is_active: true
    };

    createPricingMutation.mutate(payload, {
      onSuccess: () => {
        setIsAddPricingModalOpen(false);
        refetch(); // Refresh service lists and their pricing sub-arrays
      },
      onError: (error) => {
        alert(error?.message || "Failed to create pricing configuration.");
      }
    });
  };

  // Deletion Management
  const promptDeleteService = (service) => {
    setActiveMenuId(null);
    setDeleteModalState({
      isOpen: true,
      id: service.id,
      title: "Delete Service?",
      message: `Are you sure you want to delete "${service.name}"?`
    });
  };

  const handleConfirmDelete = () => {
    const { id } = deleteModalState;
    setServicesList(servicesList.filter((s) => s.id !== id));
    setDeleteModalState({ isOpen: false, id: null, title: "", message: "" });
  };

  return (
    <div className="space-y-6 text-gray-100">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Printer className="w-5 h-5 text-yellow-500" /> Print & Xerox Services
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage available document types, custom pricing configurations, and processing rules.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateService}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-yellow-500 px-4 py-2 text-xs font-semibold text-black shadow-sm transition-all hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-64 items-center justify-center rounded-md border border-gray-800 bg-gray-900/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
            <span>Loading printing services...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex h-48 items-center justify-center rounded-md border border-rose-500/20 bg-rose-500/10 p-6 text-center text-xs font-medium text-rose-400">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && servicesList.length === 0 && (
        <div className="flex h-48 flex-col items-center justify-center space-y-2 rounded-md border border-gray-800 bg-gray-900/40 p-6 text-center text-xs font-medium text-gray-400">
          <Printer className="h-8 w-8 text-gray-600" />
          <p>No printing services found. Click "Add Service" to create one.</p>
        </div>
      )}

      {/* Services Cards Grid */}
      {!isLoading && !error && servicesList.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {servicesList.map((service) => {
            const isMenuOpen = activeMenuId === service.id;
            const pricingList = service.pricing || [];

            return (
              <div
                key={service.id}
                className="flex flex-col justify-between rounded-md border border-gray-800 bg-gray-900/50 p-5 shadow-lg backdrop-blur-xl transition hover:border-gray-700 hover:bg-gray-800/40"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                        <Printer className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-white">{service.name}</h2>
                        <span className="inline-block mt-0.5 text-[11px] font-mono text-gray-400 bg-gray-950 px-1.5 py-0.5 rounded border border-gray-800">
                          type: {service.service_type}
                        </span>
                      </div>
                    </div>

                    <div className="relative flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(isMenuOpen ? null : service.id)}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-8 z-20 w-40 rounded-md border border-gray-800 bg-gray-950 py-1.5 shadow-2xl"
                        >
                          <button
                            type="button"
                            onClick={() => handleOpenEditService(service)}
                            className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-medium text-gray-300 hover:bg-gray-900 hover:text-white text-left transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5 text-gray-400" />
                            <span>Edit Service</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleServiceStatus(service)}
                            className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-medium text-gray-300 hover:bg-gray-900 hover:text-white text-left transition-colors"
                          >
                            <Power className="h-3.5 w-3.5 text-gray-400" />
                            <span>Set as {service.is_active ? "Inactive" : "Active"}</span>
                          </button>
                          <div className="my-1 border-t border-gray-800" />
                          <button
                            type="button"
                            onClick={() => promptDeleteService(service)}
                            className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 text-left transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Service Information & Description */}
                  <div className="mt-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-yellow-500/90">
                        {service.subtitle}
                      </span>
                      <span
                        className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[10px] font-medium tracking-wide border ${
                          service.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {service.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed bg-gray-950/60 p-2.5 rounded-md border border-gray-800">
                      {service.description || "No description provided for this print configuration."}
                    </p>
                  </div>

                  {/* Pricing Configurations Section */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-400">Pricing Rules ({pricingList.length})</span>
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {pricingList.length === 0 ? (
                        <p className="text-[11px] italic text-gray-500 bg-gray-950/40 p-2 rounded border border-gray-800/80">
                          No pricing rules set. Click below to add.
                        </p>
                      ) : (
                        pricingList.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between rounded border border-gray-800 bg-gray-950/60 px-2.5 py-1.5 text-[11px] text-gray-300"
                          >
                            <div className="flex items-center gap-1.5">
                              <Tag className="h-3 w-3 text-yellow-500" />
                              <span className="font-medium text-white">
                                {p.color_type} • {p.paper_size} • {p.print_side}
                              </span>
                            </div>
                            <span className="font-semibold text-yellow-400">
                              ₹{p.price_per_page}/p
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-5 pt-3 border-t border-gray-800/60 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-yellow-500" /> Order: <strong>{service.display_order}</strong>
                    </span>
                    <span className="font-mono text-gray-500">ID: {service.id.slice(0, 8)}...</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenAddPricing(service.id)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-gray-700 bg-gray-900/30 px-3 py-2 text-xs font-semibold text-yellow-500 hover:bg-gray-800 hover:border-yellow-500/50 hover:text-yellow-400 transition-all"
                  >
                    <span>Add Pricing Configuration</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Service Modal Component */}
      <AddServiceModal
        isOpen={isAddModalOpen}
        mode={serviceModalMode}
        service={selectedService}
        isLoading={isCreating}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveService}
      />

      {/* Add Pricing Modal Component */}
      <AddPricingModal
        isOpen={isAddPricingModalOpen}
        isLoading={createPricingMutation.isPending}
        onClose={() => setIsAddPricingModalOpen(false)}
        onSave={handleSavePricing}
      />

      {/* Universal Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.title}
        message={deleteModalState.message}
        onClose={() =>
          setDeleteModalState({ isOpen: false, id: null, title: "", message: "" })
        }
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}