import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login'); // Or redirect to a specific login page
  }

  // TODO: Fetch profile details from the 'profiles' table
  // const { data: profile } = await supabase
  //   .from('profiles')
  //   .select('*')
  //   .eq('id', user.id)
  //   .single();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-dark-purple mb-8">User Profile</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="text-lg">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="text-lg mt-2">
          <span className="font-semibold">User ID:</span> {user.id}
        </p>
        <p className="mt-6 text-gray-500">
          This is your profile page. More details, like your name and past orders, will be shown here soon.
        </p>
        {/* TODO: Add form to edit profile details */}
      </div>
    </div>
  );
} 