import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GenerateImage } from "@/integrations/Core";
import { motion } from "framer-motion";
import { 
  ArrowLeft, ArrowRight, Monitor, Smartphone, 
  Eye, Download, Palette, Loader2
} from "lucide-react";

export default function DesignPreview({ projectData, onNext, onBack }) {
  const [mockups, setMockups] = useState([]);
  const [isGeneratingMockups, setIsGeneratingMockups] = useState(false);
  const [selectedView, setSelectedView] = useState('desktop');

  const generateMockups = useCallback(async () => {
    setIsGeneratingMockups(true);
    
    try {
      const { brand_identity, product_strategy } = projectData.generated_concept;
      
      // Generate homepage mockup
      const homepagePrompt = `
        Create a beautiful, modern e-commerce homepage mockup for "${brand_identity.name}". 
        Style: Clean, professional, conversion-focused
        Colors: ${brand_identity.color_scheme?.join(', ')}
        Brand voice: ${brand_identity.brand_voice}
        Products: ${product_strategy.main_categories?.slice(0, 3).join(', ')}
        Include: Header with navigation, hero section, featured products, testimonials
        Make it look like a real, high-end e-commerce website
      `;
      
      const homepageMockup = await GenerateImage({ prompt: homepagePrompt });
      
      // Generate product page mockup  
      const productPrompt = `
        Create a product page mockup for "${brand_identity.name}" e-commerce store.
        Style: Clean, modern, focused on conversion
        Colors: ${brand_identity.color_scheme?.slice(0, 2).join(', ')}
        Show: Product images, price, add to cart button, product details, reviews
        Product type: ${product_strategy.recommended_products?.[0]?.name || 'Featured product'}
        Make it look professional and trustworthy
      `;
      
      const productMockup = await GenerateImage({ prompt: productPrompt });
      
      setMockups([
        {
          title: 'Homepage Design',
          description: 'Main landing page with hero section and featured products',
          url: homepageMockup.url,
          type: 'homepage'
        },
        {
          title: 'Product Page Design', 
          description: 'Individual product page with details and purchase options',
          url: productMockup.url,
          type: 'product'
        }
      ]);
      
    } catch (error) {
      console.error("Error generating mockups:", error);
    } finally {
      setIsGeneratingMockups(false);
    }
  }, [projectData.generated_concept]);

  useEffect(() => {
    generateMockups();
  }, [generateMockups]);

  const downloadMockup = (mockup) => {
    const link = document.createElement('a');
    link.href = mockup.url;
    link.download = `${projectData.generated_concept.brand_identity.name}-${mockup.type}-mockup.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Store Design Preview</h1>
        <p className="text-gray-600">
          See how your store will look with AI-generated mockups
        </p>
      </motion.div>

      {/* Design Controls */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            variant={selectedView === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedView('desktop')}
            className="flex items-center gap-2"
          >
            <Monitor className="w-4 h-4" />
            Desktop
          </Button>
          <Button
            variant={selectedView === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedView('mobile')}
            className="flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            Mobile
          </Button>
        </div>
      </motion.div>

      {/* Mockups */}
      {isGeneratingMockups ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto glow-effect">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Generating Your Store Mockups...
              </h2>
              <p className="text-gray-600">
                Creating beautiful design previews based on your brand identity
              </p>
            </motion.div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {mockups.map((mockup, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="floating-card border-0 shadow-xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-purple-500" />
                      {mockup.title}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadMockup(mockup)}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </CardTitle>
                  <p className="text-gray-600 text-sm">{mockup.description}</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className={`relative ${selectedView === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                    <img
                      src={mockup.url}
                      alt={mockup.title}
                      className="w-full h-auto rounded-b-lg"
                      style={{ aspectRatio: selectedView === 'mobile' ? '9/16' : '16/10' }}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white/90 text-gray-700">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Brand Colors Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Brand Colors & Typography</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Color Palette</h4>
                <div className="flex gap-3">
                  {projectData.generated_concept.brand_identity.color_scheme?.map((color, index) => (
                    <div key={index} className="text-center">
                      <div 
                        className="w-16 h-16 rounded-lg border-2 border-white shadow-lg"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs text-gray-600 mt-2 block font-mono">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Typography</h4>
                <p className="text-gray-600">{projectData.generated_concept.brand_identity.typography}</p>
                <div className="mt-4 space-y-2">
                  <h1 className="text-2xl font-bold" style={{ color: projectData.generated_concept.brand_identity.color_scheme?.[0] }}>
                    {projectData.generated_concept.brand_identity.name}
                  </h1>
                  <p className="text-lg italic text-gray-600">
                    "{projectData.generated_concept.brand_identity.tagline}"
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-between items-center"
      >
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Concept
        </Button>

        <Button 
          onClick={onNext}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2 glow-effect"
        >
          View Business Plan
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
}
