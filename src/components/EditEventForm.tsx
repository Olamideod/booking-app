'use client';

import { updateEvent } from '@/app/actions/eventActions';
import type { Event } from '@/types';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';
import { Upload, Link as LinkIcon } from 'lucide-react';

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
  const [imageUploadType, setImageUploadType] = useState<'url' | 'file'>('url');

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    try {
      await updateEvent(event.id, formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6" encType="multipart/form-data">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
        </div>
      )}

      <FormInput id="title" label="Event Title" defaultValue={event.title} />
      
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
              defaultValue={event.image_url || ''}
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
            {event.image_url && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Current image will be kept if no new image is uploaded</p>
              </div>
            )}
          </div>
        )}
      </div>

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