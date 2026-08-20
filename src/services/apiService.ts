import { 
  DayAvailability, 
  BookingRecord, 
  CustomerInput, 
  SubscriberRecord,
  SystemSettings,
  AdminOverviewStats,
  DatabaseAuditStatus
} from '../types';

const API_BASE = '/api';

export async function fetchSystemSettings(): Promise<SystemSettings> {
  try {
    const res = await fetch(`${API_BASE}/system-settings`);
    if (res.ok) return await res.json();
    return { bookingsOpen: true, paymentRequired: true };
  } catch (err) {
    return { bookingsOpen: true, paymentRequired: true };
  }
}

export async function fetchDayAvailability(date: string): Promise<DayAvailability> {
  try {
    const res = await fetch(`${API_BASE}/availability?date=${encodeURIComponent(date)}`);
    if (res.ok) {
      return await res.json();
    }
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error || `Server error (${res.status})`);
  } catch (err: any) {
    console.warn('API call failed, fallback availability module active:', err.message);
    return getFallbackAvailability(date);
  }
}

export async function createBookingSession(input: CustomerInput & { date: string; slotId: number }): Promise<{ booking: BookingRecord; paymentIntent: any; paymentRequired: boolean }> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to complete booking request.');
  }

  return data;
}

export async function verifyBookingPayment(bookingReference: string, paymentId?: string, action: string = 'simulate_success'): Promise<{ success: boolean; booking: BookingRecord; verification: any }> {
  const res = await fetch(`${API_BASE}/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingReference, paymentId, action })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Payment verification failed.');
  }

  return data;
}

export async function subscribeToNewsletter(email: string): Promise<{ status: string; subscriber?: SubscriberRecord; message: string }> {
  const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to process newsletter subscription.');
  }

  return data;
}

export async function unsubscribeFromNewsletter(email: string): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}/newsletter/unsubscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to process unsubscribe request.');
  }

  return data;
}

// --- PROTECTED ADMIN API METHODS ---

export async function adminLogin(username: string, password: string): Promise<{ token: string; user: { username: string; role: string } }> {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Admin login failed.');
  }

  return data;
}

export async function verifyAdminSessionToken(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

export async function fetchAdminOverview(token: string): Promise<AdminOverviewStats> {
  const res = await fetch(`${API_BASE}/admin/overview`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch admin overview stats.');
  return data;
}

export async function updateAdminSystemSettings(token: string, updates: { bookingsOpen?: boolean; paymentRequired?: boolean }): Promise<SystemSettings> {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(updates)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update system settings.');
  return data.systemSettings;
}

export async function fetchAdminBookings(
  token: string, 
  filters: { date?: string; slotId?: string; status?: string; sessionType?: string; search?: string } = {}
): Promise<BookingRecord[]> {
  const query = new URLSearchParams();
  if (filters.date) query.set('date', filters.date);
  if (filters.slotId) query.set('slotId', filters.slotId);
  if (filters.status) query.set('status', filters.status);
  if (filters.sessionType) query.set('sessionType', filters.sessionType);
  if (filters.search) query.set('search', filters.search);

  const res = await fetch(`${API_BASE}/admin/bookings?${query.toString()}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch admin bookings list.');
  return data.bookings;
}

export async function updateAdminBookingStatus(
  token: string, 
  reference: string, 
  updates: { status?: string; paymentStatus?: string }
): Promise<BookingRecord> {
  const res = await fetch(`${API_BASE}/admin/bookings/${encodeURIComponent(reference)}`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(updates)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update booking status.');
  return data.booking;
}

export async function deleteAdminBooking(token: string, reference: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/admin/bookings/${encodeURIComponent(reference)}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete booking.');
  return data.success;
}

export async function fetchAdminSubscribers(token: string): Promise<SubscriberRecord[]> {
  const res = await fetch(`${API_BASE}/admin/subscribers`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch subscribers.');
  return data.subscribers;
}

export async function deleteAdminSubscriber(token: string, email: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/admin/subscribers/${encodeURIComponent(email)}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to remove subscriber.');
  return data.success;
}

export async function fetchAdminDatabaseStatus(token: string): Promise<DatabaseAuditStatus> {
  const res = await fetch(`${API_BASE}/admin/database-status`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch database status.');
  return data;
}

// Fallback client availability when API server is unreachable
function getFallbackAvailability(date: string): DayAvailability {
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();

  const isClosed = dayOfWeek === 1;

  const defaultSlots = [
    { slotId: 1, name: 'Slot 1', time: '7:00 AM – 8:00 AM', sessionType: 'solar' as const, maxGroups: 3, maxPeoplePerGroup: 5, bookedGroups: 1, remainingSlots: 2, isFullyBooked: false },
    { slotId: 2, name: 'Slot 2', time: '8:00 AM – 9:00 AM', sessionType: 'solar' as const, maxGroups: 3, maxPeoplePerGroup: 5, bookedGroups: 2, remainingSlots: 1, isFullyBooked: false },
    { slotId: 3, name: 'Slot 3', time: '9:00 AM – 10:00 AM', sessionType: 'solar' as const, maxGroups: 3, maxPeoplePerGroup: 5, bookedGroups: 3, remainingSlots: 0, isFullyBooked: true },
    { slotId: 4, name: 'Slot 4', time: '8:30 PM – 9:30 PM', sessionType: 'night' as const, maxGroups: 3, maxPeoplePerGroup: 5, bookedGroups: 0, remainingSlots: 3, isFullyBooked: false },
    { slotId: 5, name: 'Slot 5', time: '9:30 PM – 10:30 PM', sessionType: 'night' as const, maxGroups: 3, maxPeoplePerGroup: 5, bookedGroups: 1, remainingSlots: 2, isFullyBooked: false },
    { slotId: 6, name: 'Slot 6', time: '10:30 PM – 11:30 PM', sessionType: 'night' as const, maxGroups: 3, maxPeoplePerGroup: 5, bookedGroups: 2, remainingSlots: 1, isFullyBooked: false }
  ];

  return {
    date,
    status: isClosed ? 'CLOSED' : 'OPEN',
    statusNote: isClosed ? 'Observatory closed on Mondays for optical instrument calibration and deck maintenance.' : 'Conditions suitable for astronomical observation.',
    weatherSummary: {
      cloudCover: isClosed ? 85 : 15,
      windSpeed: 12,
      weatherCode: isClosed ? 3 : 0,
      conditionText: isClosed ? 'Overcast Sky' : 'Clear Sky',
      temperature: 24
    },
    slots: isClosed ? defaultSlots.map(s => ({ ...s, bookedGroups: 3, remainingSlots: 0, isFullyBooked: true })) : defaultSlots,
    systemSettings: { bookingsOpen: true, paymentRequired: true }
  };
}
