import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectToDatabase();
  try {
    const user = await User.findById(session.user.id).select('unitRate monthlyBudget name email');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { unitRate, monthlyBudget } = await req.json();

  await connectToDatabase();
  try {
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { unitRate, monthlyBudget },
      { new: true }
    );
    
    console.log('User settings updated:', { id: user._id, unitRate: user.unitRate, budget: user.monthlyBudget });
    
    return NextResponse.json({ message: 'Settings updated successfully', user });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
