import mongoose from 'mongoose';

const VersionSchema = new mongoose.Schema({
  version: { 
    type: Number, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  changes: { 
    type: String, 
    default: '' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const SrsDocumentSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    default: "Untitled SRS Document"
  },
  versions: [VersionSchema],
  room: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room', 
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { 
  timestamps: true 
});

export default mongoose.models.SrsDocument || mongoose.model('SrsDocument', SrsDocumentSchema);