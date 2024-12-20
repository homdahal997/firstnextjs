import mongoose from 'mongoose';

const projectSettingsSchema = new mongoose.Schema({
  imageId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export const ProjectSettings = mongoose.models.ProjectSettings || mongoose.model('ProjectSettings', projectSettingsSchema);