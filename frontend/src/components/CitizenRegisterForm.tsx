import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import indiaRegions from '@/data/india_regions.json';

// Utility validation functions
const nameRegex = /^[A-Za-z ]+$/;
const mobileRegex = /^[6-9]\d{9}$/;
const aadhaarRegex = /^\d{12}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CitizenRegisterForm() {
  const [form, setForm] = useState({
    fullName: '',
    state: '',
    district: '',
    mobile: '',
    aadhaar: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

  // Populate districts when state changes
  useEffect(() => {
      if (form.state) {
        const stateObj = indiaRegions.states.find((s: any) => s.name === form.state);
        setDistrictOptions(stateObj ? stateObj.districts : []);
      } else {
        setDistrictOptions([]);
      }
    // Reset district when state changes
    setForm(prev => ({ ...prev, district: '' }));
  }, [form.state]);

  // Password strength meter
  useEffect(() => {
    const val = form.password;
    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    if (val.length >= 12 && /[A-Z]/.test(val) && /[a-z]/.test(val) && /\d/.test(val) && /[!@#$%^&*]/.test(val)) {
      strength = 'strong';
    } else if (val.length >= 8 && (/[A-Z]/.test(val) || /[a-z]/.test(val)) && /\d/.test(val)) {
      strength = 'medium';
    }
    setPasswordStrength(strength);
  }, [form.password]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    // Full Name
    if (!form.fullName) newErrors.fullName = 'Full name is required.';
    else if (!nameRegex.test(form.fullName)) newErrors.fullName = 'Only alphabets and spaces are allowed.';
    else if (form.fullName.length < 3) newErrors.fullName = 'Minimum 3 characters.';
    else if (form.fullName.length > 50) newErrors.fullName = 'Maximum 50 characters.';
    // State & District
    if (!form.state) newErrors.state = 'State is required.';
    if (!form.district) newErrors.district = 'District is required.';
    else {
      const stateObj = indiaRegions.states.find((s: any) => s.name === form.state);
      if (stateObj && !stateObj.districts.includes(form.district)) {
        newErrors.district = 'District does not belong to selected state.';
      }
    }
    // Mobile
    if (!form.mobile) newErrors.mobile = 'Mobile number is required.';
    else if (!mobileRegex.test(form.mobile)) newErrors.mobile = 'Enter a valid Indian mobile number.';
    // Aadhaar
    if (form.aadhaar && !aadhaarRegex.test(form.aadhaar)) newErrors.aadhaar = 'Aadhaar must be 12 digits.';
    // Email
    if (!form.email) newErrors.email = 'Email is required.';
    else if (!emailRegex.test(form.email)) newErrors.email = 'Enter a valid email address.';
    // Password
    if (!form.password) newErrors.password = 'Password is required.';
    else if (passwordStrength === 'weak') newErrors.password = 'Password is too weak.';
    // Confirm Password
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Submit to backend (registration endpoint)
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.fullName,
          state: form.state,
          district: form.district,
          mobile: form.mobile,
          aadhaar: form.aadhaar,
          email: form.email,
          password: form.password
        })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Registration failed');
      }
      // Auto‑login after successful registration
      const loginRes = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, role: 'citizen' })
      });
      if (!loginRes.ok) throw new Error('Auto‑login failed');
      const data = await loginRes.json();
      localStorage.setItem('surakshanet_token', data.access_token);
      // redirect to citizen dashboard
      window.location.href = '/citizen/dashboard';
      alert('Registration successful!');
      } catch (err: any) {
        console.error(err);
        const message = err?.message || 'Registration failed';
        alert(message);
        if (message.includes('Email already registered')) setErrors(prev => ({ ...prev, email: message }));
      }
  };

  return (
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-card bg-opacity-60 backdrop-blur-xs shadow-glass rounded-xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-primary mb-4">Citizen Registration</h2>
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-subtext mb-1" htmlFor="fullName">
            Full Name
          </label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Puneeth Mittal"
              value={form.fullName}
              onChange={handleChange}
              onBlur={() => setForm(prev => ({ ...prev, fullName: prev.fullName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') }))}
              className="bg-card focus:bg-card"
            />
          {errors.fullName && <p className="mt-1 text-sm text-danger">{errors.fullName}</p>}
        </div>
        {/* State */}
        <div>
          <label className="block text-sm font-medium text-subtext mb-1" htmlFor="state">
            State
          </label>
<Select name="state" value={form.state} onValueChange={(value) => setForm(prev => ({ ...prev, state: value }))}>
  <SelectTrigger>
    <SelectValue placeholder="Select a state" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="" disabled>Select a state</SelectItem>
    {indiaRegions.states.map((s: any) => (
      <SelectItem key={s.name} value={s.name}>
        {s.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
          {errors.state && <p className="mt-1 text-sm text-danger">{errors.state}</p>}
        </div>
        {/* District */}
        <div>
          <label className="block text-sm font-medium text-subtext mb-1" htmlFor="district">
            District
          </label>
           <Select name="district" value={form.district} onValueChange={(value) => setForm(prev => ({ ...prev, district: value }))} disabled={!form.state}>
  <SelectTrigger>
    <SelectValue placeholder="Select a district" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="" disabled>Select a district</SelectItem>
    {districtOptions.map((d) => (
      <SelectItem key={d} value={d}>
        {d}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
          {errors.district && <p className="mt-1 text-sm text-danger">{errors.district}</p>}
        </div>
        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-subtext mb-1" htmlFor="mobile">
            Mobile Number
          </label>
          <Input
            id="mobile"
            name="mobile"
            placeholder="9876543210"
            value={form.mobile}
            onChange={handleChange}
            maxLength={10}
          />
          {errors.mobile && <p className="mt-1 text-sm text-danger">{errors.mobile}</p>}
        </div>
        {/* Aadhaar */}
        <div>
          <label className="block text-sm font-medium text-subtext mb-1" htmlFor="aadhaar">
            Aadhaar Number
          </label>
          <Input
            id="aadhaar"
            name="aadhaar"
            placeholder="123456789012"
            value={form.aadhaar}
            onChange={handleChange}
            maxLength={12}
          />
          {errors.aadhaar && <p className="mt-1 text-sm text-danger">{errors.aadhaar}</p>}
        </div>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-subtext mb-1" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@domain.com"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="mt-1 text-sm text-danger">{errors.email}</p>}
        </div>
        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-subtext mb-1" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />
          <div className="mt-1 text-sm">
            <span
              className={
                passwordStrength === 'weak'
                  ? 'text-danger'
                  : passwordStrength === 'medium'
                  ? 'text-primary'
                  : 'text-success'
              }
            >
              {passwordStrength === 'weak' && 'Weak'}
              {passwordStrength === 'medium' && 'Medium'}
              {passwordStrength === 'strong' && 'Strong'}
            </span>
          </div>
          {errors.password && <p className="mt-1 text-sm text-danger">{errors.password}</p>}
        </div>
        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-subtext mb-1" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-danger">{errors.confirmPassword}</p>}
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
          Register
        </Button>
      </form>
  );
}
