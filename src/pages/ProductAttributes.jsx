import { useState, useRef, useEffect } from "react";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  SlidersHorizontal,
  Loader2,
  Power,
  Tag
} from "lucide-react";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import AddAttributeModal from "../components/attributes/AddAttributeModal";
import AddValueModal from "../components/attributes/AddValueModal";

import { useAttributes } from "../hooks/attributes/useAttributes";
import { useCreateAttribute } from "../hooks/attributes/useCreateAttribute"; 
import { useCreateAttributeValue } from "../hooks/attributes/useCreateAttributeValue";

export default function ProductAttributes() {
  const { data: response, isLoading, isError } = useAttributes();
  const createAttributeMutation = useCreateAttribute();
  const createAttributeValueMutation = useCreateAttributeValue();

  const [attributes, setAttributes] = useState([]);

  // Sync server data to local state when fetched
  useEffect(() => {
    if (response) {
      const fetchedData = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      setAttributes(fetchedData);
    }
  }, [response]);

  // Active menu dropdown tracking
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Modal States
  const [isAddAttrModalOpen, setIsAddAttrModalOpen] = useState(false);
  const [attrModalMode, setAttrModalMode] = useState("create");
  const [selectedAttr, setSelectedAttr] = useState(null);

  const [isAddValueModalOpen, setIsAddValueModalOpen] = useState(false);
  const [targetAttrId, setTargetAttrId] = useState(null);

  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    type: null, // "attribute" or "value"
    id: null,
    parentId: null,
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

  // Handlers for Attributes
  const handleOpenCreateAttr = () => {
    setAttrModalMode("create");
    setSelectedAttr(null);
    setIsAddAttrModalOpen(true);
  };

  const handleOpenEditAttr = (attr) => {
    setActiveMenuId(null);
    setAttrModalMode("edit");
    setSelectedAttr(attr);
    setIsAddAttrModalOpen(true);
  };

  const handleSaveAttribute = (form) => {
    if (attrModalMode === "create") {
      createAttributeMutation.mutate(
        { name: form.name },
        {
          onSuccess: () => {
            setIsAddAttrModalOpen(false);
          },
          onError: (error) => {
            alert(error?.message || "Failed to create attribute.");
          }
        }
      );
    } else {
      // Edit logic placeholder if an update mutation is added later
      setAttributes(
        attributes.map((a) => (a.id === selectedAttr.id ? { ...a, name: form.name } : a))
      );
      setIsAddAttrModalOpen(false);
    }
  };

  const handleToggleAttributeStatus = (attr) => {
    setActiveMenuId(null);
    setAttributes(
      attributes.map((a) => (a.id === attr.id ? { ...a, is_active: !a.is_active } : a))
    );
  };

  // Handlers for Attribute Values
  const handleOpenAddValue = (attrId) => {
    setTargetAttrId(attrId);
    setIsAddValueModalOpen(true);
  };

  const handleSaveValue = (valueText) => {
    const payload = {
      attribute: targetAttrId,
      value: valueText
    };

    createAttributeValueMutation.mutate(payload, {
      onSuccess: () => {
        setIsAddValueModalOpen(false);
      },
      onError: (error) => {
        alert(error?.message || "Failed to add attribute value.");
      }
    });
  };

  const handleDeleteValue = (attrId, valueId) => {
    setAttributes(
      attributes.map((attr) => {
        if (attr.id === attrId) {
          return {
            ...attr,
            values: attr.values.filter((v) => v.id !== valueId)
          };
        }
        return attr;
      })
    );
  };

  // Deletion Management
  const promptDeleteAttribute = (attr) => {
    setActiveMenuId(null);
    setDeleteModalState({
      isOpen: true,
      type: "attribute",
      id: attr.id,
      title: "Delete Attribute?",
      message: `Are you sure you want to delete "${attr.name}" and all its values?`
    });
  };

  const handleConfirmDelete = () => {
    const { type, id } = deleteModalState;
    if (type === "attribute") {
      setAttributes(attributes.filter((a) => a.id !== id));
    }
    setDeleteModalState({ isOpen: false, type: null, id: null, parentId: null, title: "", message: "" });
  };

  return (
    <div className="space-y-6 text-gray-100">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-yellow-500" /> Product Attributes
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage product variants, specifications, and option values.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateAttr}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-yellow-500 px-4 py-2 text-xs font-semibold text-black shadow-sm transition-all hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Attribute</span>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-64 items-center justify-center rounded-md border border-gray-800 bg-gray-900/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
            <span>Loading attributes...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex h-48 items-center justify-center rounded-md border border-rose-500/20 bg-rose-500/10 p-6 text-center text-xs font-medium text-rose-400">
          Failed to load attributes. Please check your network or try again.
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && attributes.length === 0 && (
        <div className="flex h-48 flex-col items-center justify-center space-y-2 rounded-md border border-gray-800 bg-gray-900/40 p-6 text-center text-xs font-medium text-gray-400">
          <SlidersHorizontal className="h-8 w-8 text-gray-600" />
          <p>No attributes found. Click "Add Attribute" to create one.</p>
        </div>
      )}

      {/* Attribute Cards Grid */}
      {!isLoading && !isError && attributes.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {attributes.map((attr) => {
            const isMenuOpen = activeMenuId === attr.id;
            const valuesList = attr.values || [];
            const valueCount = valuesList.length;

            return (
              <div
                key={attr.id}
                className="flex flex-col justify-between rounded-md border border-gray-800 bg-gray-900/50 p-5 shadow-lg backdrop-blur-xl transition hover:border-gray-700 hover:bg-gray-800/40"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                        <SlidersHorizontal className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-white">{attr.name}</h2>
                        <span className="inline-block mt-0.5 text-[11px] font-mono text-gray-400 bg-gray-950 px-1.5 py-0.5 rounded border border-gray-800">
                          code: {attr.code}
                        </span>
                      </div>
                    </div>

                    <div className="relative flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(isMenuOpen ? null : attr.id)}
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
                            onClick={() => handleOpenEditAttr(attr)}
                            className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-medium text-gray-300 hover:bg-gray-900 hover:text-white text-left transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5 text-gray-400" />
                            <span>Edit Attribute</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleAttributeStatus(attr)}
                            className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-medium text-gray-300 hover:bg-gray-900 hover:text-white text-left transition-colors"
                          >
                            <Power className="h-3.5 w-3.5 text-gray-400" />
                            <span>Set as {attr.is_active ? "Inactive" : "Active"}</span>
                          </button>
                          <div className="my-1 border-t border-gray-800" />
                          <button
                            type="button"
                            onClick={() => promptDeleteAttribute(attr)}
                            className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 text-left transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attribute Values Section */}
                  <div className="mt-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-400">
                        Values ({valueCount})
                      </span>
                      <span
                        className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[10px] font-medium tracking-wide border ${
                          attr.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {attr.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 min-h-[44px] rounded-md border border-gray-800 bg-gray-950/60 p-2.5">
                      {valuesList.length === 0 ? (
                        <span className="text-[11px] italic text-gray-500 self-center">
                          No values defined yet.
                        </span>
                      ) : (
                        valuesList.map((val) => (
                          <span
                            key={val.id}
                            className="inline-flex items-center gap-1.5 rounded-md border border-gray-800 bg-gray-900 px-2.5 py-1 text-xs font-medium text-gray-300 shadow-sm group"
                          >
                            <Tag className="h-3 w-3 text-yellow-500" />
                            <span>{val.value}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteValue(attr.id, val.id)}
                              className="text-gray-500 hover:text-rose-400 transition-colors ml-0.5"
                              title="Remove value"
                            >
                              &times;
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="mt-5 pt-3 border-t border-gray-800/60">
                  <button
                    type="button"
                    onClick={() => handleOpenAddValue(attr.id)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-gray-700 bg-gray-900/30 px-3 py-2 text-xs font-semibold text-yellow-500 hover:bg-gray-800 hover:border-yellow-500/50 hover:text-yellow-400 transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Value</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Attribute Modal */}
      <AddAttributeModal
        isOpen={isAddAttrModalOpen}
        mode={attrModalMode}
        attribute={selectedAttr}
        isLoading={createAttributeMutation.isPending}
        onClose={() => setIsAddAttrModalOpen(false)}
        onSave={handleSaveAttribute}
      />

      {/* Add Value Modal */}
      <AddValueModal
        isOpen={isAddValueModalOpen}
        isLoading={createAttributeValueMutation.isPending}
        onClose={() => setIsAddValueModalOpen(false)}
        onSave={handleSaveValue}
      />

      {/* Universal Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.title}
        message={deleteModalState.message}
        onClose={() =>
          setDeleteModalState({ isOpen: false, type: null, id: null, parentId: null, title: "", message: "" })
        }
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}