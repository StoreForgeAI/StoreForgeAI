import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Store, Users, DollarSign, Package } from "lucide-react";

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your store building progress and performance</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Projects", value: "0", icon: Store, color: "purple" },
            { title: "Stores Generated", value: "0", icon: BarChart3, color: "blue" },  
            { title: "Products Planned", value: "0", icon: Package, color: "green" },
            { title: "Est. Revenue", value: "$0", icon: DollarSign, color: "amber" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="floating-card border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 opacity-20">
            <TrendingUp className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
          <p className="text-gray-600">
            Detailed analytics and insights will be available once you start creating store projects
          </p>
        </motion.div>
      </div>
    </div>
  );
}
