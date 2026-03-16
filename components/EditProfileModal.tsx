"use client";
import { useState, useEffect } from 'react';
import { X, Loader2, AlignLeft, MapPin } from 'lucide-react';
import { UserProfile } from '@/app/types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserProfile) => Promise<void>;
  initialData: UserProfile;
}

export default function EditProfileModal({ isOpen, onClose, onSave, initialData }: EditModalProps) {
  const [formData, setFormData] = useState<UserProfile>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave(formData);
    setIsLoading(false);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#1a1033] border border-white/10 rounded-[32px] w-full max-w-lg p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
          Update Profile 
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} />
          
          <div>
            <label className="block text-sm text-gray-400 mb-2 ml-1 flex items-center gap-2">
              <AlignLeft size={14} /> Short Bio
            </label>
            <textarea 
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              placeholder="Tell us about your music taste..."
              rows={3}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 transition text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
            <InputField label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
          </div>

          <InputField label="Location / Address" name="address" value={formData.address || ""} onChange={handleChange} icon={<MapPin size={14}/>} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Birthday" name="dob" type="date" value={formData.dob} onChange={handleChange} />
            <InputField label="Favorite Music Genre" name="type" value={formData.type || ""} onChange={handleChange} />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 mt-4 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition flex justify-center items-center gap-2"
          >
            {isLoading ? <><Loader2 className="animate-spin" /> Saving...</> : "Save Premium Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, name, type = "text", value, onChange, icon }: any) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2 ml-1 items-center gap-2">
        {icon} {label}
      </label>
      <input 
        required type={type} name={name} value={value} onChange={onChange}
        className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 transition text-white"
      />
    </div>
  );
}