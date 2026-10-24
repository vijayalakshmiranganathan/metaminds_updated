import React, { useState } from 'react';
import { Appointment, Doctor, HomeLabTest } from '../../types/clinical';
import { DOCTORS_DATA, HOME_LAB_TESTS_DATA } from '../../data/portalData';
import { LanguageCode, getTranslation } from '../../utils/i18n';

interface AppointmentsScreenProps {
  appointments: Appointment[];
  language: LanguageCode;
  activeMemberName?: string;
  onBookAppointment: (apt: Omit<Appointment, 'id' | 'calendarSynced'>) => void;
  onCancelAppointment: (id: string) => void;
  onBookHomeLab: (test: HomeLabTest, date: string, slot: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
}

export const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({
  appointments,
  language,
  activeMemberName,
  onBookAppointment,
  onCancelAppointment,
  onBookHomeLab,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'doctors' | 'my-appointments' | 'home-lab'>('doctors');
  const [searchDoctor, setSearchDoctor] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  // Booking modal state
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingMode, setBookingMode] = useState<'In-Person Clinic' | 'Video Consultation'>('In-Person Clinic');
  const [symptomsInput, setSymptomsInput] = useState('');

  // Home lab booking modal
  const [selectedLabTest, setSelectedLabTest] = useState<HomeLabTest | null>(null);
  const [labDate, setLabDate] = useState('Tomorrow');
  const [labSlot, setLabSlot] = useState('07:30 AM - 08:30 AM (Fasting)');

  const t = (k: string) => getTranslation(language, k);

  const specialties = ['All', 'Cardiologist', 'General Physician & Internist', 'Endocrinologist & Diabetologist', 'Neurologist'];
  const locations = ['All', 'Mumbai', 'Bengaluru', 'Ahmedabad', 'Chennai'];

  const filteredDoctors = DOCTORS_DATA.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchDoctor.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchDoctor.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchDoctor.toLowerCase());

    const matchesSpec = selectedSpecialty === 'All' || doc.specialty.includes(selectedSpecialty);
    const matchesLoc = selectedLocation === 'All' || doc.location.includes(selectedLocation);

    return matchesSearch && matchesSpec && matchesLoc;
  });

  const handleConfirmDoctorBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoctor || !selectedSlot) return;

    onBookAppointment({
      doctorId: bookingDoctor.id,
      doctorName: bookingDoctor.name,
      specialty: bookingDoctor.specialty,
      hospital: bookingDoctor.hospital,
      location: bookingDoctor.location,
      date: selectedSlot.split(' ')[0],
      time: selectedSlot.split(' ').slice(1).join(' '),
      mode: bookingMode,
      status: 'Confirmed',
      symptoms: symptomsInput.trim() || 'General health consultation',
      fee: bookingDoctor.fee,
    });

    setBookingDoctor(null);
    setSymptomsInput('');
    setActiveTab('my-appointments');
    onShowToast(`Appointment confirmed with ${bookingDoctor.name}! Added to your schedule.`);
  };

  const handleDownloadCalendar = (apt: Appointment) => {
    // Generate .ics standard file content for Google/Apple Calendar
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Medisync Health//Appointments//EN
BEGIN:VEVENT
SUMMARY:Doctor Appointment: ${apt.doctorName} (${apt.specialty})
DESCRIPTION:Medisync Appointment at ${apt.hospital}. Symptoms: ${apt.symptoms}. Mode: ${apt.mode}
LOCATION:${apt.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Medisync_${apt.doctorName.replace(/[^a-zA-Z]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast(`Synced with Calendar: downloaded .ics file for Google / Apple Calendar`);
  };

  const handleConfirmLabBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLabTest) return;

    onBookHomeLab(selectedLabTest, labDate, labSlot);
    setSelectedLabTest(null);
    onShowToast(`Home Lab Sample booked for ${selectedLabTest.name}! Phlebotomist assigned.`);
  };

  return (
    <div className="flex flex-col w-full pb-8 px-3 pt-3 space-y-3 text-xs">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#004357]">{t('appointments')}</h1>
          <p className="text-xs text-[#40484c]">
            Doctor Discovery, Home Lab Tests & Calendar Sync
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-[#e5eeff] text-[#004357] font-bold text-xs flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px] text-[#006141]">verified</span>
          Verified Specialists
        </span>
      </div>

      {/* Segmented Sub Tabs */}
      <div className="bg-[#dce9ff] p-1 rounded-xl flex items-center justify-between gap-1 shadow-inner">
        <button
          onClick={() => setActiveTab('doctors')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all ${
            activeTab === 'doctors'
              ? 'bg-white text-[#004357] shadow-xs'
              : 'text-[#40484c] hover:text-[#0b1c30]'
          }`}
        >
          Find Doctors
        </button>
        <button
          onClick={() => setActiveTab('my-appointments')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all relative ${
            activeTab === 'my-appointments'
              ? 'bg-white text-[#004357] shadow-xs'
              : 'text-[#40484c] hover:text-[#0b1c30]'
          }`}
        >
          My Bookings ({appointments.length})
        </button>
        <button
          onClick={() => setActiveTab('home-lab')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all ${
            activeTab === 'home-lab'
              ? 'bg-white text-[#004357] shadow-xs'
              : 'text-[#40484c] hover:text-[#0b1c30]'
          }`}
        >
          Home Lab Tests
        </button>
      </div>

      {/* TAB 1: FIND DOCTORS */}
      {activeTab === 'doctors' && (
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#70787d] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchDoctor}
              onChange={(e) => setSearchDoctor(e.target.value)}
              placeholder="Search by doctor name, specialty, or clinic..."
              className="w-full h-11 pl-10 pr-4 text-xs bg-white border border-[#dce9ff] rounded-xl shadow-xs focus:outline-hidden focus:border-[#006398] focus:ring-2 focus:ring-[#5bb8fe]/30"
            />
          </div>

          {/* Specialty Filter Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  selectedSpecialty === spec
                    ? 'bg-[#004357] text-white shadow-xs'
                    : 'bg-white text-[#40484c] border border-[#e5eeff] hover:bg-[#eff4ff]'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Doctors List */}
          <div className="space-y-2.5">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="p-3 rounded-xl bg-white border border-[#e5eeff] shadow-xs flex flex-col gap-2.5 hover:border-[#93ccff] transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <img
                      src={doc.photoUrl}
                      alt={doc.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#dce9ff] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 flex-wrap">
                        <h2 className="font-bold text-sm text-[#0b1c30] truncate">{doc.name}</h2>
                        <span className="px-1.5 py-0.2 rounded-md bg-[#e5eeff] text-[#004357] font-bold text-[10px]">
                          ★ {doc.rating}
                        </span>
                      </div>
                      <div className="text-[#006398] font-semibold text-[11px] mt-0.5">
                        {doc.specialty} • {doc.experience}
                      </div>
                      <div className="text-[11px] text-[#40484c] flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[13px] text-[#70787d]">location_on</span>
                        <span>{doc.hospital}, {doc.location}</span>
                      </div>
                      <div className="text-[10px] text-[#70787d] mt-0.5">
                        Languages: {doc.languages.join(', ')}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-[#70787d] block">Consultation Fee</span>
                    <strong className="text-sm text-[#004357] font-bold">₹{doc.fee}</strong>
                  </div>
                </div>

                {/* Slots Carousel & Booking CTA */}
                <div className="pt-2 border-t border-[#f0f4ff] flex items-center justify-between gap-2">
                  <div className="text-[11px] text-[#006141] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    <span>Next Slot: {doc.availableSlots[0]}</span>
                  </div>
                  <button
                    onClick={() => {
                      setBookingDoctor(doc);
                      setSelectedSlot(doc.availableSlots[0]);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-98 transition-all"
                  >
                    <span>Book Visit</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MY BOOKINGS */}
      {activeTab === 'my-appointments' && (
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#e5eeff] text-[#70787d]">
              <span className="material-symbols-outlined text-4xl text-[#93ccff] block mb-2">event_busy</span>
              <p className="font-semibold text-xs">No scheduled doctor appointments.</p>
              <button
                onClick={() => setActiveTab('doctors')}
                className="mt-3 px-4 py-2 rounded-xl bg-[#004357] text-white font-bold text-xs"
              >
                Find & Book a Doctor
              </button>
            </div>
          ) : (
            appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-3.5 rounded-xl bg-white border border-[#e5eeff] shadow-xs flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#cce5ff] text-[#001d31] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">stethoscope</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-sm text-[#0b1c30]">{apt.doctorName}</h2>
                      <div className="text-[11px] text-[#006398] font-semibold">{apt.specialty}</div>
                      <div className="text-[10px] text-[#40484c]">{apt.hospital} • {apt.location}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-[10px] font-bold">
                    {apt.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#eff4ff] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006398] text-[18px]">schedule</span>
                    <div>
                      <strong className="text-xs text-[#0b1c30] block">{apt.date} at {apt.time}</strong>
                      <span className="text-[10px] text-[#70787d]">{apt.mode}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#004357]">₹{apt.fee}</span>
                </div>

                {apt.symptoms && (
                  <div className="text-[11px] text-[#40484c] italic">
                    Reason / Symptoms: “{apt.symptoms}”
                  </div>
                )}

                {/* Calendar Sync & Actions */}
                <div className="pt-2 border-t border-[#f0f4ff] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleDownloadCalendar(apt)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#e5eeff] hover:bg-[#dce9ff] text-[#004357] font-semibold text-[11px] flex items-center gap-1 transition-colors"
                    title="Export .ics to Apple Calendar or Google Calendar"
                  >
                    <span className="material-symbols-outlined text-[15px]">event</span>
                    <span>Sync with Phone Calendar</span>
                  </button>

                  <button
                    onClick={() => {
                      onCancelAppointment(apt.id);
                      onShowToast(`Appointment with ${apt.doctorName} cancelled.`);
                    }}
                    className="text-[#ba1a1a] font-semibold text-[11px] hover:underline"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: HOME LAB TESTS */}
      {activeTab === 'home-lab' && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-[#e5eeff] border border-[#93ccff] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006398] text-[22px]">home_health</span>
              <div>
                <strong className="text-xs text-[#004357] block">NABL Accredited Diagnostics at Home</strong>
                <span className="text-[10px] text-[#40484c]">Free phlebotomist home visit • Digital reports in 6-24 hrs</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {HOME_LAB_TESTS_DATA.map((lab) => (
              <div
                key={lab.id}
                className="p-3 rounded-xl bg-white border border-[#e5eeff] shadow-xs flex flex-col gap-2 hover:border-[#93ccff] transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-bold text-sm text-[#0b1c30]">{lab.name}</h2>
                      {lab.popular && (
                        <span className="px-1.5 py-0.2 rounded bg-[#ffdad6] text-[#93000a] text-[9px] font-bold uppercase">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#006398] font-semibold mt-0.5">
                      {lab.category} • {lab.sampleType}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-[#004357]">₹{lab.price}</span>
                    <span className="text-[10px] text-[#70787d] block">Includes visit</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#40484c] leading-relaxed">
                  {lab.description}
                </p>

                <div className="pt-2 border-t border-[#f0f4ff] flex items-center justify-between">
                  <div className="text-[10px] text-[#70787d] flex items-center gap-2">
                    <span>⚡ Report in {lab.reportHours}h</span>
                    {lab.fastingRequired && <span className="text-[#ba1a1a] font-semibold">⚠️ Fasting Req.</span>}
                  </div>
                  <button
                    onClick={() => setSelectedLabTest(lab)}
                    className="px-3 py-1.5 rounded-lg bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                  >
                    <span>Book Home Visit</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOCTOR BOOKING MODAL */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col overflow-hidden">
            <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-[#004357]">Schedule Doctor Appointment</h2>
                <p className="text-xs text-[#40484c]">
                  {bookingDoctor.name} • {bookingDoctor.specialty} {activeMemberName ? `(Patient: ${activeMemberName})` : ''}
                </p>
              </div>
              <button
                onClick={() => setBookingDoctor(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#70787d] hover:bg-[#dce9ff]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmDoctorBooking} className="p-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Consultation Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingMode('In-Person Clinic')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      bookingMode === 'In-Person Clinic'
                        ? 'bg-[#eff4ff] border-[#006398] text-[#004357]'
                        : 'bg-white border-[#bfc8cd] text-[#40484c]'
                    }`}
                  >
                    🏥 In-Person Clinic
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingMode('Video Consultation')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      bookingMode === 'Video Consultation'
                        ? 'bg-[#eff4ff] border-[#006398] text-[#004357]'
                        : 'bg-white border-[#bfc8cd] text-[#40484c]'
                    }`}
                  >
                    📹 Video Consultation
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Available Time Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {bookingDoctor.availableSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded-lg text-[11px] font-semibold border text-center transition-all ${
                        selectedSlot === slot
                          ? 'bg-[#004357] text-white border-[#004357]'
                          : 'bg-white text-[#40484c] border-[#bfc8cd] hover:bg-[#eff4ff]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Symptoms or Reason for Visit</label>
                <textarea
                  rows={2}
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  placeholder="e.g., Blood pressure checkup, recurring dizziness, medication review..."
                  className="w-full p-2.5 bg-[#eff4ff] border border-[#bfc8cd] rounded-xl text-xs"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#eff4ff] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#70787d] block">Consultation Fee</span>
                  <strong className="text-sm text-[#004357]">₹{bookingDoctor.fee}</strong>
                </div>
                <span className="text-[10px] text-[#006141] font-semibold">Pay online or at clinic</span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#e5eeff]">
                <button
                  type="button"
                  onClick={() => setBookingDoctor(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#bfc8cd] text-[#40484c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs"
                >
                  Confirm & Sync Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HOME LAB BOOKING MODAL */}
      {selectedLabTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col overflow-hidden">
            <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-[#004357]">Book Home Sample Collection</h2>
                <p className="text-xs text-[#40484c]">{selectedLabTest.name}</p>
              </div>
              <button
                onClick={() => setSelectedLabTest(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#70787d] hover:bg-[#dce9ff]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmLabBooking} className="p-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Select Day</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Today', 'Tomorrow', 'Day After'].map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setLabDate(d)}
                      className={`p-2 rounded-lg font-semibold border text-center transition-all ${
                        labDate === d
                          ? 'bg-[#004357] text-white border-[#004357]'
                          : 'bg-white text-[#40484c] border-[#bfc8cd]'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Preferred Time Window</label>
                <select
                  value={labSlot}
                  onChange={(e) => setLabSlot(e.target.value)}
                  className="w-full h-10 px-3 bg-[#eff4ff] border border-[#bfc8cd] rounded-xl text-xs"
                >
                  <option value="07:00 AM - 08:00 AM (Fasting)">07:00 AM - 08:00 AM (Fasting Recommended)</option>
                  <option value="08:00 AM - 09:00 AM (Fasting)">08:00 AM - 09:00 AM (Fasting)</option>
                  <option value="09:30 AM - 10:30 AM">09:30 AM - 10:30 AM (General)</option>
                  <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM (Evening)</option>
                </select>
              </div>

              <div className="p-2.5 rounded-xl bg-[#eff4ff] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#70787d] block">Total Package Fee</span>
                  <strong className="text-sm text-[#004357]">₹{selectedLabTest.price}</strong>
                </div>
                <span className="text-[10px] text-[#006141] font-semibold">Home visit included</span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#e5eeff]">
                <button
                  type="button"
                  onClick={() => setSelectedLabTest(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#bfc8cd] text-[#40484c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs"
                >
                  Book Phlebotomist Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
