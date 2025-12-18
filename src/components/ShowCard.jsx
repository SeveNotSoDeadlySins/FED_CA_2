import {
  Card,
  CardContent,
} from "@/components/ui/card";


export default function ShowCard({
  icon: Icon,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
  title,
  children,
  hover = true,
}) {
  return (
    <Card
      className={`
        bg-white border rounded-lg
        p-6 md:p-8
        shadow-sm
        min-w-[500px]
        ${hover ? "hover:shadow-md transition-all" : ""}
      `}
    >
      <CardContent className="p-0">
        <div className="flex items-start gap-4">
          {/* Icon */}
          {Icon && (
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-md ${iconBg} ${iconColor}`}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 text-lg">
            {title && (
              <h3 className="text-xl font-semibold mb-2">
                {title}
              </h3>
            )}

            <div className="space-y-1 text-gray-700">
              {children}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
