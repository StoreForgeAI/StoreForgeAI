import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InvokeLLM } from "@/integrations/Core";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Download, FileText, DollarSign, 
  TrendingUp, Users, Package, Rocket, Loader2
} from "lucide-react";

export default function BusinessPlan({ projectData, onBack }) {
  const [businessPlan, setBusinessPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBusinessPlan = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      const { brand_identity, product_strategy, marketing_plan } = projectData.generated_concept;
      
      const prompt = `
        Create a comprehensive business plan for the e-commerce store "${brand_identity.name}".
        
        Store Details:
        - Brand: ${brand_identity.name} - ${brand_identity.tagline}
        - Products: ${product_strategy.recommended_products?.slice(0, 5).map(p => p.name).join(', ')}
        - Target Market: ${projectData.target_audience || 'Not specified'}
        - Categories: ${product_strategy.main_categories?.join(', ')}
        
        Generate a detailed business plan including:
        1. Executive summary
        2. Financial projections (startup costs, monthly expenses, revenue projections for first year)
        3. Implementation roadmap with specific steps and timeline
        4. Marketing budget and strategy breakdown
        5. Shopify setup requirements and costs
        6. Supplier recommendations and sourcing strategy
        7. Success metrics and KPIs to track
        8. Risk analysis and mitigation strategies
        
        Make it practical, actionable, and realistic for someone starting their first e-commerce business.
      `;

      const plan = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            executive_summary: { type: "string" },
            financial_projections: {
              type: "object",
              properties: {
                startup_costs: { type: "number" },
                monthly_expenses: { type: "number" },
                projected_revenue_month_1: { type: "number" },
                projected_revenue_month_6: { type: "number" },
                projected_revenue_year_1: { type: "number" },
                break_even_timeline: { type: "string" }
              }
            },
            implementation_roadmap: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  phase: { type: "string" },
                  timeline: { type: "string" },
                  tasks: { type: "array", items: { type: "string" } },
                  cost: { type: "number" }
                }
              }
            },
            marketing_strategy: {
              type: "object",
              properties: {
                monthly_budget: { type: "number" },
                channels: { type: "array", items: { type: "string" } },
                launch_campaign: { type: "string" },
                content_calendar: { type: "string" }
              }
            },
            shopify_setup: {
              type: "object",
              properties: {
                theme_recommendation: { type: "string" },
                required_apps: { type: "array", items: { type: "string" } },
                monthly_costs: { type: "number" }
              }
            },
            supplier_strategy: {
              type: "object",  
              properties: {
                sourcing_methods: { type: "array", items: { type: "string" } },
                recommended_suppliers: { type: "array", items: { type: "string" } },
                inventory_strategy: { type: "string" }
              }
            },
            success_metrics: { type: "array", items: { type: "string" } },
            risks_and_mitigation: { type: "array", items: { type: "object", properties: { risk: { type: "string" }, mitigation: { type: "string" } } } }
          }
        }
      });

      setBusinessPlan(plan);
      
    } catch (error) {
      console.error("Error generating business plan:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [projectData.generated_concept, projectData.target_audience]);

  useEffect(() => {
    generateBusinessPlan();
  }, [generateBusinessPlan]);

  const downloadBusinessPlan = () => {
    const planText = `
# Business Plan: ${projectData.generated_concept.brand_identity.name}

## Executive Summary
${businessPlan.executive_summary}

## Financial Projections
- Startup Costs: $${businessPlan.financial_projections.startup_costs?.toLocaleString()}
- Monthly Expenses: $${businessPlan.financial_projections.monthly_expenses?.toLocaleString()}
- Projected Revenue (Month 1): $${businessPlan.financial_projections.projected_revenue_month_1?.toLocaleString()}
- Projected Revenue (Month 6): $${businessPlan.financial_projections.projected_revenue_month_6?.toLocaleString()}
- Projected Revenue (Year 1): $${businessPlan.financial_projections.projected_revenue_year_1?.toLocaleString()}
- Break Even Timeline: ${businessPlan.financial_projections.break_even_timeline}

## Implementation Roadmap
${businessPlan.implementation_roadmap?.map(phase => `
### ${phase.phase} (${phase.timeline})
Cost: $${phase.cost?.toLocaleString()}
Tasks:
${phase.tasks?.map(task => `- ${task}`).join('\n')}
`).join('\n')}

## Marketing Strategy
- Monthly Budget: $${businessPlan.marketing_strategy.monthly_budget?.toLocaleString()}
- Channels: ${businessPlan.marketing_strategy.channels?.join(', ')}
- Launch Campaign: ${businessPlan.marketing_strategy.launch_campaign}
- Content Calendar: ${businessPlan.marketing_strategy.content_calendar}

## Shopify Setup Requirements
- Theme: ${businessPlan.shopify_setup.theme_recommendation}
- Required Apps: ${businessPlan.shopify_setup.required_apps?.join(', ')}
- Monthly Costs: $${businessPlan.shopify_setup.monthly_costs?.toLocaleString()}

## Supplier Strategy
- Sourcing Methods: ${businessPlan.supplier_strategy.sourcing_methods?.join(', ')}
- Recommended Suppliers: ${businessPlan.supplier_strategy.recommended_suppliers?.join(', ')}
- Inventory Strategy: ${businessPlan.supplier_strategy.inventory_strategy}

## Success Metrics
${businessPlan.success_metrics?.map(metric => `- ${metric}`).join('\n')}

## Risks and Mitigation
${businessPlan.risks_and_mitigation?.map(item => `- Risk: ${item.risk}\n  Mitigation: ${item.mitigation}`).join('\n')}
    `;

    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectData.generated_concept.brand_identity.name}-business-plan.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
                Creating Your Business Plan...
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Generating comprehensive financial projections, implementation roadmap, and marketing strategy.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!businessPlan) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Complete Business Plan</h1>
        <p className="text-gray-600 mb-6">
          Your comprehensive roadmap to launching {projectData.generated_concept.brand_identity.name}
        </p>
        <Button 
          onClick={downloadBusinessPlan}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white flex items-center gap-2 mx-auto glow-effect"
        >
          <Download className="w-4 h-4" />
          Download Full Business Plan
        </Button>
      </motion.div>

      {/* Executive Summary */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="floating-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-500" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{businessPlan.executive_summary}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Financial Projections */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="floating-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-500" />
              Financial Projections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-700 mb-2">Startup Costs</h4>
                <p className="text-2xl font-bold text-red-600">
                  ${businessPlan.financial_projections.startup_costs?.toLocaleString()}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-700 mb-2">Monthly Expenses</h4>
                <p className="text-2xl font-bold text-orange-600">
                  ${businessPlan.financial_projections.monthly_expenses?.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">Year 1 Revenue</h4>
                <p className="text-2xl font-bold text-green-600">
                  ${businessPlan.financial_projections.projected_revenue_year_1?.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">Break Even Timeline</h4>
              <p className="text-blue-600">{businessPlan.financial_projections.break_even_timeline}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Implementation Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="floating-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-6 h-6 text-amber-500" />
              Implementation Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {businessPlan.implementation_roadmap?.map((phase, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">{phase.phase}</h4>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      ${phase.cost?.toLocaleString()}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{phase.timeline}</p>
                  <ul className="space-y-1">
                    {phase.tasks?.map((task, taskIndex) => (
                      <li key={taskIndex} className="text-sm text-gray-700 flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Marketing & Setup */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="floating-card border-0 shadow-lg h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-pink-500" />
                Marketing Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Monthly Budget</h4>
                <p className="text-2xl font-bold text-pink-600">
                  ${businessPlan.marketing_strategy.monthly_budget?.toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Marketing Channels</h4>
                <div className="flex flex-wrap gap-2">
                  {businessPlan.marketing_strategy.channels?.map((channel, index) => (
                    <Badge key={index} variant="outline" className="bg-pink-50 text-pink-700">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Launch Campaign</h4>
                <p className="text-gray-600 text-sm">{businessPlan.marketing_strategy.launch_campaign}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="floating-card border-0 shadow-lg h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-6 h-6 text-indigo-500" />
                Shopify Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Monthly Costs</h4>
                <p className="text-2xl font-bold text-indigo-600">
                  ${businessPlan.shopify_setup.monthly_costs?.toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Theme Recommendation</h4>
                <p className="text-gray-600">{businessPlan.shopify_setup.theme_recommendation}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Required Apps</h4>
                <div className="space-y-1">
                  {businessPlan.shopify_setup.required_apps?.slice(0, 4).map((app, index) => (
                    <Badge key={index} variant="outline" className="bg-indigo-50 text-indigo-700 text-xs block w-full">
                      {app}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-between items-center"
      >
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Design
        </Button>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Launch?</h3>
          <p className="text-gray-600 text-sm mb-4">
            You now have everything needed to build your Shopify store!
          </p>
          <Button 
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white glow-effect"
          >
            Start Building on Shopify
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
