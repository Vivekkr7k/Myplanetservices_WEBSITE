export interface EmailPayload {
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  message?: string;
}

export async function sendContactEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { success: false, error: data?.error || `Request failed with status ${response.status}` };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to submit email payload:', err);
    return { success: false, error: err?.message || 'Network error while sending message' };
  }
}
