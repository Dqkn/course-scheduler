import { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, X } from 'lucide-react';
  import { useApp } from '../context/AppContext';

interface DynamicFiltersProps {
  showSearch?: boolean;
  compact?: boolean;
}

export function DynamicFilters({ showSearch = true, compact = false }: DynamicFiltersProps) {
  const { darkMode, filters, setFilter, resetFilters, scheduledCourses, currentUser } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isSecretary = currentUser?.role === 'department_secretary';
  const secretaryDept = currentUser?.department;

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  // Dynamically derived lists from scheduledCourses
  const departments = Array.from(new Set(scheduledCourses.map(c => c.department).filter(Boolean))).sort();
  const lecturers = Array.from(new Set(scheduledCourses.map(c => c.lecturer).filter(Boolean))).sort();
  const classLevels = Array.from(new Set(scheduledCourses.map(c => c.classLevel).filter(Boolean))).sort();

  const blocks = Array.from(
    new Set(
      scheduledCourses
        .map(c => c.room)
        .filter(Boolean)
        .map(room => room!.split('-')[0])
    )
  ).sort();

  // Derived available rooms based on selected block
  const availableRooms = Array.from(
    new Set(
      scheduledCourses
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
      className="flex flex-col gap-2.5 px-3 sm:px-4 py-3 sm:py-2.5 border-b"
      style={{
        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
        borderColor: darkMode ? '#1e293b' : '#e2e8f0',
      }}
    >
      <div className="flex flex-wrap items-center gap-2.5 w-full">
        <div className="flex items-center gap-1.5 mr-auto lg:mr-1" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {!compact && (
            <span className="text-xs font-medium" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
              Filters
            </span>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border"
          style={{
            ...selectStyle,
            borderColor: darkMode ? '#334155' : '#e2e8f0',
          }}
        >
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {isExpanded ? 'Gizle' : 'Filtreler'}
        </button>

        {/* Search */}
      {showSearch && (
        <div className="relative w-full sm:flex-1 sm:min-w-36 sm:max-w-[240px]">
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
      </div>

      <div className={`${isExpanded ? 'flex' : 'hidden'} lg:flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 animate-in slide-in-from-top-2 duration-200`}>
      {/* Department */}
      <select
        disabled={isSecretary}
        value={isSecretary && secretaryDept ? secretaryDept : filters.department}
        onChange={e => setFilter('department', e.target.value)}
        className={`px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none ${isSecretary ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
        style={selectStyle}
      >
        {!isSecretary && <option value="">All Departments</option>}
        {isSecretary && secretaryDept ? (
          <option value={secretaryDept}>{secretaryDept}</option>
        ) : (
          departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))
        )}
      </select>

      {/* Lecturer */}
      <select
        value={filters.lecturer}
        onChange={e => setFilter('lecturer', e.target.value)}
        className="px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer"
        style={selectStyle}
      >
        <option value="">All Lecturers</option>
        {lecturers.map(name => (
          <option key={name} value={name}>{name}</option>
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
        {classLevels.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Blocks & Rooms */}
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
            {blocks.map(b => (
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

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center justify-center gap-1 px-3 py-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium transition-colors w-full sm:w-auto"
          style={{
            backgroundColor: darkMode ? '#450a0a' : '#fee2e2',
            color: darkMode ? '#f87171' : '#b91c1c',
          }}
        >
          <X className="w-3 h-3" />
          Reset
        </button>
      )}
      </div>

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
