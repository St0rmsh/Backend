import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const AuthCard = ({ title, description, children, footer }: AuthCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="max-w-md mx-auto rounded-xl shadow-lg sm:border sm:shadow-lg overflow-hidden">
        <CardHeader className="space-y-2 text-center sm:text-left pt-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</CardTitle>
          {description && (
            <CardDescription className="text-base text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-2">
          {children}
        </CardContent>
        {footer && (
          <div className="px-8 pb-6 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        )}
      </Card>
    </motion.div>
  );
};
