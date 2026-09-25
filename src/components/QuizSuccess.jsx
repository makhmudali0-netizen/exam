import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Home, ShieldCheck } from 'lucide-react';

export default function QuizSuccess({ studentInfo, onResetForNextStudent }) {
  useEffect(() => {
    // Launch festive celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore if confetti fails
    }
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1rem' }}>
      <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          marginBottom: '1.5rem',
          boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
          animation: 'bounce 1s ease'
        }}>
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.75rem' }}>
          Testni yakunladingiz!
        </h1>

        <p style={{ color: '#a5b4fc', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          {studentInfo?.fullName} ({studentInfo?.group})
        </p>

        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '460px', margin: '0 auto 2rem auto' }}>
          Sizning barcha javoblaringiz muvaffaqiyatli qabul qilindi va tizimda saqlandi. Imtihon natijalari o'qituvchi (admin) tomonidan tekshiriladi va e'lon qilinadi.
        </p>

        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          color: '#38bdf8',
          fontSize: '0.875rem',
          marginBottom: '2rem'
        }}>
          <ShieldCheck className="w-5 h-5 text-sky-400" />
          <span>Javoblaringiz xavfsiz holatda saqlandi. E'tiboringiz uchun rahmat!</span>
        </div>

        <div>
          <button
            onClick={onResetForNextStudent}
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
          >
            <Home className="w-5 h-5" />
            <span>Bosh sahifaga qaytish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
