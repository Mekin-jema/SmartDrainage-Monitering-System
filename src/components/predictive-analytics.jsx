import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

export function PredictiveAnalytics({ data }) {
  const predictions = {
    overflowRisk: {
      value: 35,
      trend: "increasing",
      threshold: 70,
    },
    maintenanceNeeded: {
      value: 45,
      trend: "stable",
      threshold: 60,
    },
    systemHealth: {
      value: 82,
      trend: "decreasing",
      threshold: 50,
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            Overflow Risk
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{predictions.overflowRisk.value}%</span>
              {predictions.overflowRisk.trend === "increasing" ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500" />
              )}
            </div>
            <Progress value={predictions.overflowRisk.value} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Risk threshold: {predictions.overflowRisk.threshold}%
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            Maintenance Needed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{predictions.maintenanceNeeded.value}%</span>
              {predictions.maintenanceNeeded.trend === "increasing" ? (
                <TrendingUp className="h-4 w-4 text-amber-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500" />
              )}
            </div>
            <Progress value={predictions.maintenanceNeeded.value} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Recommended threshold: {predictions.maintenanceNeeded.threshold}%
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-green-500" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{predictions.systemHealth.value}%</span>
              {predictions.systemHealth.trend === "increasing" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <Progress value={predictions.systemHealth.value} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Health threshold: {predictions.systemHealth.threshold}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 