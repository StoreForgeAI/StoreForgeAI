import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Sparkles, ArrowRight, Target, Store, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import StoreConceptForm from "../components/builder/StoreConceptForm";
import GeneratedConcept from "../components/builder/GeneratedConcept";
import DesignPreview from "../components/builder/DesignPreview";
import BusinessPlan from "../components/builder/BusinessPlan";

const steps = [
  { id: 'concept', title: 'Store Concept', icon: Target, description: 'Describe your dream store' },
  { id: 'generate', title: 'AI Generation', icon: Wand2, description: 'AI creates your store plan' },
  { id: 'design', title: 'Design Preview', icon: Palette, description: 'See your store come to life' },
  { id: 'business', title: 'Business Plan', icon: Store, description: 'Complete implementation guide' }
];

export default function StoreBuilder() {
  const [currentStep, setCurrentStep] = useState('concept');
  const [storeProject, setStoreProject] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const renderStep = () => {
    switch (currentStep) {
      case 'concept':
        return (
          <StoreConceptForm 
            onSubmit={(data) => {
              setStoreProject(data);
              setCurrentStep('generate');
            }}
            isLoading={isGenerating}
          />
        );
      case 'generate':
        return (
          <GeneratedConcept 
            projectData={storeProject}
            onGenerated={(generatedData) => {
              setStoreProject(generatedData);
              setCurrentStep('design');
            }}
            onBack={() => setCurrentStep('concept')}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        );
      case 'design':
        return (
          <DesignPreview 
            projectData={storeProject}
            onNext={() => setCurrentStep('business')}
            onBack={() => setCurrentStep('generate')}
          />
        );
      case 'business':
        return (
          <BusinessPlan 
            projectData={storeProject}
            onBack={() => setCurrentStep('design')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-amber-500 rounded-2xl flex items-center justify-center glow-effect">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              AI Store Builder
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Describe your vision and watch as AI creates a complete Shopify store with products, branding, and business plan
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="flex items-center space-x-4 md:space-x-8 overflow-x-auto pb-4">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
                
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <div className={`flex flex-col items-center ${index > 0 ? 'ml-8' : ''}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive 
                          ? 'bg-purple-500 text-white glow-effect' 
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        <step.icon className="w-6 h-6" />
                      </div>
                      <div className="text-center mt-2">
                        <p className={`font-medium text-sm ${isActive ? 'text-purple-600' : 'text-gray-500'}`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-400 hidden md:block">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-gray-300 mx-4 hidden md:block" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
