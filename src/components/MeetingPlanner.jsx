// src/components/MeetingPlanner.jsx
import { useState, useEffect, useRef } from 'react';
import { DateTime, IANAZone } from 'luxon';
import { zoneAliases } from '../../public/zoneAliases.js';

export default function MeetingPlanner() {
  const [participants, setParticipants] = useState([
    { name: 'You/Host', zone: 'Asia/Colombo', start: 9, end: 17 },
    { name: 'Participant', zone: 'America/New_York', start: 9, end: 17 },
  ]);
  const [selectedDate, setSelectedDate] = useState(DateTime.now().toISODate());
  const [popupMessages, setPopupMessages] = useState({});
  const [showOnlyGreen, setShowOnlyGreen] = useState(false);
  const [interval, setInterval] = useState(60);
  const [dates, setDates] = useState([DateTime.now().toISODate()]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const bestSlotRef = useRef(null);

 // useState section
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDesc, setMeetingDesc] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingID, setMeetingID] = useState('');
  const [meetingPass, setMeetingPass] = useState('');
  const [host, setHost] = useState('');
  const [contactHost, setContactHost] = useState('');
  const [copyStatus, setCopyStatus] = useState('📋 Copy');


  useEffect(() => {
    const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    setParticipants((parts) => {
      const updated = [...parts];
      if (updated.length > 0) updated[0].zone = userZone;
      return updated;
    });
  }, []);

  useEffect(() => {
    setDates([selectedDate]);
  }, [selectedDate]);

  const capitalize = (s) =>
    typeof s === 'string' && s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
  const pad = (n) => n.toString().padStart(2, '0');
  const isValidZone = (zone) => IANAZone.isValidZone(zone);

  const addParticipant = () => {
    setParticipants([...participants, { name: '', zone: 'UTC', start: 9, end: 17 }]);
  };

  const updateParticipant = (index, key, value) => {
    const updated = [...participants];
    if (key === 'zone') {
      const input = value.trim().toLowerCase();
      if (zoneAliases[input]) {
        const canonicalZone = zoneAliases[input];
        updated[index][key] = canonicalZone;
        setPopupMessages((msgs) => ({ ...msgs, [index]: `${capitalize(input)} uses ${canonicalZone} time` }));
        setTimeout(() => {
          setPopupMessages((msgs) => {
            const copy = { ...msgs };
            delete copy[index];
            return copy;
          });
        }, 5000);
      } else if (isValidZone(value)) {
        updated[index][key] = value;
      } else {
        updated[index][key] = value;
      }
    } else if (key === 'start' || key === 'end') {
      updated[index][key] = parseInt(value);
    } else {
      updated[index][key] = value;
    }
    setParticipants(updated);
  };

  const removeParticipant = (index) => {
    const updated = [...participants];
    updated.splice(index, 1);
    setParticipants(updated);
    setPopupMessages((msgs) => {
      const copy = { ...msgs };
      delete copy[index];
      return copy;
    });
  };

  const scrollToBestSlot = () => {
    if (bestSlotRef.current) bestSlotRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };


  const toggleSlotSelection = (slotId) => {
    setSelectedSlots([slotId]); // only one slot allowed
  };

  const openSchedulePopup = () => setShowSchedulePopup(true);
  const closeSchedulePopup = () => setShowSchedulePopup(false);

  const copyToClipboard = async () => {
  const index = parseInt(selectedSlots[0]?.split('-')[1]);
  const baseTime = DateTime.fromISO(`${selectedDate}T00:00`, { zone: 'UTC' }).plus({ minutes: index * interval });

  const timeBlock = `${baseTime.toFormat('cccc, LLL dd')} at ${baseTime.toFormat('HH:mm')} UTC`;
  const participantTimes = participants.map((p) => {
    const local = baseTime.setZone(p.zone);
    return `${p.name}: ${local.toFormat('yyyy-MM-dd hh:mm a')} (${p.zone})`;
  }).join('\n');

  const message = `✨ Invitation to Scheduled Meeting. \n\n📅 ${meetingTitle || 'Meeting'}\n\n📝 ${meetingDesc || 'No description.'}\n\n🕒 Time:\n${timeBlock}\n${participantTimes}\n\n🔗 Link: ${meetingLink || '-'}\n🆔 ID: ${meetingID || '-'}\n🔐 Passcode: ${meetingPass || '-'}\n\n Contact Host for Details :)\n ${host || 'name'} => ${contactHost || '-'}`;

  try {
    await navigator.clipboard.writeText(message);
    setCopyStatus('✅ Copied!');
    setTimeout(() => setCopyStatus('📋 Copy'), 5000);
  } catch (err) {
    console.error('Copy failed:', err);
  }
};


  const getMessage = () => {
  const index = parseInt(selectedSlots[0]?.split('-')[1]);
  const baseTime = DateTime.fromISO(`${selectedDate}T00:00`, { zone: 'UTC' }).plus({ minutes: index * interval });
  const timeBlock = `${baseTime.toFormat('cccc, LLL dd')} at ${baseTime.toFormat('HH:mm')} UTC`;
  const participantTimes = participants.map((p) => {
    const local = baseTime.setZone(p.zone);
    return `${p.name}: ${local.toFormat('yyyy-MM-dd hh:mm a')} (${p.zone})`;
  }).join('\n');

  return `✨ Invitation to Scheduled Meeting. \n\n📅 ${meetingTitle || 'Meeting'}\n\n📝 ${meetingDesc || 'No description.'}\n\n🕒 Time:\n${timeBlock}\n${participantTimes}\n\n🔗 Link: ${meetingLink || '-'}\n🆔 ID: ${meetingID || '-'}\n🔐 Passcode: ${meetingPass || '-'}\n\n Contact Host for Details :)\n ${host || 'name'} => ${contactHost || '-'}`;
};

const shareViaEmail = () => {
  const msg = encodeURIComponent(getMessage());
  window.open(`mailto:?subject=Meeting Invite&body=${msg}`);
};

const shareViaWhatsApp = () => {
  const msg = encodeURIComponent(getMessage());
  window.open(`https://wa.me/?text=${msg}`);
};

const shareViaTelegram = () => {
  const msg = encodeURIComponent(getMessage());
  window.open(`https://t.me/share/url?url=${msg}`);
};


 // Calendar integration
  const handleExportICS = () => {
  if (!selectedSlots.length) return;
  const index = parseInt(selectedSlots[0].split('-')[1]);
  const baseTimeUTC = DateTime.fromISO(`${selectedDate}T00:00`, { zone: 'UTC' }).plus({ minutes: index * interval });

  const title = document.querySelector('input[placeholder="Meeting Title"]')?.value || "Online Meeting";
  const description = document.querySelector('textarea[placeholder="Description"]')?.value || "";
  const link = document.querySelector('input[placeholder="Meeting Link (Zoom, Google Meet etc.)"]')?.value || "";

  const start = baseTimeUTC.toFormat("yyyyMMdd'T'HHmmss'Z'");
  const end = baseTimeUTC.plus({ minutes: interval }).toFormat("yyyyMMdd'T'HHmmss'Z'");

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}\\n${link}
DTSTART:${start}
DTEND:${end}
LOCATION:${link}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT10M
DESCRIPTION:Reminder
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replaceAll(' ', '_')}.ics`;
  a.click();

  URL.revokeObjectURL(url);
};

const handleExportGoogleCal = () => {
  if (!selectedSlots.length) return;
  const index = parseInt(selectedSlots[0].split('-')[1]);
  const baseTimeUTC = DateTime.fromISO(`${selectedDate}T00:00`, { zone: 'UTC' }).plus({ minutes: index * interval });

  const title = document.querySelector('input[placeholder="Meeting Title"]')?.value || "Online Meeting";
  const description = document.querySelector('textarea[placeholder="Description"]')?.value || "";
  const link = document.querySelector('input[placeholder="Meeting Link (Zoom, Google Meet etc.)"]')?.value || "";

  const start = baseTimeUTC.toFormat("yyyyMMdd'T'HHmmss'Z'");
  const end = baseTimeUTC.plus({ minutes: interval }).toFormat("yyyyMMdd'T'HHmmss'Z'");

  const googleCalURL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description + '\n' + link)}&dates=${start}/${end}&location=${encodeURIComponent(link)}`;
  window.open(googleCalURL, '_blank');
};

  const nowUTC = DateTime.utc().toFormat('HH:mm');

  return (
    <div className="p-6 mx-auto bg-glass backdrop-blur-md rounded-xl shadow-glass border border-white/10 transition-all duration-500">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-6 items-start w-full">
          <div className="flex-1 space-y-4 w-full">
            <label className="text-yellow-900 dark:text-white font-medium mr-6">📅 Select Date: </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 rounded-lg border border-yellow-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-yellow-900 dark:text-gray-100"
            />

            {participants.map((p, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 relative w-full">
                <input type="text" placeholder="Name" value={p.name} onChange={(e) => updateParticipant(i, 'name', e.target.value)} className="border bg-white dark:bg-gray-900 border-yellow-300 dark:border-gray-700 text-yellow-900 dark:text-gray-100 p-2 rounded-lg w-full sm:w-32" />
                <input list={`zones-${i}`} value={p.zone} onChange={(e) => updateParticipant(i, 'zone', e.target.value)} className="w-full sm:w-56 p-2 rounded-lg bg-white dark:bg-gray-900 border border-yellow-300 dark:border-gray-700 text-yellow-900 dark:text-gray-100" spellCheck={false} />
                <datalist id={`zones-${i}`}>
                  {Object.entries(zoneAliases).map(([alias, canonicalZone]) => (
                    <option key={alias} value={alias}>{capitalize(alias)} ({canonicalZone})</option>
                  ))}
                </datalist>
                {popupMessages[i] && (
                  <div className="absolute bg-black/90 dark:bg-gray-100 text-gray-100 dark:text-black text-sm font-semibold rounded-lg py-2 px-3 left-0 top-full mt-1 whitespace-nowrap shadow-lg z-10" style={{ animation: 'fadeOut 0.5s ease forwards', animationDelay: '3.5s' }}>{popupMessages[i]}</div>
                )}
                <button onClick={() => removeParticipant(i)} className="text-red-400 hover:underline sm:ml-2" title="Remove Participant">🗑️</button>
              </div>
            ))}

            <button className="bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-green-500 hover:dark:bg-green-600 dark:text-black/80 py-3 px-4 rounded-lg font-semibold" onClick={addParticipant}>➕ Add Participant</button>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <input type="checkbox" checked={showOnlyGreen} onChange={(e) => setShowOnlyGreen(e.target.checked)} className="peer h-5 w-5 cursor-pointer rounded shadow hover:shadow-md" />
              <label className="text-sm text-gray-700 dark:text-gray-200">Show only fully available (green) slots</label>
              <select value={interval} onChange={(e) => setInterval(parseInt(e.target.value))} className="ml-2 p-1 border rounded bg-white dark:bg-gray-800 text-sm">
                <option value={60}>Every 1 Hour</option>
                <option value={30}>Every 30 Minutes</option>
                <option value={15}>Every 15 Minutes</option>
              </select>
              <button onClick={scrollToBestSlot} className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">⬇️ Scroll to Best Slot</button>
            </div>
          </div>

          <details className="w-full md:w-64 mt-6 md:mt-0 bg-zinc-800 dark:bg-black/30 border border-yellow-300 dark:border-teal-700 rounded-lg p-4 text-sm text-gray-100 dark:text-gray-100">
            <summary className="cursor-pointer font-semibold mb-2">Why These Colours?</summary>
            <ul className="mt-2 space-y-1">
              <li><span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-2"></span> Everyone available</li>
              <li><span className="inline-block w-3 h-3 bg-yellow-300 rounded-full mr-2"></span> Some available</li>
              <li><span className="inline-block w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded-full mr-2"></span> None available</li>
              <li><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span> Current time (Your Zone)</li>
            </ul>
          </details>
        </div>

      <div className="overflow-x-auto mt-6 border border-gray-300 dark:border-gray-600 rounded-xl">
        <table className="min-w-[800px] w-full table-fixed text-sm text-left">
          <thead>
            <tr className="bg-gray-100 dark:bg-white/10 text-black dark:text-white font-semibold">
              <th className="p-3">Select</th>
              <th className="p-3">Time (UTC)</th>
              {participants.map((p, idx) => {
                const city = p.zone?.includes('/') ? p.zone.split('/')[1].replaceAll('_', ' ') : p.zone || 'Unknown';
                return <th key={idx} className="p-3">{`${p.name || 'Unknown'} (${capitalize(city)})`}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {dates.map(date =>
              Array.from({ length: (24 * 60) / interval }).map((_, i) => {
                const base = DateTime.fromISO(`${date}T00:00`, { zone: 'UTC' }).plus({ minutes: i * interval });
                const slotId = `${date}-${i}`;
                const userZone = participants[0]?.zone || 'UTC';
                  const now = DateTime.now().setZone(userZone);
                  const isToday = date === now.toISODate();
                  const isCurrentSlot =
                    isToday &&
                    now.hour === base.setZone(userZone).hour &&
                    now.minute >= base.setZone(userZone).minute &&
                    now.minute < base.setZone(userZone).minute + interval;

                const isAllAvailable = participants.every((p) => {
                  const local = isValidZone(p.zone) ? base.setZone(p.zone) : DateTime.invalid('Invalid');
                  const hour = local.hour + local.minute / 60;
                  return hour >= p.start && hour < p.end;
                });

                const isSomeAvailable = participants.some((p) => {
                  const local = isValidZone(p.zone) ? base.setZone(p.zone) : DateTime.invalid('Invalid');
                  const hour = local.hour + local.minute / 60;
                  return hour >= p.start && hour < p.end;
                });

                const rowBg = isAllAvailable
                  ? 'bg-green-200 dark:bg-green-500'
                  : isSomeAvailable
                  ? 'bg-yellow-100 dark:bg-yellow-500'
                  : 'bg-white/50 dark:bg-black/30';

                if (showOnlyGreen && !isAllAvailable) return null;

                return (
                  <tr
                    key={slotId}
                    ref={isAllAvailable && !bestSlotRef.current ? bestSlotRef : null}
                    className={`border-b border-gray-300 dark:border-gray-700 ${rowBg}`}
                  >
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedSlots.includes(slotId)}
                        onChange={() => toggleSlotSelection(slotId)}
                        className="w-4 h-4 rounded-lg"
                      />
                    </td>
                    <td className="p-2 font-medium text-gray-700 dark:text-white/80">
                      {base.toFormat('HH:mm')}
                      {isCurrentSlot && (
                          <div className="absolute left-0 top-1/2 w-full h-[2px] bg-red-500 animate-pulse rounded-full z-30" />
                        )}
                    </td>
                    {participants.map((p, idx) => {
                      const local = isValidZone(p.zone) ? base.setZone(p.zone) : DateTime.invalid('Invalid Zone');
                      const display = local.isValid ? local.toFormat('hh:mm a') : 'Invalid';
                      return (
                        <td key={idx} className="p-4 text-gray-600 dark:text-white/70 relative">{display}</td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedSlots.length > 0 && (
  <div className="text-center mt-4 flex flex-wrap gap-3 justify-center">
  <button
    onClick={openSchedulePopup}
    className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700"
  >
    📅 Schedule the Meeting
  </button>

  <div className="relative group">
    <button
      className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-700 flex items-center gap-2"
    >
      📥 Export to Calendar
      <svg
        className="w-4 h-4 transform transition-transform duration-300 group-hover:rotate-180"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      className="absolute right-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-xl scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transform transition-all duration-300 origin-top z-50"
    >
      <button
        onClick={handleExportICS}
        className="block w-full text-left px-5 py-3 hover:bg-yellow-100 dark:hover:bg-gray-700 text-sm"
      >
        🗓️ Download .ics File <span className="block text-xs text-gray-500">Works with Apple, Outlook, etc.</span>
      </button>
      <button
        onClick={handleExportGoogleCal}
        className="block w-full text-left px-5 py-3 hover:bg-yellow-100 dark:hover:bg-gray-700 text-sm"
      >
        🌐 Add to Google Calendar <span className="block text-xs text-gray-500">Open in new tab</span>
      </button>
    </div>
  </div>
</div>


)}


      {showSchedulePopup && (
        <div className="sticky z-50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-[#000] p-6 rounded-xl w-full max-w-2xl shadow-xl relative">
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Schedule Meeting</h2>
            <form className="space-y-6">
              <input
                type="text"
                placeholder="Meeting Title"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="w-full p-2 border-none rounded-xl bg-gray-100 dark:bg-[#111]"
              />
              <textarea
                  placeholder="Description"
                  value={meetingDesc}
                  onChange={(e) => setMeetingDesc(e.target.value)}
                  className="w-full p-2 rounded-xl border-none bg-gray-100 dark:bg-[#111]"
                />

              <div className="space-y-2">
                {selectedSlots.map((slotId, idx) => {
  const lastDash = slotId.lastIndexOf('-');
  const slotDate = slotId.slice(0, lastDash);       // e.g., "2025-06-18"
  const index = parseInt(slotId.slice(lastDash + 1)); // e.g., "6"
  const baseTime = DateTime.fromISO(`${slotDate}T00:00`, { zone: 'UTC' }).plus({ minutes: index * interval });

  return (
    <div key={idx} className="bg-gray-100 dark:bg-[#111] p-2 rounded-xl">
      <div className="font-medium">
  {baseTime.toFormat('ccc, LLL dd')} – {baseTime.toFormat('HH:mm')} UTC
</div>

      <ul className="text-sm mt-1 list-disc list-inside">
        {participants.map((p, i) => (
          <li key={i}>
            {p.name}: {baseTime.setZone(p.zone).toFormat('yyyy-MM-dd hh:mm a')} ({p.zone})
          </li>
        ))}
      </ul>
    </div>
  );
})}

              </div>

              <input
                type="text"
                placeholder="Meeting Link (Zoom, Google Meet etc.)"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="w-full p-2 rounded-xl border-none bg-gray-100 dark:bg-[#111]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Meeting ID"
                  value={meetingID}
                  onChange={(e) => setMeetingID(e.target.value)}
                  className="p-2 rounded-xl border-none bg-gray-100 dark:bg-[#111]"
                />
                <input
                    type="text"
                    placeholder="Passcode"
                    value={meetingPass}
                    onChange={(e) => setMeetingPass(e.target.value)}
                    className="p-2 rounded-xl border-none bg-gray-100 dark:bg-[#111]"
                  />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Host"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  className="p-2 rounded-xl border-none bg-gray-100 dark:bg-[#111]"
                />
                <input
                    type="text"
                    placeholder="Contact Host in-case"
                    value={contactHost}
                    onChange={(e) => setContactHost(e.target.value)}
                    className="p-2 rounded-xl border-none bg-gray-100 dark:bg-[#111]"
                  />
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <button type="button" onClick={shareViaEmail} className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700">📧 Email</button>
                <button type="button" onClick={shareViaWhatsApp} className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600">📲 WhatsApp</button>
                <button type="button" onClick={shareViaTelegram} className="bg-indigo-500 text-white px-3 py-2 rounded-lg hover:bg-indigo-600">📨 Telegram</button>

                <button
                  type="button"
                  id="copyBtn"
                  onClick={copyToClipboard}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                >
                  {copyStatus}
                </button>

              </div>
            </form>
            <button onClick={closeSchedulePopup} className="absolute top-2 right-4 text-red-600 hover:text-red-800 text-2xl font-bold">&times;</button>
          </div>
        </div>
      )}

      <style>{`
          @keyframes fadeOut {
            to {
              opacity: 0;
              transform: translateY(-5px);
            }
          }
        `}</style>
    </div>
  </div>
  );
}
