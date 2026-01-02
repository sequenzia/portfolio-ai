"use client";

import type { CardContentData } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent as CardBody,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CardContentProps {
  data: CardContentData;
}

export function CardContent({ data }: CardContentProps) {
  const handleAction = (action: string, label: string) => {
    toast.info(`Action triggered: ${label}`);
    console.log("Card action:", action);
  };

  return (
    <Card className="overflow-hidden">
      {data.media && (
        <div className="relative w-full h-48 flex-shrink-0 overflow-hidden bg-muted">
          {data.media.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.media.url}
              alt={data.media.alt || data.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <video
              src={data.media.url}
              controls
              className="w-full h-full object-contain"
            >
              <track kind="captions" />
            </video>
          )}
        </div>
      )}

      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        {data.description && (
          <CardDescription>{data.description}</CardDescription>
        )}
      </CardHeader>

      {data.content && (
        <CardBody>
          <p className="text-sm text-foreground">{data.content}</p>
        </CardBody>
      )}

      {data.actions && data.actions.length > 0 && (
        <CardFooter className="flex flex-wrap gap-2">
          {data.actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "default"}
              onClick={() => handleAction(action.action, action.label)}
            >
              {action.label}
            </Button>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
