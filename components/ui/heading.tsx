import { Badge } from "@/components/ui/badge";

interface HeadingProps {
  title: string;
  description: string;
  status?: string | number;
}

export const Heading: React.FC<HeadingProps> = ({ title, description, status }) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {status != null && Number(status) > 0 && (
          <Badge variant="secondary" className="ml-2">
            {status}
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        {description}
      </p>
    </div>
  );
};
