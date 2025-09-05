import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Target, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

const niches = [
  "Fashion & Apparel", "Electronics & Gadgets", "Home & Garden", "Beauty & Cosmetics",
  "Sports & Fitness", "Books & Media", "Toys & Games", "Food & Beverages",
  "Health & Wellness", "Automotive", "Pet Supplies", "Art & Crafts",
  "Jewelry & Accessories", "Travel & Luggage", "Baby & Kids", "Office & Business"
];

const examples = [
  {
    title: "Sustainable Fashion",
    description: "Eco-friendly clothing made from recycled materials for environmentally conscious millennials",
    icon: "🌱"
  },
  {
    title: "Smart Home Tech", 
    description: "Cutting-edge home automation products for tech-savvy homeowners",
    icon: "🏠"
  },
  {
    title: "Artisan Coffee",
    description: "Premium single-origin coffee beans and brewing equipment for coffee enthusiasts",
    icon: "☕"
  }
];

export default function StoreConceptForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    store_name: "",
    store_description: "",
    target_audience: "",
    niche: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectExample = (example) => {
    setFormData(prev => ({
      ...prev,
      store_description: example.description
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="floating-card border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 glow-effect">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Describe Your Dream Store
          </CardTitle>
          <p className="text-gray-600">
            Tell us about your vision and we'll create the perfect e-commerce store for you
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Example Cards */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Need Inspiration? Try These Examples
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {examples.map((example, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-purple-300"
                        onClick={() => selectExample(example)}>
                    <CardContent className="p-4">
                      <div className="text-2xl mb-2">{example.icon}</div>
                      <h4 className="font-semibold mb-2">{example.title}</h4>
                      <p className="text-sm text-gray-600">{example.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="store_name" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Store Name (Optional)
                </Label>
                <Input
                  id="store_name"
                  value={formData.store_name}
                  onChange={(e) => handleInputChange('store_name', e.target.value)}
                  placeholder="e.g., EcoThread Boutique"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="niche" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Store Category
                </Label>
                <Select value={formData.niche} onValueChange={(value) => handleInputChange('niche', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose your niche" />
                  </SelectTrigger>
                  <SelectContent>
                    {niches.map(niche => (
                      <SelectItem key={niche} value={niche}>
                        {niche}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="store_description" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Describe Your Store Vision *
              </Label>
              <Textarea
                id="store_description"
                value={formData.store_description}
                onChange={(e) => handleInputChange('store_description', e.target.value)}
                placeholder="Describe what products you want to sell, your target customers, and what makes your store unique..."
                className="h-32 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_audience" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Target Audience (Optional)
              </Label>
              <Input
                id="target_audience"
                value={formData.target_audience}
                onChange={(e) => handleInputChange('target_audience', e.target.value)}
                placeholder="e.g., Millennials interested in sustainable fashion, ages 25-35"
                className="h-12"
              />
            </div>

            <motion.div 
              className="flex justify-end pt-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold glow-effect"
                disabled={isLoading || !formData.store_description.trim()}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Creating Your Store...
                  </>
                ) : (
                  <>
                    Generate My Store
                    <Zap className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
