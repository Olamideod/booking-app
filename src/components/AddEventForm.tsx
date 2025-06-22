'use client';

import { createEvent } from '@/app/actions/eventActions';
import { useState } from 'react';
// Note: useFormStatus is a new hook in React 18 for pending states
import { useFormStatus } from 'react-dom';
import { Upload, Link as LinkIcon } from 'lucide-react';

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
  const [imageUploadType, setImageUploadType] = useState<'url' | 'file'>('url');

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
    <form action={handleSubmit} className="space-y-6" encType="multipart/form-data">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
        </div>
      )}

      <FormInput id="title" label="Event Title" placeholder="e.g., Summer Music Festival" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput id="date" label="Date and Time" type="datetime-local" placeholder="mm/dd/yyyy hh:mm" />
        <FormInput id="location" label="Location" placeholder="e.g., Lagos, Nigeria" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput id="price" label="Price" type="number" placeholder="Enter 0 for a free event" />
        <FormInput id="currency" label="Currency" placeholder="e.g., NGN, GBP, USD" />
      </div>

      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Event Image
        </label>
        
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={() => setImageUploadType('url')}
            className={`px-3 py-2 rounded-md flex items-center gap-2 ${
              imageUploadType === 'url' ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-gray-100'
            }`}
          >
            <LinkIcon size={16} />
            Image URL
          </button>
          
          <button
            type="button"
            onClick={() => setImageUploadType('file')}
            className={`px-3 py-2 rounded-md flex items-center gap-2 ${
              imageUploadType === 'file' ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-gray-100'
            }`}
          >
            <Upload size={16} />
            Upload Image
          </button>
        </div>
        
        {imageUploadType === 'url' ? (
          <div>
            <input
              id="image_url"
              name="image_url"
              type="url"
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 shadow-sm focus:ring-accent-purple focus:border-accent-purple"
            />
            <p className="text-xs text-gray-500 mt-1">Enter a direct URL to an image (JPG, PNG, or WebP)</p>
          </div>
        ) : (
          <div>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400">SVG, PNG, JPG or WebP (max. 2MB)</p>
              <input
                id="image_file"
                name="image_file"
                type="file"
                accept="image/*"
                className="w-full h-full opacity-0 absolute cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

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