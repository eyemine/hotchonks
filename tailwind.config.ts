import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				carbon: {
					dark: 'hsl(var(--carbon-dark))',
					medium: 'hsl(var(--carbon-medium))',
					light: 'hsl(var(--carbon-light))'
				},
				bio: {
					green: 'hsl(var(--bio-green))',
					light: 'hsl(var(--bio-light))',
					glow: 'hsl(var(--bio-glow))'
				},
				earth: {
					brown: 'hsl(var(--earth-brown))',
					gold: 'hsl(var(--earth-gold))'
				}
			},
			backgroundImage: {
				'gradient-carbon': 'var(--gradient-carbon)',
				'gradient-bio': 'var(--gradient-bio)',
				'gradient-flow': 'var(--gradient-flow)',
				'gradient-mesh': 'var(--gradient-mesh)'
			},
			boxShadow: {
				'bio': 'var(--shadow-bio)',
				'glow': 'var(--shadow-glow)',
				'card': 'var(--shadow-card)'
			},
			transitionTimingFunction: {
				'organic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'bio-pulse': {
					'0%, 100%': {
						opacity: '0.4',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '0.8',
						transform: 'scale(1.05)'
					}
				},
				'carbon-flow': {
					'0%': {
						backgroundPosition: '0% 0%'
					},
					'100%': {
						backgroundPosition: '100% 100%'
					}
				},
				'organic-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsl(var(--bio-green) / 0.2)'
					},
					'50%': {
						boxShadow: '0 0 40px hsl(var(--bio-glow) / 0.4)'
					}
				},
				'mycelial-grow': {
					'0%': {
						transform: 'scale(0.9)',
						opacity: '0.6'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'bio-pulse': 'bio-pulse 3s ease-in-out infinite',
				'carbon-flow': 'carbon-flow 20s linear infinite',
				'organic-glow': 'organic-glow 4s ease-in-out infinite',
				'mycelial-grow': 'mycelial-grow 0.6s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
