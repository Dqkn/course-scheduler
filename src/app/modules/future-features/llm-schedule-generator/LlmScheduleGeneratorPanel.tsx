import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Loader2, Calendar, FileDown, Check } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

type FileUploadStage = 'idle' | 'uploading' | 'processing' | 'done';

interface MockScheduleOption {
  id: string;
  name: string;
  description: string;
  hoursPerWeek: number;
  highlightMsg: string;
  isPopular?: boolean;
}

const MOCK_OPTIONS: MockScheduleOption[] = [
  { id: 'opt1', name: 'Morning Focused', description: 'Prioritizes morning classes, freeing up afternoons completely.', hoursPerWeek: 14, highlightMsg: 'Ends by 1:00 PM' },
  { id: 'opt2', name: 'Balanced Distributed', description: 'Evenly distributes coursework throughout the week.', hoursPerWeek: 14, highlightMsg: 'Minimal gaps', isPopular: true },
  { id: 'opt3', name: 'Heavy Midweek', description: 'Compresses most lectures into Tuesday and Wednesday.', hoursPerWeek: 14, highlightMsg: 'Long Weekends' },
];

export function LlmScheduleGeneratorPanel() {
  const { darkMode } = useApp();
  const [stage, setStage] = useState<FileUploadStage>('idle');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const surface = darkMode ? '#0f172a' : '#ffffff';
  const subSurface = darkMode ? '#1e293b' : '#f8fafc';
  const border = darkMode ? '#334155' : '#e2e8f0';
  const text = darkMode ? '#f1f5f9' : '#0f172a';
  const muted = darkMode ? '#94a3b8' : '#64748b';
  const active = darkMode ? '#3b82f6' : '#2563eb';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const startGeneration = () => {
    if (uploadedFiles.length === 0) return;
    setStage('uploading');
    
    // Mock simulation timings
    setTimeout(() => {
      setStage('processing');
      setTimeout(() => {
        setStage('done');
      }, 2500);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-6" style={{ backgroundColor: darkMode ? '#050c1a' : '#f8faff' }}>
      <div className="max-w-3xl mx-auto w-full space-y-8 pb-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-blue-500/10 items-center justify-center mb-2">
            <Calendar className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: text }}>
            AI Schedule Generator
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: muted }}>
            Upload your accepted course assignments (PDF, Word, or Excel). Our AI will parse your requirements and instantly generate optimized weekly timetables for you to choose from.
          </p>
        </div>

        {/* Upload Zone */}
        {stage === 'idle' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label 
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:bg-black/5 dark:hover:bg-white/5"
              style={{ backgroundColor: surface, borderColor: border }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-blue-500" />
                <p className="mb-2 text-sm font-semibold" style={{ color: text }}>
                  Click to upload or drag and drop
                </p>
                <p className="text-xs" style={{ color: muted }}>
                  PDF, DOCX, or XLSX (MAX. 10MB)
                </p>
              </div>
              <input 
                onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                onChange={handleFileUpload} 
                id="dropzone-file" 
                type="file" 
                className="hidden" 
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
            </label>

            {/* Selected files feedback */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2 p-4 rounded-xl border" style={{ backgroundColor: surface, borderColor: border }}>
                <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: muted }}>
                  Files ready for processing
                </p>
                {uploadedFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ backgroundColor: subSurface }}>
                    <div className="p-2 rounded-md" style={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff' }}>
                      <FileText className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: text }}>{file.name}</p>
                      <p className="text-xs" style={{ color: muted }}>{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                  </div>
                ))}
                
                <button
                  onClick={startGeneration}
                  className="w-full mt-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all shadow-md shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.98]"
                  style={{ backgroundColor: active }}
                >
                  Generate Schedules with AI
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {(stage === 'uploading' || stage === 'processing') && (
          <div 
            className="flex flex-col items-center justify-center p-12 rounded-2xl border animate-in zoom-in-95 duration-300 shadow-sm"
            style={{ backgroundColor: surface, borderColor: border }}
          >
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
            <h3 className="text-lg font-bold mb-2" style={{ color: text }}>
              {stage === 'uploading' ? 'Uploading files securely...' : 'Analyzing courses with AI...'}
            </h3>
            <p className="text-sm text-center max-w-sm" style={{ color: muted }}>
              {stage === 'uploading' 
                ? 'Transferring your documents to the processing engine.' 
                : 'Reading course codes, identifying prerequisites, and calculating the most optimal schedule combinations without conflicts.'}
            </p>
            
            <div className="w-full max-w-sm mt-8 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: subSurface }}>
              <div 
                className="h-full bg-blue-500 transition-all duration-[2000ms] ease-out rounded-full"
                style={{ width: stage === 'uploading' ? '30%' : '85%' }}
              />
            </div>
          </div>
        )}

        {/* Generated Options View */}
        {stage === 'done' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 fade-in">
            <div className="flex items-center justify-between">
               <div>
                 <h3 className="text-xl font-bold" style={{ color: text }}>Select a Schedule</h3>
                 <p className="text-sm mt-1" style={{ color: muted }}>
                   Based on your documents, the AI has prepared 3 conflict-free options.
                 </p>
               </div>
               <button
                 onClick={() => { setStage('idle'); setUploadedFiles([]); }}
                 className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border"
                 style={{ backgroundColor: surface, borderColor: border, color: text }}
               >
                 Start Over
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MOCK_OPTIONS.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOption(opt.id)}
                    className="relative cursor-pointer rounded-2xl p-5 border-2 transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col h-full"
                    style={{
                      backgroundColor: isSelected ? (darkMode ? '#1e3a8a20' : '#eff6ff') : surface,
                      borderColor: isSelected ? active : border,
                      boxShadow: isSelected ? `0 0 0 1px ${active}` : 'none'
                    }}
                  >
                    {opt.isPopular && (
                      <span className="absolute -top-3 inset-x-0 mx-auto w-fit px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-sm">
                        Recommended
                      </span>
                    )}
                    
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-base mb-1" style={{ color: text }}>{opt.name}</h4>
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: subSurface, color: text }}>
                          {opt.highlightMsg}
                        </span>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                        style={{
                          borderColor: isSelected ? active : muted,
                          backgroundColor: isSelected ? active : 'transparent'
                        }}
                      >
                         {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    
                    <p className="text-xs mb-6 flex-1" style={{ color: muted, lineHeight: 1.5 }}>
                      {opt.description}
                    </p>
                    
                    <div className="space-y-3 mt-auto pt-4 border-t" style={{ borderColor: border }}>
                      <div className="flex justify-between items-center text-xs">
                        <span style={{ color: muted }}>Total Time</span>
                        <span className="font-bold" style={{ color: text }}>{opt.hoursPerWeek} hours/week</span>
                      </div>
                      <button 
                         className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-colors border"
                         style={{ 
                           backgroundColor: isSelected ? active : 'transparent',
                           borderColor: isSelected ? active : border,
                           color: isSelected ? '#fff' : text
                         }}
                      >
                         {isSelected ? 'Confirm Schedule' : 'Preview Grid'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
