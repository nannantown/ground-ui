import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../cn'

type AspectRatioPreset = '1:1' | '16:9' | '4:3' | '3:2' | '2:1'

interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /** Aspect ratio as a preset string or a numeric value (width / height) */
  ratio?: AspectRatioPreset | number
}

const presetClassMap: Record<AspectRatioPreset, string> = {
  '1:1': 'aspect-square',
  '16:9': 'aspect-video',
  '4:3': 'aspect-4/3',
  '3:2': 'aspect-3/2',
  '2:1': 'aspect-2/1',
}

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = '16:9', className, style, children, ...props }, ref) => {
    const isPreset = typeof ratio === 'string'
    const presetClass = isPreset ? presetClassMap[ratio] : undefined

    return (
      <div
        ref={ref}
        className={cn(presetClass, className)}
        style={{
          position: 'relative',
          overflow: 'hidden',
          ...(!isPreset ? { aspectRatio: ratio } : undefined),
          ...style,
        }}
        {...props}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </div>
      </div>
    )
  }
)

AspectRatio.displayName = 'AspectRatio'
