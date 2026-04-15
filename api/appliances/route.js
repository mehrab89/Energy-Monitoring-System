import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Appliance from '@/models/Appliance';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectToDatabase();
  try {
    const appliances = await Appliance.find({ userId: session.user.id });
    return NextResponse.json(appliances);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appliances' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectToDatabase();
  try {
    const data = await request.json();
    const appliance = await Appliance.create({
      ...data,
      userId: session.user.id
    });
    return NextResponse.json(appliance, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appliance' }, { status: 400 });
  }
}

export async function DELETE(request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  try {
    // Ensure the appliance belongs to the user before deleting
    const deleted = await Appliance.findOneAndDelete({ _id: id, userId: session.user.id });
    if (!deleted) return NextResponse.json({ error: 'Appliance not found or unauthorized' }, { status: 404 });
    return NextResponse.json({ message: 'Appliance deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete appliance' }, { status: 400 });
  }
}
export async function PUT(request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectToDatabase();
  try {
    const data = await request.json();
    const { _id, ...updateData } = data;
    
    const appliance = await Appliance.findOneAndUpdate(
      { _id, userId: session.user.id },
      { $set: updateData },
      { new: true }
    );

    if (!appliance) return NextResponse.json({ error: 'Appliance not found' }, { status: 404 });
    return NextResponse.json(appliance);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appliance' }, { status: 400 });
  }
}
