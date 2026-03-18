import { useState, forwardRef, type ImgHTMLAttributes } from 'react'
import { cn } from '../cn'

type ImageFit = 'cover' | 'contain' | 'fill' | 'none'
type ImageRadius = 'none' | 'sm' | 'md' | 'lg' | 'full'

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'placeholder'> {
  /** Object-fit behavior */
  fit?: ImageFit
  /** Border radius */
  radius?: ImageRadius
  /** Fallback content when image fails to load */
  fallback?: React.ReactNode
  /** Aspect ratio (e.g., "16/9", "1/1", "4/3") */
  aspectRatio?: string
}

const radiusMap: Record<ImageRadius, string> = {
  none: '0',
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  full: 'var(--radius-full)',
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      fit = 'cover',
      radius = 'none',
      fallback,
      aspectRatio,
      className,
      style,
      alt = '',
      onError,
      ...props
    },
    ref
  ) => {
    const [hasError, setHasError] = useState(false)

    if (hasError && fallback) {
      return (
        <div
          className={cn('image-fallback', className)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: radiusMap[radius],
            background: 'var(--bg-secondary)',
            color: 'var(--text-disabled)',
            aspectRatio,
            ...style,
          }}
        >
          {fallback}
        </div>
      )
    }

    return (
      <img
        ref={ref}
        alt={alt}
        className={className}
        style={{
          display: 'block',
          objectFit: fit,
          borderRadius: radiusMap[radius],
          aspectRatio,
          ...style,
        }}
        onError={(e) => {
          setHasError(true)
          onError?.(e)
        }}
        {...props}
      />
    )
  }
)

Image.displayName = 'Image'
