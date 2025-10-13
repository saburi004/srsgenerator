import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/user';
import Room from '@/models/room';
import SrsDocument from '@/models/srs';
import connectDB from "@/lib/dbconfig";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request) {
  try {
    await connectDB();

    // Get token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Find user by email from token (most reliable)
    const user = await User.findOne({ email: decoded.email }).select('-__v');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get rooms where user is manager, client, or developer
    const rooms = await Room.find({
      $or: [
        { manager: user._id },
        { clients: user._id },
        { developers: user._id }
      ]
    })
    .populate('manager', 'name email')
    .populate('clients', 'name email')
    .populate('developers', 'name email')
    .select('-__v')
    .sort({ createdAt: -1 });

    let userSrsDocuments = [];

    // If user is a client, get SRS documents they created
    if (user.role === 'client') {
      userSrsDocuments = await SrsDocument.find({ createdBy: user._id })
        .populate('createdBy', 'name email')
        .populate('room', 'roomId')
        .select('-__v -versions')
        .sort({ createdAt: -1 });
    }

    // Format the response
    const response = {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      rooms: rooms.map(room => ({
        id: room._id,
        roomId: room.roomId,
        manager: room.manager,
        clients: room.clients,
        developers: room.developers,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt
      })),
      srsDocuments: user.role === 'client' ? userSrsDocuments.map(doc => ({
        id: doc._id,
        title: doc.title,
        room: doc.room,
        createdBy: doc.createdBy,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      })) : []
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}