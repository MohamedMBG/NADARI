'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/cart';

interface RecommenderProps {
  onRecommendation: (prescription: string) => void;
}

export function SmartLensRecommender({ onRecommendation }: RecommenderProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    {
      id: 'screenTime',
      title: 'How much time do you spend on screens daily?',
      options: ['Less than 2 hours', '2-6 hours', 'More than 6 hours']
    },
    {
      id: 'sensitivity',
      title: 'Are your eyes sensitive to sunlight?',
      options: ['Not at all', 'Somewhat', 'Very sensitive']
    },
    {
      id: 'driving',
      title: 'Do you experience glare while driving at night?',
      options: ['Never', 'Sometimes', 'Frequently']
    }
  ];

  const handleAnswer = (val: string) => {
    setAnswers(prev => ({ ...prev, [questions[step - 1].id]: val }));
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      setStep(4); // Results
    }
  };

  const calculateRecommendation = () => {
    if (answers.screenTime === 'More than 6 hours') return 'Blue Light Filter (+ 800 MAD)';
    if (answers.sensitivity === 'Very sensitive') return 'Photochromic Transitions (+ 1,200 MAD)';
    if (answers.driving === 'Frequently') return 'Anti-Reflective Coating (+ 600 MAD)';
    return 'Single Vision (+ 500 MAD)';
  };

  const applyRecommendation = () => {
    onRecommendation(calculateRecommendation());
    setOpen(false);
    setStep(1);
    setAnswers({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-xs font-bold text-gold cursor-pointer hover:underline uppercase tracking-widest mt-2">
          <Sparkles className="w-3 h-3" /> Help me choose lenses
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-ivory">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-charcoal">Lens Recommender</DialogTitle>
          <DialogDescription className="text-muted-foreground">Find the perfect lenses for your lifestyle.</DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {step <= 3 ? (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Question {step} of 3</span>
              <h3 className="text-xl font-medium text-charcoal">{questions[step - 1].title}</h3>
              <div className="space-y-3">
                {questions[step - 1].options.map((opt) => (
                  <Button 
                    key={opt} 
                    variant="outline" 
                    className="w-full justify-start h-14 border-sand text-charcoal font-normal hover:bg-sand/30"
                    onClick={() => handleAnswer(opt)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
             <div className="text-center space-y-6 animate-in zoom-in-95">
               <div className="w-16 h-16 bg-sand/30 rounded-full flex items-center justify-center mx-auto text-gold shadow-lg border border-gold/30">
                 <Sparkles className="w-8 h-8" />
               </div>
               <div>
                 <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-2">Our Recommendation</p>
                 <h3 className="text-2xl font-serif text-charcoal">{calculateRecommendation()}</h3>
               </div>
               <p className="text-sm text-charcoal max-w-[280px] mx-auto leading-relaxed">
                 Based on your lifestyle, these lenses will provide optimal clarity and comfort.
               </p>

               <Button className="w-full bg-charcoal text-ivory hover:bg-black h-14 uppercase tracking-widest text-sm font-semibold mt-4" onClick={applyRecommendation}>
                 Apply to Frame
               </Button>
             </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
