import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { ProjectSettings } from '@/models/project-settings.model';
import path from 'path';
import fs from 'fs/promises';
import { writeFile } from 'fs/promises';

// GET - Retrieve logo
export async function GET() {
  try {
    await dbConnect();
    const projectSettings = await ProjectSettings.findOne({});

    if (!projectSettings?.imageId) {
      // Return default logo
      const defaultLogoPath = path.join(process.cwd(), 'public', 'images', 'logo', 'logo.svg');
      const defaultLogo = await fs.readFile(defaultLogoPath);
      
      return new NextResponse(defaultLogo, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }

    // If custom logo exists, read from uploads directory
    const customLogoPath = path.join(process.cwd(), 'uploads', 'company-profile', projectSettings.imageId);
    const customLogo = await fs.readFile(customLogoPath);
    
    const ext = path.extname(projectSettings.imageId).toLowerCase();
    const contentType = ext === '.svg' ? 'image/svg+xml' : 
                       ext === '.png' ? 'image/png' : 
                       ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 
                       'application/octet-stream';

    return new NextResponse(customLogo, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error loading logo:', error);
    // Return default logo on error
    const defaultLogoPath = path.join(process.cwd(), 'public', 'images', 'logo', 'logo.svg');
    const defaultLogo = await fs.readFile(defaultLogoPath);
    
    return new NextResponse(defaultLogo, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  }
}

// POST - Upload new logo
export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and SVG files are allowed.' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'company-profile');
    await fs.mkdir(uploadDir, { recursive: true });

    const fileExt = path.extname(file.name);
    const fileName = `logo-${Date.now()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Delete old logo if exists
    const oldSettings = await ProjectSettings.findOne({});
    if (oldSettings?.imageId) {
      const oldFilePath = path.join(uploadDir, oldSettings.imageId);
      try {
        await fs.unlink(oldFilePath);
      } catch (error) {
        console.error('Error deleting old logo:', error);
      }
    }

    await ProjectSettings.findOneAndUpdate(
      {},
      { imageId: fileName },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      message: 'Logo updated successfully',
      imageId: fileName
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update existing logo
export async function PUT(req: Request) {
  try {
    await dbConnect();
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and SVG files are allowed.' },
        { status: 400 }
      );
    }

    const settings = await ProjectSettings.findOne({});
    if (!settings?.imageId) {
      return NextResponse.json(
        { error: 'No logo found to update' },
        { status: 404 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'company-profile');
    const oldFilePath = path.join(uploadDir, settings.imageId);

    // Save new file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(oldFilePath, buffer);

    return NextResponse.json({ 
      message: 'Logo updated successfully',
      imageId: settings.imageId
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove logo
export async function DELETE() {
  try {
    await dbConnect();
    
    const settings = await ProjectSettings.findOne({});
    if (!settings?.imageId) {
      return NextResponse.json(
        { error: 'No logo found to delete' },
        { status: 404 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'company-profile');
    const filePath = path.join(uploadDir, settings.imageId);

    // Delete file
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting logo file:', error);
    }

    // Remove imageId from settings
    await ProjectSettings.findOneAndUpdate(
      {},
      { $unset: { imageId: 1 } }
    );

    return NextResponse.json({ 
      message: 'Logo deleted successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}