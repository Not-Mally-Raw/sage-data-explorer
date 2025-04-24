
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  tabs?: string[];
  tabsContent?: Record<string, React.ReactNode>;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  tabs,
  tabsContent,
  className,
}) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {tabs && tabsContent && (
          <Tabs defaultValue={tabs[0]} className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4">
              {tabs.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent key={tab} value={tab}>
                {tabsContent[tab]}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardHeader>
      <CardContent className="pt-2">{children}</CardContent>
    </Card>
  );
};

export default ChartCard;
