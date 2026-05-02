import { useMemo, useState } from 'react';
import { Service } from '../../types';
import { mockDB } from '../../db/mockDB';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface ServiceManagerProps {
  services: Service[];
  onRefresh: () => void;
}

const blankForm: Omit<Service, 'id'> = {
  title: '',
  description: '',
  price: '₹0',
  icon: 'Megaphone',
  category: 'SEO',
  includes: []
};

export default function ServiceManager({ services, onRefresh }: ServiceManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Service, 'id'>>(blankForm);
  const [editForm, setEditForm] = useState<Omit<Service, 'id'>>(blankForm);

  const categories: Service['category'][] = ['SEO', 'PPC', 'Social', 'Content', 'Design', 'Email', 'Video', 'Influencer', 'Local'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;
    mockDB.addService({ ...formData, price: formData.price.startsWith('₹') ? formData.price : `₹${formData.price}` });
    setShowAddModal(false);
    setFormData(blankForm);
    onRefresh();
  };

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setEditForm({
      title: service.title,
      description: service.description,
      price: service.price.startsWith('₹') ? service.price : `₹${service.price}`,
      icon: service.icon,
      category: service.category,
      includes: service.includes || []
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    mockDB.updateService({ id: editingId, ...editForm, price: editForm.price.startsWith('₹') ? editForm.price : `₹${editForm.price}` });
    setEditingId(null);
    setEditForm(blankForm);
    onRefresh();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(blankForm);
  };

  const handleDelete = (id: string) => {
    mockDB.deleteService(id);
    onRefresh();
  };

  const sortedServices = useMemo(() => [...services].sort((a, b) => a.title.localeCompare(b.title)), [services]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Service Catalog</h2>
          <p className="text-sm text-slate-400">Manage offerings, INR pricing, and included deliverables.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> Add Package
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {sortedServices.map((service) => {
          const isEditing = editingId === service.id;
          return (
            <div key={service.id} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700">
              {isEditing ? (
                <div className="space-y-4">
                  <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                    <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value as Service['category'] })} className="block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                      {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <textarea rows={3} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                  <textarea rows={3} value={editForm.includes.join(', ')} onChange={(e) => setEditForm({ ...editForm, includes: e.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} className="block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" placeholder="Deliverables, comma separated" />
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button onClick={saveEdit} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500">
                      <Check className="h-4 w-4" /> Save
                    </button>
                    <button onClick={cancelEdit} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700">
                      <X className="h-4 w-4" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="rounded-md border border-indigo-800/40 bg-indigo-950/40 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                        {service.category}
                      </span>
                      <h3 className="mt-2 text-lg font-bold text-white">{service.title}</h3>
                    </div>
                    <span className="text-xl font-bold text-slate-200">{service.price}</span>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-400">{service.description}</p>

                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">What’s included</p>
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {service.includes.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
                    <button onClick={() => startEdit(service)} className="rounded-xl bg-slate-800 p-2 text-slate-300 hover:bg-slate-700" title="Edit service">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(service.id)} className="rounded-xl bg-slate-800 p-2 text-red-400 hover:bg-slate-700 hover:text-red-300" title="Delete service">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-200">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Create New Offering</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" required placeholder="Service title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input type="text" required placeholder="₹24,999/mo" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as Service['category'] })} className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white">
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <textarea rows={3} required placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <textarea rows={3} placeholder="Deliverables, comma separated" value={formData.includes.join(', ')} onChange={(e) => setFormData({ ...formData, includes: e.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 rounded-xl bg-slate-800 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700">Cancel</button>
                <button type="submit" className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500">Confirm Offering</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
