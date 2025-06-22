'use client';

import { createEvent } from '@/app/actions/eventActions';
import { useState } from 'react';
// Note: useFormStatus is a new hook in React 18 for pending states
import { useFormStatus } from 'react-dom';

// A simple reusable input component
function FormInput({
  id,
  label,
  type = 'text',
  placeholder,
  required = true,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-900 mb-1">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 shadow-sm focus:ring-accent-purple focus:border-accent-purple"
      />
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full flex justify-center disabled:bg-gray-400"
    >
      {pending ? 'Adding Event...' : 'Add Event'}
    </button>
  );
}

export default function AddEventForm() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null); // Clear previous errors
    try {
      await createEvent(formData);
      // Redirect will happen in the server action upon success
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
        </div>
      )}

      <FormInput id="title" label="Event Title" placeholder="e.g., Summer Music Festival" />
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-accent-purple focus:border-accent-purple"
          placeholder="Give a brief description of the event"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput id="date" label="Date and Time" type="datetime-local" placeholder="mm/dd/yyyy hh:mm" />
        <FormInput id="location" label="Location" placeholder="e.g., Lagos, Nigeria" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput id="price" label="Price" type="number" placeholder="Enter 0 for a free event" />
        <FormInput id="currency" label="Currency" placeholder="e.g., NGN, GBP, USD" />
      </div>

      <FormInput id="image_url" label="Image URL" type="url" placeholder="https://..." required={false} />

      <div className="flex items-center">
        <input
          id="featured"
          name="featured"
          type="checkbox"
          className="h-4 w-4 text-accent-purple border-gray-300 rounded focus:ring-accent-purple"
        />
        <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
          Mark as a featured event
        </label>
      </div>

      <div>
        <SubmitButton />
      </div>
    </form>
  );
} 