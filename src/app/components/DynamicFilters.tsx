  import { Search, X, SlidersHorizontal } from 'lucide-react';
  import { useApp } from '../context/AppContext';
  import { DEPARTMENTS, CLASS_LEVELS, LECTURERS, COURSES } from '../data/mockData';
  
  // Available blocks
  const BLOCKS = ['A', 'B', 'C', 'D', 'E', 'F'];
interface DynamicFiltersProps {
  showSearch?: boolean;
  compact?: boolean;
}

export function DynamicFilters({ showSearch = true, compact = false }: DynamicFiltersProps) {
  const { darkMode, filters, setFilter, resetFilters, userRole } = useApp();

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  // Derived available rooms based on selected block
  const availableRooms = Array.from(
    new Set(
      COURSES
        .map(c => c.room)
        .filter(room => room && room.startsWith(filters.block))
    )
  ).sort();

  const selectStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
    color: darkMode ? '#e2e8f0' : '#0f172a',
    borderColor: darkMode ? '#334155' : '#e2e8f0',
  };

  const inputStyle = {
    ...selectStyle,
    outline: 'none',
  };

  return (
    <div
      className="flex flex-wrap items-center gap-2 px-4 py-2.5 border-b"
      style={{
        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
        borderColor: darkMode ? '#1e293b' : '#e2e8f0',
      }}
    >
      <div className="flex items-center gap-1.5 mr-1" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
        <SlidersHorizontal className="w-3.5 h-3.5" />
        {!compact && (
          <span className="text-xs font-medium" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
            Filters
          </span>
        )}
      </div>

      {/* Search */}
      {showSearch && (
        <div className="relative flex-1 min-w-36 max-w-52">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
            style={{ color: darkMode ? '#64748b' : '#94a3b8' }}
          />
          <input
            type="text"
            placeholder="Search course, code…"
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs"
            style={inputStyle}
          />
        </div>
      )}

      {/* Department */}
      <select
        value={filters.department}
        onChange={e => setFilter('department', e.target.value)}
        className="px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer"
        style={selectStyle}
      >
        <option value="">All Departments</option>
        {DEPARTMENTS.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {/* Lecturer */}
      <select
        value={filters.lecturer}
        onChange={e => setFilter('lecturer', e.target.value)}
        className="px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer"
        style={selectStyle}
      >
        <option value="">All Lecturers</option>
        {LECTURERS.map(l => (
          <option key={l.id} value={l.name}>{l.name}</option>
        ))}
      </select>

      {/* Class Level */}
      <select
        value={filters.classLevel}
        onChange={e => setFilter('classLevel', e.target.value)}
        className="px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer"
        style={selectStyle}
      >
        <option value="">All Classes</option>
        {CLASS_LEVELS.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Blocks & Rooms (Admins/Academic Only) */}
      {(userRole === 'admin' || userRole === 'academic') && (
        <>
          <select
            value={filters.block}
            onChange={e => {
              setFilter('block', e.target.value);
              setFilter('room', ''); // Reset room when block changes
            }}
            className="px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer"
            style={selectStyle}
          >
            <option value="">All Blocks</option>
            {BLOCKS.map(b => (
              <option key={b} value={b}>Block {b}</option>
            ))}
          </select>

          {filters.block && (
            <select
              value={filters.room}
              onChange={e => setFilter('room', e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer"
              style={selectStyle}
            >
              <option value="">All {filters.block} Classes</option>
              {availableRooms.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          )}
        </>
      )}

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{
            backgroundColor: darkMode ? '#450a0a' : '#fee2e2',
            color: darkMode ? '#f87171' : '#b91c1c',
          }}
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      )}

      {/* Active filter pills */}
      <div className="flex flex-wrap items-center gap-1.5 ml-1">
        {filters.department && (
          <FilterPill darkMode={darkMode} label={filters.department} onRemove={() => setFilter('department', '')} />
        )}
        {filters.lecturer && (
          <FilterPill darkMode={darkMode} label={filters.lecturer} onRemove={() => setFilter('lecturer', '')} />
        )}
        {filters.classLevel && (
          <FilterPill darkMode={darkMode} label={filters.classLevel} onRemove={() => setFilter('classLevel', '')} />
        )}
        {filters.block && !filters.room && (
          <FilterPill darkMode={darkMode} label={`Block ${filters.block}`} onRemove={() => { setFilter('block', ''); setFilter('room', ''); }} />
        )}
        {filters.room && (
          <FilterPill darkMode={darkMode} label={`Room ${filters.room}`} onRemove={() => setFilter('room', '')} />
        )}
      </div>
    </div>
  );
}

function FilterPill({ label, onRemove, darkMode }: { label: string; onRemove: () => void; darkMode: boolean }) {
  return (
    <span
      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{
        backgroundColor: darkMode ? '#1e3a5f' : '#dbeafe',
        color: darkMode ? '#93c5fd' : '#1e40af',
      }}
    >
      {label}
      <button onClick={onRemove} className="ml-0.5 hover:opacity-70">
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}
