import { useState } from "react";
import { X, Plus, Trash2, Upload, Loader2 } from "lucide-react";
import Select from "react-select";
import { useCreateProduct } from "../../hooks/products/useCreateProduct";
import { useCategoryTree } from "../../hooks/categories/useCategoryTree";
import { useAttributes } from "../../hooks/attributes/useAttributes";

export default function AddProductModal({ isOpen, onClose }) {
  const createProductMutation = useCreateProduct();
  const { data: categoryResponse } = useCategoryTree();
  const { data: attributeResponse } = useAttributes();

  const categories = Array.isArray(categoryResponse?.data)
    ? categoryResponse.data
    : Array.isArray(categoryResponse)
    ? categoryResponse
    : [];

  const attributeResData = attributeResponse?.data;
  const variantAttributes = Array.isArray(attributeResData?.data)
    ? attributeResData.data
    : Array.isArray(attributeResData)
    ? attributeResData
    : Array.isArray(attributeResponse)
    ? attributeResponse
    : [];

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    brand: null,
    is_active: true,
    variants: [
      {
        sku: "",
        mrp: "",
        selling_price: "",
        stock: 0,
        attributes: [{ attribute: "", value: "" }],
        images: [],
      },
    ],
  });

  const [uploadingVariantIndex, setUploadingVariantIndex] = useState(null);

  if (!isOpen) return null;

  const selectedCategoryObj = categories.find((cat) => cat.id === form.category);
  const availableSubcategories = selectedCategoryObj?.subcategories || [];

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const subcategoryOptions = availableSubcategories.map((sub) => ({
    value: sub.id,
    label: sub.name,
  }));

  const handleCategoryChange = (selectedOption) => {
    setForm({
      ...form,
      category: selectedOption ? selectedOption.value : "",
      subcategory: "",
    });
  };

  const handleSubcategoryChange = (selectedOption) => {
    setForm({
      ...form,
      subcategory: selectedOption ? selectedOption.value : "",
    });
  };

  const handleImageUpload = async (e, variantIndex) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingVariantIndex(variantIndex);

    try {
      const uploadPromises = files.map(async (file, idx) => {
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

        return {
          cloudinary_public_id: data.public_id,
          image_url: data.secure_url,
          is_primary: false,
          display_order: 1,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);

      setForm((prev) => {
        const updatedVariants = [...prev.variants];
        const existingImages = updatedVariants[variantIndex].images;

        const uniqueNewImages = uploadedImages.filter(
          (newImg) => !existingImages.some((ex) => ex.cloudinary_public_id === newImg.cloudinary_public_id)
        );

        const combinedImages = [...existingImages, ...uniqueNewImages];

        const finalizedImages = combinedImages.map((img, idx) => ({
          ...img,
          is_primary: idx === 0,
          display_order: idx + 1,
        }));

        updatedVariants[variantIndex].images = finalizedImages;
        return { ...prev, variants: updatedVariants };
      });
    } catch (error) {
      alert(error.message || "Image upload failed");
    } finally {
      setUploadingVariantIndex(null);
    }
  };

  const handleRemoveImage = (vIdx, imgIdx) => {
    setForm((prev) => {
      const updatedVariants = [...prev.variants];
      const updatedImages = updatedVariants[vIdx].images.filter((_, i) => i !== imgIdx);
      
      if (updatedImages.length > 0 && !updatedImages.some((img) => img.is_primary)) {
        updatedImages[0].is_primary = true;
      }

      updatedVariants[vIdx].images = updatedImages.map((img, idx) => ({
        ...img,
        display_order: idx + 1,
      }));

      return { ...prev, variants: updatedVariants };
    });
  };

  const handleAddVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          sku: "",
          mrp: "",
          selling_price: "",
          stock: 0,
          attributes: [{ attribute: "", value: "" }],
          images: [],
        },
      ],
    }));
  };

  const handleRemoveVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleAddAttributeRow = (vIdx) => {
    setForm((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants[vIdx].attributes.push({ attribute: "", value: "" });
      return { ...prev, variants: updatedVariants };
    });
  };

  const handleRemoveAttributeRow = (vIdx, attrIdx) => {
    setForm((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants[vIdx].attributes = updatedVariants[vIdx].attributes.filter((_, i) => i !== attrIdx);
      return { ...prev, variants: updatedVariants };
    });
  };

  const handleAttributeChange = (vIdx, attrIdx, selectedOption) => {
    setForm((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants[vIdx].attributes[attrIdx] = {
        attribute: selectedOption ? selectedOption.value : "",
        value: "",
      };
      return { ...prev, variants: updatedVariants };
    });
  };

  const handleValueChange = (vIdx, attrIdx, selectedOption) => {
    setForm((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants[vIdx].attributes[attrIdx].value = selectedOption ? selectedOption.value : "";
      return { ...prev, variants: updatedVariants };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProductMutation.mutate(form, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        alert(error?.message || "Failed to create product.");
      },
    });
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "32px",
      height: "32px",
      fontSize: "12px",
      backgroundColor: "#0b0f19",
      borderColor: state.isFocused ? "#eab308" : "#1e293b",
      boxShadow: "none",
      "&:hover": {
        borderColor: state.isFocused ? "#eab308" : "#334155",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "32px",
      padding: "0 8px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#f8fafc",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
      color: "#f8fafc",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#64748b",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "32px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "4px",
      color: "#64748b",
      "&:hover": { color: "#94a3b8" },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: "4px",
      color: "#64748b",
      "&:hover": { color: "#94a3b8" },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#0b0f19",
      border: "1px solid #1e293b",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "12px",
      backgroundColor: state.isSelected 
        ? "#eab308" 
        : state.isFocused 
        ? "#1e293b" 
        : "#0b0f19",
      color: state.isSelected ? "#030712" : "#f8fafc",
      "&:active": {
        backgroundColor: "#ca8a04",
      },
    }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4  overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-xl border border-slate-800 bg-[#030712] p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto text-slate-100">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <h3 className="text-base font-bold text-slate-100 tracking-wide">Add New Product</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-500">Basic Info</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Potato Pack"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:border-yellow-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <Select
                  options={categoryOptions}
                  value={categoryOptions.find((opt) => opt.value === form.category) || null}
                  onChange={handleCategoryChange}
                  placeholder="Select Category"
                  isClearable
                  styles={customSelectStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subcategory</label>
                <Select
                  options={subcategoryOptions}
                  value={subcategoryOptions.find((opt) => opt.value === form.subcategory) || null}
                  onChange={handleSubcategoryChange}
                  placeholder="Select Subcategory"
                  isDisabled={!form.category || availableSubcategories.length === 0}
                  isClearable
                  styles={customSelectStyles}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Product description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:border-yellow-500 transition"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-500">Product Variants</h4>
              <button
                type="button"
                onClick={handleAddVariant}
                className="inline-flex items-center gap-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 text-xs font-semibold text-yellow-400 hover:bg-yellow-500/20 transition"
              >
                <Plus className="h-3 w-3" /> Add Variant
              </button>
            </div>

            {form.variants.map((variant, vIdx) => {
              const selectedAttributeIds = variant.attributes.map((a) => a.attribute);

              return (
                <div key={vIdx} className="rounded-xl border border-slate-800 p-4 space-y-4 bg-slate-900/40 backdrop-blur-sm relative">
                  {form.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(vIdx)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">SKU</label>
                      <input
                        type="text"
                        required
                        placeholder="POTATO-500GM"
                        value={variant.sku}
                        onChange={(e) => {
                          const updated = [...form.variants];
                          updated[vIdx].sku = e.target.value;
                          setForm({ ...form, variants: updated });
                        }}
                        className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">MRP</label>
                      <input
                        type="text"
                        required
                        placeholder="40.00"
                        value={variant.mrp}
                        onChange={(e) => {
                          const updated = [...form.variants];
                          updated[vIdx].mrp = e.target.value;
                          setForm({ ...form, variants: updated });
                        }}
                        className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Selling Price</label>
                      <input
                        type="text"
                        required
                        placeholder="35.00"
                        value={variant.selling_price}
                        onChange={(e) => {
                          const updated = [...form.variants];
                          updated[vIdx].selling_price = e.target.value;
                          setForm({ ...form, variants: updated });
                        }}
                        className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Stock</label>
                      <input
                        type="number"
                        required
                        placeholder="100"
                        value={variant.stock}
                        onChange={(e) => {
                          const updated = [...form.variants];
                          updated[vIdx].stock = parseInt(e.target.value) || 0;
                          setForm({ ...form, variants: updated });
                        }}
                        className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:border-yellow-500"
                      />
                    </div>
                  </div>

                  {/* Dynamic Variant Attributes & Values */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                        Attributes
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddAttributeRow(vIdx)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-yellow-400 hover:text-yellow-300 transition"
                      >
                        <Plus className="h-3 w-3" /> Add Attribute
                      </button>
                    </div>

                    {variant.attributes.map((attrRow, attrIdx) => {
                      const currentAttributeObj = variantAttributes.find((attr) => attr.id === attrRow.attribute);
                      const availableValues = currentAttributeObj?.values || [];

                      const attributeOptions = variantAttributes
                        .filter((attr) => !selectedAttributeIds.includes(attr.id) || attrRow.attribute === attr.id)
                        .map((attr) => ({ value: attr.id, label: attr.name }));

                      const valueOptions = availableValues.map((val) => ({
                        value: val.id,
                        label: val.value,
                      }));

                      return (
                        <div key={attrIdx} className="flex items-center gap-2">
                          <div className="flex-1">
                            <Select
                              options={attributeOptions}
                              value={attributeOptions.find((opt) => opt.value === attrRow.attribute) || null}
                              onChange={(selected) => handleAttributeChange(vIdx, attrIdx, selected)}
                              placeholder="Select Attribute"
                              isClearable
                              styles={customSelectStyles}
                            />
                          </div>

                          <div className="flex-1">
                            <Select
                              options={valueOptions}
                              value={valueOptions.find((opt) => opt.value === attrRow.value) || null}
                              onChange={(selected) => handleValueChange(vIdx, attrIdx, selected)}
                              placeholder="Select Value"
                              isDisabled={!attrRow.attribute}
                              isClearable
                              styles={customSelectStyles}
                            />
                          </div>

                          {variant.attributes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveAttributeRow(vIdx, attrIdx)}
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Cloudinary Image Upload Section per Variant */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-[11px] font-semibold text-slate-400">Variant Images (Cloudinary)</label>
                    <div className="flex flex-wrap gap-2 items-center">
                      {variant.images.map((img, i) => (
                        <div key={i} className="relative h-16 w-16 rounded-lg border border-slate-800 overflow-hidden bg-[#0b0f19] group">
                          <img src={img.image_url} alt="upload" className="h-full w-full object-cover" />
                          {img.is_primary && (
                            <span className="absolute bottom-0 inset-x-0 bg-yellow-500 text-[#030712] text-[8px] text-center font-extrabold uppercase">
                              Primary
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(vIdx, i)}
                            className="absolute top-1 right-1 rounded-full bg-black/70 p-0.5 text-white opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}

                      <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-[#0b0f19] hover:bg-slate-900 transition">
                        {uploadingVariantIndex === vIdx ? (
                          <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                        ) : (
                          <>
                            <Upload className="h-4 w-4 text-slate-500" />
                            <span className="text-[10px] text-slate-400 mt-1">Upload</span>
                          </>
                        )}
                        <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, vIdx)} />
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={createProductMutation.isPending}
              className="rounded-lg border border-slate-800 bg-transparent px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProductMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-500 px-4 py-2 text-xs font-semibold text-[#030712] shadow-lg shadow-yellow-500/10 hover:bg-yellow-400 disabled:opacity-50 transition"
            >
              {createProductMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Create Product</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}