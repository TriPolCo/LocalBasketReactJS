import { useState, useEffect } from "react";
import { X, Loader2, Bike, Upload, Eye, EyeOff } from "lucide-react";
import Select from "react-select";
import { useCreateDeliveryPartner } from "../../hooks/deliveryPartners/useCreateDeliveryPartner";

export default function AddDeliveryPartnerModal({ isOpen, onClose, onSuccess }) {
  const createPartnerMutation = useCreateDeliveryPartner();

  const genderOptions = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
    { label: "Other", value: "OTHER" }
  ];

  const vehicleTypeOptions = [
    { label: "Electric Scooter", value: "Electric Scooter" },
    { label: "Motorcycle", value: "Motorcycle" },
    { label: "Bicycle", value: "Bicycle" },
    { label: "Car / Van", value: "Car / Van" }
  ];

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    gender: genderOptions[0],
    date_of_birth: "1998-05-20",
    profile_image_url: "",
    profile_image_public_id: "",
    vehicle_type: vehicleTypeOptions[0],
    vehicle_number: "",
    current_location: "",
    is_active: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        confirm_password: "",
        gender: genderOptions[0],
        date_of_birth: "1998-05-20",
        profile_image_url: "",
        profile_image_public_id: "",
        vehicle_type: vehicleTypeOptions[0],
        vehicle_number: "",
        current_location: "",
        is_active: true
      });
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "localbasket_preset");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dup5b38zp/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      setForm((prev) => ({
        ...prev,
        profile_image_url: data.secure_url,
        profile_image_public_id: data.public_id,
      }));
    } catch (error) {
      alert(error.message || "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.first_name.trim() || !form.phone_number.trim() || !form.email.trim()) {
      alert("Please provide required fields: First Name, Email, and Phone Number.");
      return;
    }

    if (!form.password || form.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (form.password !== form.confirm_password) {
      alert("Passwords do not match. Please verify your password entries.");
      return;
    }

    const payload = {
      phone_number: form.phone_number,
      password: form.password,
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
      gender: form.gender?.value || "MALE",
      date_of_birth: form.date_of_birth,
      profile_image_url: form.profile_image_url,
      profile_image_public_id: form.profile_image_public_id,
      vehicle_type: form.vehicle_type?.value || "Electric Scooter",
      vehicle_number: form.vehicle_number,
      current_location: form.current_location,
      is_active: form.is_active
    };

    createPartnerMutation.mutate(payload, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (error) => {
        alert(error?.message || "Failed to create delivery partner.");
      }
    });
  };

  const isLoading = createPartnerMutation.isPending || isUploading;

  // Custom dark theme styles matching dashboard UI
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#030712",
      borderColor: state.isFocused ? "#eab308" : "#1f2937",
      borderRadius: "0.375rem",
      padding: "1px 2px",
      fontSize: "12px",
      boxShadow: "none",
      cursor: "pointer",
      "&:hover": {
        borderColor: state.isFocused ? "#eab308" : "#374151"
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#030712",
      border: "1px solid #1f2937",
      borderRadius: "0.375rem",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      zIndex: 50
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#eab308"
        : state.isFocused
        ? "#111827"
        : "#030712",
      color: state.isSelected ? "#000000" : "#f3f4f6",
      fontSize: "12px",
      cursor: "pointer",
      padding: "8px 12px"
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#f3f4f6",
      fontSize: "12px"
    }),
    input: (provided) => ({
      ...provided,
      color: "#f3f4f6",
      fontSize: "12px"
    }),
    indicatorSeparator: () => ({
      display: "none"
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#9ca3af",
      "&:hover": {
        color: "#f3f4f6"
      }
    })
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 p-4 animate-in fade-in duration-200 text-gray-100">
      <div className="relative w-full max-w-lg rounded-md border border-gray-800 bg-gray-900 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Bike className="h-4 w-4 text-yellow-500" /> Add New Delivery Partner
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isLoading}
                placeholder="e.g. Rahul"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="w-full rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                disabled={isLoading}
                placeholder="e.g. Kumar"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="w-full rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                disabled={isLoading}
                placeholder="rahul@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isLoading}
                placeholder="6372362347"
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                className="w-full rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  placeholder="********"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2 pr-8 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  placeholder="********"
                  value={form.confirm_password}
                  onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                  className="w-full rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2 pr-8 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Gender
              </label>
              <Select
                isDisabled={isLoading}
                options={genderOptions}
                value={form.gender}
                onChange={(selected) => setForm({ ...form, gender: selected })}
                styles={customSelectStyles}
                isSearchable={false}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                disabled={isLoading}
                value={form.date_of_birth}
                onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                className="w-full rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Vehicle Type
              </label>
              <Select
                isDisabled={isLoading}
                options={vehicleTypeOptions}
                value={form.vehicle_type}
                onChange={(selected) => setForm({ ...form, vehicle_type: selected })}
                styles={customSelectStyles}
                isSearchable={false}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Vehicle Number / Plate
              </label>
              <input
                type="text"
                disabled={isLoading}
                placeholder="DL-08-EV-4321"
                value={form.vehicle_number}
                onChange={(e) => setForm({ ...form, vehicle_number: e.target.value })}
                className="w-full rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Initial Location / Base Hub
              </label>
              <input
                type="text"
                disabled={isLoading}
                placeholder="e.g. Noida Sector 62"
                value={form.current_location}
                onChange={(e) => setForm({ ...form, current_location: e.target.value })}
                className="w-full rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 disabled:opacity-50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Profile Image
              </label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full justify-center">
                  <Upload className="h-3.5 w-3.5 text-yellow-500" />
                  <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isLoading} />
                </label>
                {form.profile_image_url && <span className="text-[10px] text-emerald-400 font-medium">Ready</span>}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-md border border-gray-800 bg-gray-950/60 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-md bg-yellow-500 px-4 py-2 text-xs font-semibold text-black shadow-sm hover:bg-yellow-400 disabled:opacity-50 transition-all"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Delivery Partner</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}