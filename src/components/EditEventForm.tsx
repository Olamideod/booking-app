'use client';

import { updateEvent } from '@/app/actions/eventActions';
import type { Event } from '@/types';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full flex justify-center disabled:bg-gray-400"
    >
      {pending ? 'Updating Event...' : 'Update Event'}
    </button>
  );
}

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number | null;
  placeholder?: string;
}

// A simple reusable input component for the form
function FormInput({ id, label, type = 'text', required = true, defaultValue, placeholder = '' }: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-accent-purple focus:border-accent-purple"
      />
    </div>
  );
}

export default function EditEventForm({ event }: { event: Event }) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    try {
      await updateEvent(event.id, formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
        </div>
      )}

      <FormInput id="title" label="Event Title" defaultValue={event.title} />
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          defaultValue={event.description ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-accent-purple focus:border-accent-purple"
        ></textarea>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          id="date"
          label="Date and Time"
          type="datetime-local"
          defaultValue={event.date ? new Date(event.date).toISOString().slice(0, 16) : ''}
        />
        <FormInput id="location" label="Location" defaultValue={event.location} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput id="price" label="Price" type="number" defaultValue={event.price} />
        <FormInput id="currency" label="Currency" defaultValue={event.currency} />
      </div>

      <FormInput id="image_url" label="Image URL" type="url" required={false} defaultValue={event.image_url} />

      <div className="flex items-center">
        <input
          id="featured"
          name="featured"
          type="checkbox"
          defaultChecked={event.featured ?? false}
          className="h-4 w-4 text-accent-purple border-gray-300 rounded focus:ring-accent-purple"
        />
        <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">Mark as a featured event</label>
      </div>

      <div>
        <SubmitButton />
      </div>
    </form>
  );
} 