import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StoreProject } from "@/entities/StoreProject";
import { InvokeLLM } from "@/integrations/Core";
import { motion } from "framer-motion";
import { 
  Sparkles, ArrowLeft, ArrowRight, Store, Palette, 
  Target, DollarSign, TrendingUp, Package, Users,
  CheckCircle, Loader2
} from "lucide-react";

export default function GeneratedConcept({ 
  projectData, 
  onGenerated, 
  onBack, 
  isGenerating, 
  setIsGenerating 
}) {
  const [generatedData, setGeneratedData] = useState(null);

  const generateStoreConcept = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      const prompt = `
        Create a comprehensive e-commerce store concept based on this description:
        
        Store Description: ${projectData.store_description}
        Store Name: ${projectData.store_name || 'Not specified'}
        Target Audience: ${projectData.target_audience || 'Not specified'}  
        Niche: ${projectData.niche || 'Not specified'}
        
        Generate a complete store concept including:
        1. Brand identity with name, tagline, brand voice, color scheme (hex codes), and typography recommendations
        2. Product strategy with main categories, 15-20 specific recommended products with names and estimated prices, and pricing strategy
        3. Marketing plan with content strategy, social media recommendations, and launch strategy
        
        Make it detailed, creative, and commercially viable. Focus on products that can realistically be sourced and sold.
      `;

      const response = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            brand_identity: {
              type: "object",
              properties: {
                name: { type: "string" },
                tagline: { type: "string" },
                brand_voice: { type: "string" },
                color_scheme: { type: "array", items: { type: "string" } },
                typography: { type: "string" }
              }
            },
            product_strategy: {
              type: "object",
              properties: {
                main_categories: { type: "array", items: { type: "string" } },
                recommended_products: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      category: { type: "string" },
                      price: { type: "number" },
                      description: { type: "string" },
                      target_quantity: { type: "number" }
                    }
                  }
                },
                pricing_strategy: { type: "string" }
              }
            },
            marketing_plan: {
              type: "object",
              properties: {
                content_strategy: { type: "string" },
                social_media: { type: "array", items: { type: "string" } },
                launch_strategy: { type: "string" }
              }
            }
          }
        }
      });

      const conceptData = {
        ...projectData,
        generated_concept: response,
        status: "generated"
      };

      // Save to database
      const savedProject = await StoreProject.create(conceptData);
      setGeneratedData(conceptData);
      
    } catch (error) {
      console.error("Error generating store concept:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [projectData, setIsGenerating]); // Dependencies for useCallback

  useEffect(() => {
    // Call the memoized function
    generateStoreConcept();
  }, [generateStoreConcept]); // Dependency for useEffect

  const handleNext = () => {
    onGenerated(generatedData);
  };

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto glow-effect">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                AI is Creating Your Perfect Store...
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Our AI is analyzing your concept and generating a comprehensive store plan including branding, products, and marketing strategy.
              </p>
              <div className="flex items-center justify-center gap-2 text-purple-600">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">This may take 30-60 seconds</span>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!generatedData) return null;

  const { brand_identity, product_strategy, marketing_plan } = generatedData.generated_concept;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <h1 className="text-3xl font-bold text-gray-900">Your Store Concept is Ready!</h1>
        </div>
        <p className="text-gray-600">
          Here's your AI-generated store concept. Review and customize as needed.
        </p>
      </motion.div>

      {/* Brand Identity */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="floating-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-6 h-6 text-purple-500" />
              Brand Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{brand_identity.name}</h3>
                <p className="text-lg text-purple-600 italic mb-4">"{brand_identity.tagline}"</p>
                <p className="text-gray-600">{brand_identity.brand_voice}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Color Palette</h4>
                <div className="flex gap-2 mb-4">
                  {brand_identity.color_scheme?.map((color, index) => (
                    <div 
                      key={index}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Typography</h4>
                  <p className="text-gray-600">{brand_identity.typography}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Product Strategy */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="floating-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-6 h-6 text-green-500" />
              Product Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Main Categories</h4>
              <div className="flex flex-wrap gap-2">
                {product_strategy.main_categories?.map((category, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Recommended Products</h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {product_strategy.recommended_products?.map((product, index) => (
                  <Card key={index} className="p-4">
                    <h5 className="font-semibold text-sm">{product.name}</h5>
                    <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-green-600">${product.price}</span>
                      <span className="text-xs text-gray-500">Qty: {product.target_quantity}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Pricing Strategy</h4>
              <p className="text-gray-600">{product_strategy.pricing_strategy}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Marketing Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="floating-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-amber-500" />
              Marketing Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Content Strategy</h4>
                <p className="text-gray-600 text-sm">{marketing_plan.content_strategy}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Social Media</h4>
                <div className="space-y-1">
                  {marketing_plan.social_media?.map((platform, index) => (
                    <Badge key={index} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Launch Strategy</h4>
                <p className="text-gray-600 text-sm">{marketing_plan.launch_strategy}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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
          onClick={handleNext}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2 glow-effect"
        >
          Continue to Design
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
}
