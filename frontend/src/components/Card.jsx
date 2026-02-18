import React from 'react';

export default function Card({ children, className = '', title, icon: Icon }) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
            {(title || Icon) && (
                <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3">
                    {Icon && <div className="p-2 bg-medical-50 rounded-lg text-medical-600"><Icon size={20} /></div>}
                    {title && <h3 className="font-semibold text-lg text-slate-800">{title}</h3>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
