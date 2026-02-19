import React from 'react';
import { X, Instagram, Calendar, Mail, Ruler, Weight, User, Check, Archive } from 'lucide-react';

export default function DetailModal({ data, onClose, onUpdateStatus }) {
    if (!data) return null;

    const isApplicant = !data.status || data.status === 'applicant';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-[#FBF8F2] w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[32px] shadow-2xl flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-navy">
                    <X className="w-5 h-5" />
                </button>

                {/* Sidebar / Header Area */}
                <div className="w-full md:w-1/3 bg-white p-8 border-r border-gray-100 flex flex-col">
                    <div className="mb-8 text-center md:text-left">
                        <div className="w-20 h-20 bg-navy text-white rounded-2xl flex items-center justify-center text-3xl font-display font-bold mb-4 mx-auto md:mx-0 shadow-lg shadow-navy/20">
                            {data.fullName.charAt(0)}
                        </div>
                        <h2 className="text-2xl font-display font-bold text-navy leading-tight mb-1">{data.fullName}</h2>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-muted text-sm mb-4">
                            <Mail className="w-3 h-3" />
                            {data.email}
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <Badge icon={Ruler} label={`${data.height} cm`} />
                            <Badge icon={Weight} label={`${data.weight} kg`} />
                            <Badge icon={User} label={`${data.age} let`} />
                        </div>
                    </div>

                    <div className="mt-auto hidden md:block space-y-3">
                        {data.status === 'active' ? (
                            <div className="w-full py-3 bg-teal/10 text-teal rounded-xl font-bold flex items-center justify-center gap-2">
                                <Check className="w-4 h-4" />
                                Aktivna Stranka
                            </div>
                        ) : (
                            <button
                                onClick={() => onUpdateStatus(data.id, 'active')}
                                className="w-full py-3 bg-teal text-white rounded-xl font-bold hover:bg-teal/90 transition-colors flex items-center justify-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                {data.status === 'archived' ? 'Ponovno aktiviraj' : 'Sprejmi v Coaching'}
                            </button>
                        )}

                        {data.status !== 'archived' && (
                            <button
                                onClick={() => onUpdateStatus(data.id, 'archived')}
                                className="w-full py-3 bg-gray-100 text-muted rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <Archive className="w-4 h-4" />
                                Arhiviraj
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content Scrollable */}
                <div className="w-full md:w-2/3 overflow-y-auto p-8 bg-paper">
                    <div className="space-y-8">
                        {/* Intro Mobile Only */}
                        <div className="md:hidden space-y-3 mb-6">
                            {data.status === 'active' ? (
                                <div className="w-full py-3 bg-teal/10 text-teal rounded-xl font-bold flex items-center justify-center gap-2">
                                    <Check className="w-4 h-4" />
                                    Aktivna Stranka
                                </div>
                            ) : (
                                <button
                                    onClick={() => onUpdateStatus(data.id, 'active')}
                                    className="w-full py-3 bg-teal text-white rounded-xl font-bold hover:bg-teal/90 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    {data.status === 'archived' ? 'Ponovno aktiviraj' : 'Sprejmi v Coaching'}
                                </button>
                            )}
                            {data.status !== 'archived' && (
                                <button
                                    onClick={() => onUpdateStatus(data.id, 'archived')}
                                    className="w-full py-3 bg-gray-100 text-muted rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Archive className="w-4 h-4" />
                                    Arhiviraj
                                </button>
                            )}
                        </div>

                        <div className="md:hidden p-4 bg-orange-50 rounded-2xl border border-orange-100">
                            <div className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">Cilj</div>
                            <div className="font-display font-bold text-navy text-lg">{data.goal}</div>
                        </div>

                        <Section title="Motivacija & Timeline">
                            <Field label="Zakaj zdaj?" value={data.whyNow} full />
                            <Field label="Timeline" value={data.timeline} />
                        </Section>

                        <Section title="Trening & Aktivnost">
                            <Field label="Pogostost" value={data.trainPerWeek} />
                            <Field label="Lokacija" value={data.whereTrain} />
                            <Field label="Izkušnje" value={data.experience} />
                            <Field label="Koraki/dan" value={data.stepsDaily} />
                            <Field label="Delo" value={data.workType} />
                            <Field label="Trajanje treninga" value={data.timePerSession} />
                        </Section>

                        <Section title="Prehrana & Navade">
                            <Field label="Sledenje" value={data.trackMacros} />
                            <Field label="Obroki" value={data.meals} />
                            <Field label="Problem" value={data.biggestIssue} />
                            <Field label="Voda" value={data.water} />
                            <Field label="Omejitve" value={data.limits || '/'} />
                        </Section>

                        <Section title="Logistika & Pričakovanja">
                            <Field label="Dnevi" value={data.days} />
                            <Field label="Zoom" value={data.zoom} />
                            <Field label="Pripravljenost" value={`${data.ready}/10`} />
                            <Field label="Slike" value={data.photos} />
                            <Field label="Instagram" value={data.instagram || '/'} />
                        </Section>

                        <div className="grid grid-cols-1 gap-4">
                            <BigField title="Pričakovanja od trenerja" value={data.expectCoach} />
                            <BigField title="Največje ovire (Blockers)" value={data.blocker} />
                            {data.extra && <BigField title="Dodatno" value={data.extra} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Badge = ({ icon: Icon, label }) => (
    <span className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-md text-xs font-bold text-navy">
        <Icon className="w-3 h-3 text-teal" />
        {label}
    </span>
);

const Section = ({ title, children }) => (
    <div className="pb-6 border-b border-gray-200/50 last:border-0 last:pb-0">
        <h3 className="text-xs font-bold uppercase tracking-widest text-teal mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal"></span>
            {title}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
            {children}
        </div>
    </div>
);

const Field = ({ label, value, full }) => (
    <div className={full ? "col-span-full" : ""}>
        <div className="text-[10px] uppercase font-bold text-muted mb-1 tracking-wide">{label}</div>
        <div className="font-medium text-navy">{value}</div>
    </div>
);

const BigField = ({ title, value }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="text-xs font-bold text-navy mb-2 uppercase tracking-wide">{title}</div>
        <div className="text-sm text-gray-600 leading-relaxed">{value}</div>
    </div>
);
