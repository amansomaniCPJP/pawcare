import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { petService } from '@/services/petService';
import { PetGrid } from '@/components/pets/PetGrid';
import { PetSearchBar } from '@/components/pets/PetSearchBar';
import { PetFilterPanel } from '@/components/pets/PetFilterPanel';
import { PetFilterChips } from '@/components/pets/PetFilterChips';
import { Pagination } from '@/components/ui/Pagination';
import { Select } from '@/components/ui/Input';
import { SlidersHorizontal } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/features/notifications/ToastContext';

export default function PetsPage() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Extract filters from URL
  const filters = {
    species: searchParams.get('species') || 'all',
    gender: searchParams.get('gender') || 'all',
    size: searchParams.get('size') || 'all',
    status: searchParams.get('status') || 'all',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
  };

  const updateFilters = (newFilters) => {
    const updated = { ...filters, ...newFilters, page: newFilters.page || 1 };
    const params = new URLSearchParams();
    Object.entries(updated).forEach(([k, v]) => {
      if (v && v !== 'all') params.set(k, v);
    });
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    updateFilters({ [key]: value });
  };

  const handleRemoveFilter = (key) => {
    updateFilters({ [key]: key === 'search' ? '' : 'all' });
  };

  const handleClearAll = () => {
    setSearchParams({});
  };

  useEffect(() => {
    setLoading(true);
    petService.getAll({ ...filters, limit: 8 }).then((res) => {
      setPets(res.pets);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }).catch((err) => {
      toast.error(err.message);
      setLoading(false);
    });
  }, [searchParams]);

  return (
    <div className="container" style={{ padding: '40px var(--space-6) 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, marginBottom: '8px' }}>
          Explore Available Pets
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)' }}>
          Browse rescue dogs, cats, and small companions looking for a loving home.
        </p>
      </div>

      {/* Search & Sort Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        <PetSearchBar
          initialValue={filters.search}
          onSearch={(val) => updateFilters({ search: val })}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setFilterModalOpen(true)}
            className="mobile-filter-btn"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: 'var(--radius-lg)',
              background: '#fff',
              border: '1.5px solid var(--color-gray-200)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={16} /> Filters
          </button>

          <div style={{ width: '180px' }}>
            <Select
              value={filters.sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name_asc">Name (A-Z)</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <PetFilterChips
        filters={filters}
        onRemove={handleRemoveFilter}
        onClearAll={handleClearAll}
      />

      {/* Main Layout: Sidebar + Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', alignItems: 'start' }} className="pets-layout">
        <aside className="desktop-filters" style={{ position: 'sticky', top: '90px' }}>
          <PetFilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleClearAll}
          />
        </aside>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Showing <strong>{pets.length}</strong> of <strong>{total}</strong> pets
            </span>
          </div>

          <PetGrid pets={pets} loading={loading} emptyAction={handleClearAll} />

          <div style={{ marginTop: '48px' }}>
            <Pagination
              page={filters.page}
              totalPages={totalPages}
              onChange={(p) => updateFilters({ page: p })}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer/Modal */}
      <Modal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filter Pets"
        size="sm"
      >
        <div style={{ padding: '20px' }}>
          <PetFilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleClearAll}
          />
        </div>
      </Modal>

      <style>{`
        @media (max-width: 900px) {
          .pets-layout { grid-template-columns: 1fr !important; }
          .desktop-filters { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
