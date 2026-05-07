import { Text, type TextProps } from 'react-native';

interface MysticTextProps extends TextProps {
  variant?: 'heading' | 'subheading' | 'body' | 'muted' | 'gold';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const variantClass: Record<NonNullable<MysticTextProps['variant']>, string> = {
  heading: 'font-heading text-text',
  subheading: 'font-heading-bold text-text',
  body: 'font-body text-text',
  muted: 'font-body text-textMuted',
  gold: 'font-heading text-gold',
};

const sizeClass: Record<NonNullable<MysticTextProps['size']>, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-md',
  lg: 'text-lg',
  xl: 'text-xl',
  xxl: 'text-xxl',
};

/** Themed text component using Cinzel/Lato font families with design tokens. */
export function MysticText({
  variant = 'body',
  size = 'md',
  className = '',
  children,
  ...props
}: MysticTextProps) {
  return (
    <Text
      className={`${variantClass[variant]} ${sizeClass[size]} ${className}`}
      allowFontScaling
      {...props}
    >
      {children}
    </Text>
  );
}
