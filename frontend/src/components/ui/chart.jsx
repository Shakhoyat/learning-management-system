import * as React from "react"
import { cn } from "../../lib/utils"

const ChartContainer = React.forwardRef(
    ({ className, children, config, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex aspect-video justify-center text-xs",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) {
        return null
    }

    return (
        <div className="rounded-lg border bg-white p-2 shadow-lg">
            <p className="text-sm font-medium text-gray-900">{label}</p>
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                    <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-gray-600">{entry.name}:</span>
                    <span className="font-medium text-gray-900">{entry.value}</span>
                </div>
            ))}
        </div>
    )
}

const ChartTooltipContent = React.forwardRef(
    ({ className, hideLabel = false, label, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs shadow-xl",
                    className
                )}
                {...props}
            />
        )
    }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = ({ payload }) => {
    if (!payload || !payload.length) {
        return null
    }

    return (
        <div className="flex flex-wrap gap-4 justify-center mt-4">
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                    <div
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-gray-700">{entry.value}</span>
                </div>
            ))}
        </div>
    )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend }
