import { Box } from "@/components/atoms/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Smartphone, Sparkles } from "lucide-react";

interface PlatformUsageCardProps {
  totalAppCount: number;
  totalBotCount: number;
  totalAiCount?: number;
  formatNumber: (num: number) => string;
}

export function PlatformUsageCard({
  totalAppCount,
  totalBotCount,
  totalAiCount = 0,
  formatNumber,
}: PlatformUsageCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Total Platform Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Box className="flex flex-col space-y-1">
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-500" />
              <Box className="text-sm text-muted-foreground">App Total:</Box>
            </Box>
            <Box className="font-semibold">{formatNumber(totalAppCount)}</Box>
          </Box>
        </Box>
        <Box className="flex flex-col space-y-1">
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-green-500" />
              <Box className="text-sm text-muted-foreground">Bot Total:</Box>
            </Box>
            <Box className="font-semibold">{formatNumber(totalBotCount)}</Box>
          </Box>
        </Box>
        <Box className="flex flex-col space-y-1">
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <Box className="text-sm text-muted-foreground">AI Total:</Box>
            </Box>
            <Box className="font-semibold">{formatNumber(totalAiCount)}</Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
