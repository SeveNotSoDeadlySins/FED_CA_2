import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FormCard({
  title,
  onSubmit,
  submitText = "Save",
  children,
}) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            {children}
          </div>

          <div className="mt-4">
            <Button
              type="submit"
              variant="outline"
              className="w-full"
            >
              {submitText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
