import React, { useState } from 'react';
import { CRUDEditModal } from './CRUDEditModal';
import { MagneticButton } from '../common/MagneticButton';

interface CRUDTableProps {
  type: 'services' | 'projects' | 'events' | 'gallery' | 'team' | 'testimonials';
  title: string;
  subtitle: string;
  items: any[];
  onUpdateItems: (newItems: any[]) => Promise<void>;
}

export const CRUDTable: React.FC<CRUDTableProps> = ({
  type,
  title,
  subtitle,
  items = [],
  onUpdateItems,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const updated = items.filter((item) => item.id !== id);
      await onUpdateItems(updated);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const copy = [...items];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    await onUpdateItems(copy);
  };

  const handleSaveModal = async (savedItem: any) => {
    if (editingItem) {
      const updated = items.map((item) => (item.id === savedItem.id ? savedItem : item));
      await onUpdateItems(updated);
    } else {
      const updated = [...items, savedItem];
      await onUpdateItems(updated);
    }
  };

  const renderItemTitle = (item: any) => {
    return item.title || item.name || item.caption || item.id;
  };

  const renderItemSub = (item: any) => {
    if (type === 'projects') return `${item.category} • ${item.year}`;
    if (type === 'events') return `${item.date} • ${item.location}`;
    if (type === 'team') return item.role;
    if (type === 'gallery') return item.category;
    if (type === 'testimonials') return item.role;
    if (type === 'services') return item.desc?.slice(0, 60) + '...';
    return '';
  };

  return (
    <div className="panel active">
      <div className="panel-header flex justify-between items-center mb-6">
        <div>
          <h2 className="panel-title space-grotesk">{title}</h2>
          <span className="panel-subtitle">{subtitle}</span>
        </div>
        <MagneticButton type="button" className="btn-primary" onClick={handleOpenAdd}>
          + Add New Entry
        </MagneticButton>
      </div>

      <div className="crud-table-container glass-panel rounded-xl overflow-hidden border border-border-color">
        {items.length === 0 ? (
          <div className="p-8 text-center text-sm opacity-70">
            No entries found. Click "+ Add New Entry" above to add your first record.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-color text-xs uppercase space-mono opacity-60">
                <th className="p-4">Order</th>
                <th className="p-4">Item Details</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id || idx} className="border-b border-border-color hover:bg-card-bg-sec/50 transition-colors">
                  <td className="p-4 space-mono text-xs opacity-60 w-24">
                    <div className="flex items-center gap-1">
                      <span>#{idx + 1}</span>
                      <button
                        type="button"
                        disabled={idx === 0}
                        className="px-1 opacity-60 hover:opacity-100 disabled:opacity-20"
                        onClick={() => handleMove(idx, 'up')}
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={idx === items.length - 1}
                        className="px-1 opacity-60 hover:opacity-100 disabled:opacity-20"
                        onClick={() => handleMove(idx, 'down')}
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold space-grotesk text-base">{renderItemTitle(item)}</div>
                    <div className="text-xs opacity-70 space-mono mt-0.5">{renderItemSub(item)}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="btn btn-secondary px-3 py-1 text-xs"
                        onClick={() => handleOpenEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn px-3 py-1 text-xs text-red-400 border-red-500/30 hover:bg-red-500/10"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CRUDEditModal
        isOpen={modalOpen}
        type={type}
        initialData={editingItem}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveModal}
      />
    </div>
  );
};
