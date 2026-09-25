import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, FileImage, FileText, Trash2, Eye, Search, Award, CheckCircle, XCircle, UserX, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function ResultsTable({ results, onDeleteStudent, onClearResults }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const filteredResults = results.filter((r) => {
    const nameMatch = r.studentInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const groupMatch = r.studentInfo?.group?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || groupMatch;
  });

  // High-level stats
  const totalSubmissions = results.length;
  const avgScore = totalSubmissions > 0
    ? Math.round(results.reduce((acc, curr) => acc + curr.scorePercentage, 0) / totalSubmissions)
    : 0;
  const highestScore = totalSubmissions > 0
    ? Math.max(...results.map(r => r.scorePercentage))
    : 0;

  // Export as Image PNG
  const handleExportImage = async () => {
    const element = document.getElementById('exportable-report');
    if (!element) return;
    try {
      setIsExporting(true);
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#0f172a'
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `HTML_Imtihon_Natijalari_${new Date().toISOString().slice(0,10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Image export error:", e);
      alert("Rasmni saqlashda xatolik yuz berdi.");
    } finally {
      setIsExporting(false);
    }
  };

  // Export as PDF Document
  const handleExportPDF = async () => {
    const element = document.getElementById('exportable-report');
    if (!element) return;
    try {
      setIsExporting(true);
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#0f172a'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 280;
      const pageHeight = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, Math.min(imgHeight, pageHeight - 20));
      pdf.save(`HTML_Imtihon_Natijalari_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (e) {
      console.error("PDF export error:", e);
      alert("PDF faylni saqlashda xatolik yuz berdi.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      {/* Action Header & Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Jami topshirganlar</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#6366f1', marginTop: '0.25rem' }}>
            {totalSubmissions} ta o'quvchi
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>O'rtacha ball</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.25rem' }}>
            {avgScore}%
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Eng yuqori natija</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>
            {highestScore}%
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
            placeholder="O'quvchi yoki guruhni izlash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportPDF}
            disabled={isExporting || totalSubmissions === 0}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <FileText className="w-4 h-4" />
            <span>PDF Yuklash</span>
          </button>

          <button
            onClick={handleExportImage}
            disabled={isExporting || totalSubmissions === 0}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}
          >
            <FileImage className="w-4 h-4" />
            <span>Rasm (PNG) Yuklash</span>
          </button>

          {totalSubmissions > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Barcha o'quvchilar natijalarini ma'lumotlar bazasidan o'chirmoqchimisiz?")) {
                  onClearResults();
                }
              }}
              className="btn btn-danger"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            >
              <Trash2 className="w-4 h-4" />
              <span>Barchasini O'chirish</span>
            </button>
          )}
        </div>
      </div>

      {/* Exportable Printable Area */}
      <div id="exportable-report" className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <div style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>HTML Imtihoni — Bazadagi O'quvchilar Natijalari</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Ma'lumotlar bazasidan olindi • {new Date().toLocaleDateString('uz-UZ')}</p>
          </div>
          <Award className="w-8 h-8 text-amber-400" />
        </div>

        {filteredResults.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            Hozircha ma'lumotlar bazasida hech qanday o'quvchi natijasi mavjud emas.
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>O'quvchi F.I.SH</th>
                <th>Guruh / Sinf</th>
                <th>To'g'ri javoblar</th>
                <th>Natija (%)</th>
                <th>Sarflangan vaqt</th>
                <th>Nazorat (Anti-Cheat)</th>
                <th>Sana</th>
                <th style={{ textAlign: 'center' }}>Amallar (Boshqaruv)</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((res, index) => {
                const mins = Math.floor(res.timeSpentSeconds / 60);
                const secs = res.timeSpentSeconds % 60;
                const scoreColor = res.scorePercentage >= 80 ? '#10b981' : res.scorePercentage >= 60 ? '#f59e0b' : '#ef4444';
                const violations = res.violationsCount || 0;
                const isAuto = res.isAutoSubmitted;

                return (
                  <tr key={res.dbId || index}>
                    <td><strong>{index + 1}</strong></td>
                    <td style={{ fontWeight: 600 }}>{res.studentInfo.fullName}</td>
                    <td><span className="badge badge-indigo">{res.studentInfo.group}</span></td>
                    <td>{res.correctCount} / {res.totalCount}</td>
                    <td>
                      <span style={{ 
                        display: 'inline-block',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        background: `${scoreColor}20`,
                        color: scoreColor,
                        fontWeight: 800,
                        border: `1px solid ${scoreColor}40`
                      }}>
                        {res.scorePercentage}%
                      </span>
                    </td>
                    <td>{mins} m {secs} s</td>
                    <td>
                      {isAuto ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#f87171', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                          <span>Avto-topshirildi ({violations} ta o'tish)</span>
                        </span>
                      ) : violations > 0 ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#fbbf24', fontSize: '0.8rem', background: 'rgba(245, 158, 11, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                          <span>{violations} marta o'tildi</span>
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#34d399', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Halol (0 ta)</span>
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{res.submittedAt}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => setSelectedStudent(res)}
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                          title="Batafsil javoblarni ko'rish"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ko'rish</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Ushbu o'quvchini (${res.studentInfo.fullName}) bazadan o'chirishni tasdiqlaysizmi?`)) {
                              onDeleteStudent(res.dbId, index);
                            }
                          }}
                          className="btn btn-danger"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                          title="Bazadan o'chirish"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>O'chirish</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content" style={{ maxWidth: '750px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{selectedStudent.studentInfo.fullName}</h3>
                <span className="badge badge-indigo" style={{ marginTop: '0.25rem' }}>{selectedStudent.studentInfo.group}</span>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.75rem' }}
              >
                Yopish
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(15,23,42,0.6)', padding: '1rem', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Natija</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{selectedStudent.scorePercentage}%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>To'g'ri / Jami</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedStudent.correctCount} / {selectedStudent.totalCount}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Sana</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.25rem' }}>{selectedStudent.submittedAt}</div>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Har bir savol javoblari:</h4>
            <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedStudent.details?.map((det, qIdx) => (
                <div
                  key={qIdx}
                  style={{
                    background: det.isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    border: `1px solid ${det.isCorrect ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                    borderRadius: '10px',
                    padding: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    {det.isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" style={{ marginTop: '0.2rem' }} />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" style={{ marginTop: '0.2rem' }} />
                    )}
                    <span>{qIdx + 1}. {det.questionText}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ color: det.isCorrect ? '#6ee7b7' : '#fca5a5' }}>
                      <strong>O'quvchi javobi:</strong> {det.selectedText}
                    </div>
                    {!det.isCorrect && (
                      <div style={{ color: '#6ee7b7' }}>
                        <strong>To'g'ri javob:</strong> {det.correctText}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
