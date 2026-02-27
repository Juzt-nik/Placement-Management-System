import React from 'react';

// Stat Card
export function StatCard({ label, value, icon: Icon, color = 'blue', sub }) {
  const colors = {
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', value: 'text-blue-700' },
    green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-600', value: 'text-green-700' },
    orange: { bg: 'bg-orange-50', icon: 'bg-orange-100 text-orange-600', value: 'text-orange-700' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', value: 'text-purple-700' },
    indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100 text-indigo-600', value: 'text-indigo-700' },
  };
  const c = colors[color] || colors.blue;
  return (
    <div className={`${c.bg} rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
          <p className={`text-3xl font-black mt-1 tracking-tight ${c.value}`}>{value ?? '—'}</p>
          {sub && <p className="text-xs text-gray-400 font-medium mt-1">{sub}</p>}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.icon}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}

// Badge
export function Badge({ children, color = 'gray' }) {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    orange: 'bg-orange-100 text-orange-700',
    yellow: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700',
    indigo: 'bg-indigo-100 text-indigo-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Applied: 'blue', 'In Process': 'orange', Selected: 'green', Rejected: 'red',
    Placed: 'green', Unplaced: 'gray', Cleared: 'green', Eliminated: 'red',
    Pending: 'yellow', Submitted: 'blue', Verified: 'green', Active: 'green',
    Completed: 'green', Ongoing: 'blue',
  };
  return <Badge color={map[status] || 'gray'}>{status}</Badge>;
}

// Modal
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-900">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Form field
export function FormField({ label, error, children, required }) {
  return (
    <div>
      <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs font-medium mt-1">{error}</p>}
    </div>
  );
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-medium ${className}`}
      {...props}
    />
  );
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-medium ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

// Button
export function Button({ children, variant = 'primary', size = 'md', className = '', loading, ...props }) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/20',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'hover:bg-gray-100 text-gray-600',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    outline: 'border border-gray-200 hover:bg-gray-50 text-gray-700',
  };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-black rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  );
}

// Page Header
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-gray-500 font-medium mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// Empty state
export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="text-center py-16">
      {Icon && (
        <div className="inline-flex w-16 h-16 rounded-2xl bg-gray-100 items-center justify-center mb-4">
          <Icon size={28} className="text-gray-300" />
        </div>
      )}
      <p className="text-gray-600 font-black uppercase tracking-widest text-xs">{title}</p>
      {description && <p className="text-gray-400 text-sm font-medium mt-1">{description}</p>}
    </div>
  );
}

// Spinner
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

// Table
export function Table({ headers, children, className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {headers.map((h, i) => (
              <th key={i} className="text-left px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {children}
        </tbody>
      </table>
    </div>
  );
}

// Card
export function Card({ children, className = '', title, action }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// Search input
export function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all w-64 font-medium"
      />
    </div>
  );
}
