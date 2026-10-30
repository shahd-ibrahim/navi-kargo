import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { TimelineStep } from '../../types/cargo';

interface TrackingTimelineProps {
  timeline: TimelineStep[];
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ timeline }) => {
  return (
    <div className="px-6 pb-6 space-y-4">
      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
        Aşama ve Hareket Geçmişi
      </h4>
      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {timeline &&
          timeline.map((step, idx) => (
            <div key={idx} className="relative flex items-start space-x-3">
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                  step.done
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-50'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {step.done ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
              </div>

              <div>
                <h5
                  className={`text-sm font-bold ${
                    step.done ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </h5>
                <span className="text-xs text-slate-500">{step.time}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TrackingTimeline;

