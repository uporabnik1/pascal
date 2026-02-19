import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function ApplicantCard({ data, onClick }) {
    return (
        <div
            onClick={onClick}
            className="group relative bg-white/60 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-2xl hover:bg-white/90 rounded-[20px] p-5 cursor-pointer transition-all duration-300 flex flex-col gap-4"
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold font-display text-lg">
                        {data.fullName.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-navy text-lg leading-tight group-hover:text-cta transition-colors">
                            {data.fullName}
                        </h3>
                        <p className="text-xs text-muted font-medium">{data.email}</p>
                    </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted bg-gray-100 px-2 py-1 rounded-full">
                    {new Date(data.timestamp).toLocaleDateString()}
                </span>
            </div>

            <div className="bg-paper/50 rounded-xl p-3 border border-dashed border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal"></span>
                    <span className="font-semibold">{data.goal}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted">
                    <div>Shoulder: {data.weight}kg</div>
                    <div>Height: {data.height}cm</div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100/50">
                <span className="text-xs font-bold text-muted flex items-center gap-1">
                    {data.age} let
                </span>
                <button className="w-8 h-8 rounded-full bg-orange-50 text-cta flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
