// src/app/api/delete-cloudinary/route.ts

import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

interface DeleteRequest {
  publicId: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DeleteRequest

    if (!body.publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      )
    }

    const result = await cloudinary.uploader.destroy(body.publicId)

    if (result.result === 'ok') {
      return NextResponse.json({ success: true })
    } else {
      throw new Error('Failed to delete image')
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
