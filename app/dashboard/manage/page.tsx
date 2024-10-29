import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');

  if (!accessToken) {
    redirect('/');
  }

  redirect('/dashboard/home');
}
