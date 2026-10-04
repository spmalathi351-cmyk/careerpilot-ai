import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, Sparkles, ArrowRight } from 'lucide-react';

export const ResumeProcessingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, title: 'Document Validation & Virus Scan', detail: 'Checked PDF/DOCX binary headers and integrity.' },
    { number: 2, title: 'Text Extraction & Token Normalization', detail: 'Parsed single and multi-column document streams.' },
    { number: 3, title: 'Gemini 3.8 Flash Entity Classification', detail: 'Extracted skills, work timeline, and quantified bullets.' },
    { number: 4, title: 'ATS Scoring & Keyword Density Audit', detail: 'Calibrated compatibility indices against industry benchmarks.' },
    { number: 5, title: 'Career Guidance Roadmap Synthesis', detail: 'Identified skill gaps and strategic milestone recommendations.' },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(2), 600);
    const timer2 = setTimeout(() => setCurrentStep(3), 1300);
    const timer3 = setTimeout(() => setCurrentStep(4), 2100);
    const timer4 = setTimeout(() => setCurrentStep(5), 2900);
    const timer5 = setTimeout(() => {
      navigate(`/student/resumes/${id}/diagnostic`);
    }, 3600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [id, navigate]);

  return (
    <div className="max-w-xl mx-auto my-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-indigo-100 animate-pulse">
          <Sparkles className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">AI Resume Processing Pipeline</h1>
        <p className="text-xs text-slate-500">
          Running Gemini 3.8 Flash semantic extraction and ATS compliance checks...
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        {steps.map((step) => {
          const isDone = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div
              key={step.number}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                isCurrent
                  ? 'border-indigo-400 bg-indigo-50/30'
                  : isDone
                  ? 'border-slate-200 bg-slate-50/50'
                  : 'border-slate-100 bg-white opacity-40'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 text-xs flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                )}
              </div>

              <div>
                <p className={`text-xs font-bold ${isCurrent ? 'text-indigo-900' : 'text-slate-800'}`}>
                  {step.title}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{step.detail}</p>
              </div>
            </div>
          );
        })}

        <div className="pt-4 text-center">
          <button
            onClick={() => navigate(`/student/resumes/${id}/diagnostic`)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
          >
            Skip animation &amp; jump directly to report <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
