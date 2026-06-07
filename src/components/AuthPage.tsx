import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, Mail, ChevronRight, Cpu, Network, Check } from 'lucide-react';
import { AdminRole, AdminUser } from '../types';
import { motion } from 'motion/react';

interface AuthPageProps {
  onLoginSuccess: (admin: AdminUser) => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [email, setEmail] = useState('super.admin@dumpsite.org');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleLogin = (e: React.FormEvent, selectedRole?: AdminRole) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (!email.trim() || !password.trim()) {
        setError('Please fill in all security fields.');
        setLoading(false);
        return;
      }

      let role: AdminRole = 'Super Admin';
      let name = 'Bolanle Yusuf';

      if (selectedRole) {
        role = selectedRole;
      } else {
        if (email.includes('ops')) {
          role = 'Ops Admin';
          name = 'Olumide Alao';
        } else if (email.includes('support')) {
          role = 'Support Agent';
          name = 'Chidi Nwachukwu';
        }
      }

      const admin: AdminUser = {
        id: `ADM-0${Math.floor(Math.random() * 900) + 100}`,
        email: email.trim(),
        name: name,
        role: role
      };

      onLoginSuccess(admin);
      setLoading(false);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-white w-full flex font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Full-Frame Screen Split Container */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* LEFT PANEL: Isometric 3D Logistics & Recycling Illustration Scene */}
        <div className="lg:col-span-6 bg-gradient-to-tr from-[#f4f7fa] to-[#ffffff] relative flex flex-col justify-between p-8 sm:p-12 overflow-hidden border-r border-slate-100/50 min-h-[400px] lg:min-h-0">
          
          {/* Subtle Isometric Grid Pattern Background */}
          <div className="absolute inset-0 opacity-[0.8] pointer-events-none">
            <svg className="w-full h-full text-slate-200/60" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="iso-grid" width="48" height="27.712" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
                  <path d="M 24 0 L 48 13.856 L 24 27.712 L 0 13.856 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <path d="M 24 0 L 24 27.712" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#iso-grid)" />
            </svg>
          </div>

          <div className="absolute inset-0 bg-radial-gradient from-transparent to-white/40 pointer-events-none" />

          {/* Top Info Header */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-emerald-600/20">
              d
            </div>
            <div>
              <span className="font-extrabold text-slate-800 text-xs tracking-wider uppercase block">dumpsite</span>
              <span className="text-[9px] text-slate-500 font-bold block -mt-0.5">Admin Portal</span>
            </div>
          </div>

          {/* Core Interactive SVG Rendering of Isometric Warehouse, Trucks, Sorters & Color Bins */}
          <div className="relative flex-1 flex items-center justify-center my-4 scale-[0.9] sm:scale-100 lg:scale-110 select-none">
            
            <svg viewBox="0 0 500 380" className="w-[100%] max-w-[440px] drop-shadow-2xl">
              
              {/* Foundation Shadow Grid */}
              <ellipse cx="250" cy="310" rx="160" ry="40" fill="rgba(30, 41, 59, 0.04)" />
              <ellipse cx="180" cy="270" rx="120" ry="30" fill="rgba(16, 185, 129, 0.03)" />

              {/* Conveyor Belt Pathway (Recycling loop) */}
              <path d="M 160 250 L 330 310 L 380 270 L 210 210 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
              <path d="M 160 251 L 160 255 L 330 315 L 330 310 Z" fill="#94a3b8" />
              <path d="M 330 311 L 330 315 L 380 275 L 380 270 Z" fill="#64748b" />

              {/* Isometric 3D Color-Coded Recycling Bins near the Sorting Hub */}
              {/* BIN 1: Organic / Biomass (Green) */}
              <g transform="translate(140, 275)">
                {/* 3D Cylinder / Box representation */}
                {/* Back shadow */}
                <ellipse cx="10" cy="18" rx="7" ry="3" fill="rgba(15, 23, 42, 0.15)" />
                {/* Left side face */}
                <path d="M 3 5 L 10 8 L 10 18 L 3 15 Z" fill="#10b981" />
                {/* Right side face */}
                <path d="M 10 8 L 17 5 L 17 15 L 10 18 Z" fill="#047857" />
                {/* Cap */}
                <path d="M 3 5 L 10 2 L 17 5 L 10 8 Z" fill="#34d399" />
                {/* Label indicator */}
                <path d="M 10 10 L 13 8.5 L 13 12.5 L 10 14 Z" fill="#ffffff" opacity="0.8" />
              </g>

              {/* BIN 2: Plastics Recycling (Blue) */}
              <g transform="translate(120, 265)">
                <ellipse cx="10" cy="18" rx="7" ry="3" fill="rgba(15, 23, 42, 0.15)" />
                <path d="M 3 5 L 10 8 L 10 18 L 3 15 Z" fill="#0ea5e9" />
                <path d="M 10 8 L 17 5 L 17 15 L 10 18 Z" fill="#0284c7" />
                <path d="M 3 5 L 10 2 L 17 5 L 10 8 Z" fill="#38bdf8" />
                <path d="M 10 10 L 13 8.5 L 13 12.5 L 10 14 Z" fill="#ffffff" opacity="0.8" />
              </g>

              {/* BIN 3: Glass / Metal (Amber/Orange) */}
              <g transform="translate(100, 255)">
                <ellipse cx="10" cy="18" rx="7" ry="3" fill="rgba(15, 23, 42, 0.15)" />
                <path d="M 3 5 L 10 8 L 10 18 L 3 15 Z" fill="#f59e0b" />
                <path d="M 10 8 L 17 5 L 17 15 L 10 18 Z" fill="#b45309" />
                <path d="M 3 5 L 10 2 L 17 5 L 10 8 Z" fill="#fbbf24" />
                <path d="M 10 10 L 13 8.5 L 13 12.5 L 10 14 Z" fill="#ffffff" opacity="0.8" />
              </g>

              {/* Animated Sliding Recycled Materials Box 1 */}
              <motion.g
                animate={{ 
                  x: [0, 170], 
                  y: [0, 60] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 6, 
                  ease: "linear" 
                }}
              >
                {/* 3D Box */}
                {/* Left face */}
                <path d="M 160 240 L 175 245 L 175 255 L 160 250 Z" fill="#10b981" />
                {/* Right face */}
                <path d="M 175 245 L 190 240 L 190 250 L 175 255 Z" fill="#047857" />
                {/* Top face */}
                <path d="M 160 240 L 175 235 L 190 240 L 175 245 Z" fill="#34d399" />
              </motion.g>

              {/* Animated Sliding Recycled Materials Box 2 */}
              <motion.g
                animate={{ 
                  x: [-60, 110], 
                  y: [-21, 39] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 6, 
                  ease: "linear",
                  delay: 2.5
                }}
              >
                {/* 3D Box */}
                {/* Left face */}
                <path d="M 190 220 L 205 225 L 205 235 L 190 230 Z" fill="#0ea5e9" />
                {/* Right face */}
                <path d="M 205 225 L 220 220 L 220 230 L 205 235 Z" fill="#0284c7" />
                {/* Top face */}
                <path d="M 190 220 L 205 215 L 220 220 L 205 225 Z" fill="#38bdf8" />
              </motion.g>

              {/* Future Smart Recycling Plant Building */}
              {/* Back shadows */}
              <path d="M 80 180 L 190 220 L 190 140 L 80 100 Z" fill="rgba(15, 23, 42, 0.04)" />
              
              {/* Left Wall face (shadow) */}
              <path d="M 90 200 L 190 235 L 190 145 L 90 110 Z" fill="#cbd5e1" />
              {/* Right Wall face (light) */}
              <path d="M 190 235 L 290 200 L 290 110 L 190 145 Z" fill="#f1f5f9" />
              {/* White Building Roof */}
              <path d="M 190 145 L 90 110 L 190 75 L 290 110 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
              
              {/* Decorative green eco stripes for clean sci-fi recycling look */}
              <path d="M 205 223 L 220 218 L 220 150 L 205 155 Z" fill="#10b981" className="opacity-80" />
              <path d="M 230 215 L 245 210 L 245 142 L 230 147 Z" fill="#047857" className="opacity-80" />
              <path d="M 255 206 L 270 201 L 270 133 L 255 138 Z" fill="#34d399" className="opacity-80" />

              {/* Garage Door (Dark opening inside) */}
              <path d="M 110 195 L 170 216 L 170 170 L 110 149 Z" fill="#1e293b" />
              {/* Inside Garage: glowing radioactive waste container indicator */}
              <path d="M 130 195 L 150 202 L 150 185 L 130 178 Z" fill="#059669" className="animate-pulse" />

              {/* Isometric Modern Autonomous Delivery Truck in Foreground */}
              <g transform="translate(40, 20)">
                {/* Truck trailer container (white) */}
                {/* Top face */}
                <path d="M 260 210 L 190 185 L 230 171 L 300 196 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
                {/* Side face (left) */}
                <path d="M 190 185 L 190 230 L 260 255 L 260 210 Z" fill="#f8fafc" />
                {/* Back face (right) */}
                <path d="M 260 210 L 260 255 L 300 241 L 300 196 Z" fill="#e2e8f0" />
                
                {/* Cab section (green logistics cabin) */}
                {/* Cab top */}
                <path d="M 305 233 L 325 240 L 340 235 L 320 228 Z" fill="#10b981" />
                {/* Cab windshield/front */}
                <path d="M 325 240 L 325 260 L 340 252 L 340 235 Z" fill="#34d399" />
                {/* Cab side (left) */}
                <path d="M 305 233 L 305 253 L 325 260 L 325 240 Z" fill="#0c4a6e" />

                {/* Truck Wheels (simplified ellipses) */}
                <ellipse cx="215" cy="245" rx="8" ry="4" fill="#334155" />
                <ellipse cx="245" cy="255" rx="8" ry="4" fill="#334155" />
                <ellipse cx="320" cy="261" rx="8" ry="4" fill="#1e293b" />
              </g>

              {/* Floating Holographic 3D♻ Recycle Emblem above Sorting Platform */}
              <motion.g
                animate={{ 
                  y: [0, -12, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 6, 
                  ease: "easeInOut" 
                }}
                transform="translate(210, 80)"
              >
                {/* Glowing Aura back drop */}
                <circle cx="20" cy="20" r="28" fill="rgba(16, 185, 129, 0.07)" className="blur-md" />
                <circle cx="20" cy="20" r="16" fill="rgba(16, 185, 129, 0.12)" />
                
                {/* Outer Ring */}
                <circle cx="20" cy="20" r="16" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 4" />
                
                {/* 3D-styled arrows forming the circular recycling loop */}
                <path d="M 12 16 L 20 10 L 20 13 C 24 13 27 16 27 20 C 27 21 26.5 22 26 23 L 24.5 21.5 C 24.8 21 25.1 20.5 25.1 20 C 25.1 17 23 15 20 15 L 20 18 Z" fill="#10b981" />
                <path d="M 28 24 L 20 30 L 20 27 C 16 27 13 24 13 20 C 13 19 13.5 18 14 17 L 15.5 18.5 C 15.2 19 14.9 19.5 14.9 20 C 14.9 23 17 25 20 25 L 20 22 Z" fill="#047857" />
              </motion.g>

              {/* Floating tech nodes with slow movement to mimic premium 3D dashboard */}
              <motion.g
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <circle cx="360" cy="140" r="6" fill="#10b981" />
                <line x1="360" y1="140" x2="360" y2="180" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2 2" />
                
                {/* floating badge info */}
                <path d="M 330 110 L 400 110 L 410 120 L 340 120 Z" fill="#1e293b" />
                <text x="340" y="118" fill="#ffffff" fontSize="6px" fontFamily="monospace" fontWeight="bold">ECO CHALLENGE</text>
              </motion.g>

              <motion.g
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1.5 }}
              >
                <circle cx="100" cy="240" r="6" fill="#10b981" />
                <line x1="100" y1="240" x2="100" y2="280" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2 2" />

                {/* floating tag */}
                <path d="M 70 210 L 130 210 L 140 220 L 80 220 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
                <text x="82" y="217" fill="#047857" fontSize="6px" fontFamily="monospace" fontWeight="bold">RECYCLING DEPOT</text>
              </motion.g>

            </svg>

          </div>

          {/* Bottom taglines & Stats widgets inside left side */}
          <div className="relative z-10 space-y-2 font-sans pr-4">
            <h3 className="text-sm font-bold text-slate-800 leading-snug">
              Autonomous Waste Cycle Management & Materials Recovery
            </h3>
            <p className="text-[10.5px] text-slate-500 leading-relaxed max-w-sm">
              Connecting high-speed home dumpers, automated logistic agents, and materials recovery recycling factories across Lagos bounds with zero carbon print index.
            </p>
            <div className="flex gap-4 pt-1 text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
              <span className="flex items-center gap-1 text-emerald-600">
                <Cpu className="w-3.5 h-3.5" /> Smart Recovery
              </span>
              <span className="flex items-center gap-1 text-emerald-700">
                <Network className="w-3.5 h-3.5" /> Live Circular Economy
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: Sleek executive form centered around sign in */}
        <div className="lg:col-span-6 flex flex-col justify-between p-8 sm:p-12 md:p-16 bg-white min-h-[500px] lg:min-h-screen">
          
          {/* Top Space Filler / Small Branding back-link */}
          <div className="text-right hidden sm:block h-6" />

          {/* Main Form container */}
          <div className="my-auto py-8 space-y-6 max-w-md w-full mx-auto">
            
            <div className="space-y-1.5">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Sign in
              </h2>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Welcome back to WasteCycle Administrative platform. Authenticate your sector security clearance to launch console applet.
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3.5 rounded-xl text-xs font-semibold animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
              
              {/* Email Address block */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-500">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 text-xs bg-[#f4f6fa] border-none rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold font-sans"
                    placeholder="name@dumpsite.org"
                    required
                  />
                </div>
              </div>

              {/* Password block */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-slate-500">
                    Password
                  </label>
                  <a href="#reset" className="text-[11px] font-bold text-[#059669] hover:underline cursor-pointer" onClick={(e) => e.preventDefault()}>
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 text-xs bg-[#f4f6fa] border-none rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold font-sans"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Terms and security clearance agreement checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                    agreeTerms 
                      ? 'bg-emerald-600 text-white border-emerald-600' 
                      : 'border-slate-300 hover:border-slate-400 text-transparent bg-transparent'
                  }`}
                >
                  {agreeTerms && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <span className="text-[11px] text-slate-500 select-none">
                  I agree to the security & telemetry terms of service
                </span>
              </div>

              {/* Authorize Signature Button scaled beautifully in default emerald theme */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !agreeTerms}
                  className="w-full bg-emerald-600 text-white text-xs font-bold py-3.5 px-4 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/10"
                >
                  <span>{loading ? 'Decrypting Access Session...' : 'Authorize Signature'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </form>

            {/* Premium pre-configured fastpass keys */}
            <div className="border-t border-slate-100 pt-5 space-y-2.5">
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase text-center">
                Fast-Pass Authorization Presets
              </p>
              
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold">
                <button
                  onClick={(e) => {
                    setEmail('super.admin@dumpsite.org');
                    setPassword('demo-safe');
                    handleLogin(e, 'Super Admin');
                  }}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-1 rounded-xl border border-emerald-100/50 transition-colors cursor-pointer"
                >
                  Super Admin
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    setEmail('ops.admin@dumpsite.org');
                    setPassword('demo-safe');
                    handleLogin(e, 'Ops Admin');
                  }}
                  className="bg-[#e0f2fe] hover:bg-sky-100 text-sky-700 py-2 px-1 rounded-xl border border-sky-100/50 transition-colors cursor-pointer"
                >
                  Ops Office
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    setEmail('support.desk@dumpsite.org');
                    setPassword('demo-safe');
                    handleLogin(e, 'Support Agent');
                  }}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-700 py-2 px-1 rounded-xl border border-amber-100/50 transition-colors cursor-pointer"
                >
                  Support Desk
                </button>
              </div>
            </div>

          </div>

          {/* Secure SSL compliance stamp */}
          <div className="text-center pt-4">
            <p className="text-[9.5px] text-slate-400/80 font-medium flex items-center justify-center gap-1 select-none leading-none">
              <Shield className="w-3.5 h-3.5 text-slate-300" />
              Symmetric 256-bit SSL encryption. All session handshakes are auditable.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
