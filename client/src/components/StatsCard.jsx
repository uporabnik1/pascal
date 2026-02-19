import React from 'react';

export default function StatsCard({ title, value, icon: Icon, trend }) {
    return (
        <div className="bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-[24px] p-6 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-inner">
                    <Icon className="w-6 h-6 text-cta" />
                </div>
                {trend && (
                    <span className="text-xs font-bold text-teal bg-teal/10 px-2 py-1 rounded-full">{trend}</span>
                )}
            </div>
            <div>
                <h3 className="text-muted text-sm font-bold uppercase tracking-wider mb-1">{title}</h3>
                <p className="text-3xl font-display font-bold text-navy">{value}</p>
            </div>
        </div>
    );
}
