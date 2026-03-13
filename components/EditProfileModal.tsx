"use client";
import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { UserProfile } from '@/app/types'; // Import the type we just made

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserProfile) => Promise<void>; // Promise means "wait for backend"
  initialData: UserProfile;
}

export default function EditProfileModal({ isOpen, onClose, onSave, initialData }: EditModalProps) {
  const [formData, setFormData] = useState<UserProfile>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  // Update form if initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate a backend delay (remove this line when you have a real backend)
    await new Promise(resolve => setTimeout(resolve, 1000));

    await onSave(formData);
    setIsLoading(false);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1a1033] border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} />
          <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
          <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
          <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
          <InputField label="Types of song you like" name="type" value={formData.name} onChange={handleChange} />

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 mt-4 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-white hover:opacity-90 transition flex justify-center items-center gap-2"
          >
            {isLoading ? <><Loader2 className="animate-spin" /> Saving...</> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputField({ label, name, type = "text", value, onChange }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2 ml-1">{label}</label>
      <input 
        required
        type={type} 
        name={name}
        value={value} 
        onChange={onChange}
        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition text-white"
      />
    </div>
  );
}