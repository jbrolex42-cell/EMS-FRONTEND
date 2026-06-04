import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiLock, FiActivity, FiPhone, FiPlus, FiTrash2 } from 'react-icons/fi';
import { KENYAN_COUNTIES } from '../utils/constants';
import Loader from '../components/Loader';

const tabs = ['Profile', 'Medical Info', 'Emergency Contacts', 'Security'];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [saving, setSaving] = useState(false);
  const { user, updateUser } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phone,
      'address.county': user?.address?.county,
      'address.street': user?.address?.street,
      shaNumber: user?.shaNumber,
      idNumber: user?.idNumber,
      bloodGroup: user?.bloodGroup,
    }
  });

  const { register: regPass, handleSubmit: handlePassSubmit, watch, formState: { errors: passErrors }, reset: resetPass } = useForm();
  const newPass = watch('newPassword');

  const onProfileSave = async (data) => {
    setSaving(true);
    try {
      const { data: res } = await api.put('/users/profile', data);
      updateUser(res.user);
      toast.success('Profile updated successfully');
    } catch { toast.error('Failed to save profile'); }
    finally { setSaving(false); }
  };

  const onPasswordChange = async (data) => {
    setSaving(true);
    try {
      await api.put('/users/password', { currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully');
      resetPass();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
    finally { setSaving(false); }
  };

  return (
    <DashboardLayout title="Settings">
      {/* Tabs */}
      <div className="flex gap-1 bg-ems-dark border border-ems-border rounded-xl p-1 mb-8 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-max px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-emergency-red text-white' : 'text-ems-muted hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'Profile' && (
        <form onSubmit={handleSubmit(onProfileSave)} className="max-w-2xl space-y-6">
          <div className="ems-card">
            <h3 className="text-ems-white font-semibold mb-6 flex items-center gap-2"><FiUser size={16} className="text-emergency-red" /> Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-ems-light text-sm mb-2 block">First Name</label>
                <input {...register('firstName', { required: true })} className="ems-input" />
              </div>
              <div>
                <label className="text-ems-light text-sm mb-2 block">Last Name</label>
                <input {...register('lastName', { required: true })} className="ems-input" />
              </div>
              <div>
                <label className="text-ems-light text-sm mb-2 block">Phone</label>
                <input {...register('phone')} type="tel" className="ems-input" />
              </div>
              <div>
                <label className="text-ems-light text-sm mb-2 block">National ID</label>
                <input {...register('idNumber')} className="ems-input" />
              </div>
              <div>
                <label className="text-ems-light text-sm mb-2 block">SHA Number</label>
                <input {...register('shaNumber')} className="ems-input" placeholder="Link SHA for ECCIF" />
              </div>
              <div>
                <label className="text-ems-light text-sm mb-2 block">County</label>
                <select {...register('address.county')} className="ems-input">
                  <option value="">Select county</option>
                  {KENYAN_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-emergency py-3 px-8 flex items-center gap-2">
            {saving ? <Loader size="sm" /> : 'Save Changes'}
          </button>
        </form>
      )}

      {/* Medical Info tab */}
      {activeTab === 'Medical Info' && (
        <form onSubmit={handleSubmit(onProfileSave)} className="max-w-2xl space-y-6">
          <div className="ems-card">
            <h3 className="text-ems-white font-semibold mb-6 flex items-center gap-2"><FiActivity size={16} className="text-emergency-red" /> Medical Profile</h3>
            <p className="text-ems-muted text-sm mb-6">This information is shared with responders at dispatch. Keep it accurate.</p>
            <div className="space-y-4">
              <div>
                <label className="text-ems-light text-sm mb-2 block">Blood Group</label>
                <select {...register('bloodGroup')} className="ems-input">
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-ems-light text-sm mb-2 block">Known Allergies (comma separated)</label>
                <input {...register('allergies')} placeholder="e.g. Penicillin, Sulfa drugs" className="ems-input" />
              </div>
              <div>
                <label className="text-ems-light text-sm mb-2 block">Medical Conditions (comma separated)</label>
                <input {...register('medicalConditions')} placeholder="e.g. Diabetes Type 2, Hypertension" className="ems-input" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-emergency py-3 px-8">
            {saving ? <Loader size="sm" /> : 'Save Medical Info'}
          </button>
        </form>
      )}

      {/* Emergency Contacts tab */}
      {activeTab === 'Emergency Contacts' && (
        <div className="max-w-2xl space-y-5">
          <div className="ems-card">
            <h3 className="text-ems-white font-semibold mb-6 flex items-center gap-2"><FiPhone size={16} className="text-emergency-red" /> Emergency Contacts</h3>
            <p className="text-ems-muted text-sm mb-6">These contacts are notified when you trigger an emergency.</p>
            {(user?.emergencyContacts || []).map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-ems-dark rounded-xl mb-2">
                <div className="flex-1">
                  <p className="text-ems-white text-sm font-medium">{c.name}</p>
                  <p className="text-ems-muted text-xs">{c.phone} · {c.relationship}</p>
                </div>
                <button className="text-ems-muted hover:text-red-400 transition-colors"><FiTrash2 size={15} /></button>
              </div>
            ))}
            <button className="flex items-center gap-2 text-emergency-red text-sm mt-4 hover:underline">
              <FiPlus size={15} /> Add Contact
            </button>
          </div>
        </div>
      )}

      {/* Security tab */}
      {activeTab === 'Security' && (
        <form onSubmit={handlePassSubmit(onPasswordChange)} className="max-w-md space-y-5">
          <div className="ems-card">
            <h3 className="text-ems-white font-semibold mb-6 flex items-center gap-2"><FiLock size={16} className="text-emergency-red" /> Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="text-ems-light text-sm mb-2 block">Current Password</label>
                <input {...regPass('currentPassword', { required: 'Required' })} type="password" className="ems-input" />
                {passErrors.currentPassword && <p className="text-red-400 text-xs mt-1">{passErrors.currentPassword.message}</p>}
              </div>
              <div>
                <label className="text-ems-light text-sm mb-2 block">New Password</label>
                <input {...regPass('newPassword', { required: 'Required', minLength: { value: 8, message: 'Min 8 chars' } })} type="password" className="ems-input" />
                {passErrors.newPassword && <p className="text-red-400 text-xs mt-1">{passErrors.newPassword.message}</p>}
              </div>
              <div>
                <label className="text-ems-light text-sm mb-2 block">Confirm New Password</label>
                <input {...regPass('confirmPassword', { validate: v => v === newPass || 'Passwords must match' })} type="password" className="ems-input" />
                {passErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{passErrors.confirmPassword.message}</p>}
              </div>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-emergency py-3 px-8">
            {saving ? <Loader size="sm" /> : 'Change Password'}
          </button>
        </form>
      )}
    </DashboardLayout>
  );
}
